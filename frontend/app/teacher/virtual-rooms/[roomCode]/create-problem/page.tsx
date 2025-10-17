"use client";

import styles from "@/styles/create-problem-teacher.module.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback, use } from "react";
import Swal from "sweetalert2";

// Components
import DifficultyDropdown from "@/components/teacher/create-problem/DifficultyDropdown";
import Toolbox from "@/components/teacher/create-problem/Toolbox";
import MainArea from "@/components/teacher/create-problem/MainArea";
import PromptBox from "@/components/teacher/create-problem/PromptBox";
import Timer from "@/components/teacher/create-problem/Timer";
import LimitAttempts from "@/components/teacher/create-problem/LimitAttempts";
import SetVisibility from "@/components/teacher/create-problem/SetVisibility";
import ShapeLimitPopup from "@/components/teacher/create-problem/ShapeLimitPopup";
import ProblemsList from "@/components/teacher/create-problem/ProblemsList";

// Hooks
import { useShapeManagement } from "@/hooks/teacher/useShapeManagement";
import { usePropertiesManagement } from "@/hooks/teacher/usePropertiesManagement";
import { useProblemFormState } from "@/hooks/teacher/useProblemFormState";

// Store and API
import { useTeacherRoomStore } from "@/store/teacherRoomStore";
import { ProblemPayload, TProblemType } from "@/types";

const XP_MAP = { Easy: 10, Intermediate: 20, Hard: 30 };
const MAX_SHAPES = 1;

export default function CreateProblemPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const router = useRouter();
  const { roomCode } = use(params);

  // Store
  const { 
    currentRoom, 
    currentProblem, 
    setCurrentProblem, 
    clearCurrentProblem,
    addProblemToRoom,
    updateProblemInRoom,
    removeProblemFromRoom
} = useTeacherRoomStore();
console.log("Current Room in CreateProblemPage:", currentRoom);
  const problems : TProblemType[] = currentRoom?.problems || [];

  // Custom hooks
  const {
    shapes,
    setShapes,
    selectedId,
    setSelectedId,
    selectedTool,
    setSelectedTool,
    pxToUnits,
    getShapeProperties,
  } = useShapeManagement();

  const {
    showSides,
    setShowSides,
    showAngles,
    setShowAngles,
    showHeight,
    setShowHeight,
    showDiameter,
    setShowDiameter,
    showCircumference,
    setShowCircumference,
    showAreaByShape,
    setShowAreaByShape,
    handleAllShapesDeleted,
  } = usePropertiesManagement(shapes);

  const {
    title,
    setTitle,
    prompt,
    setPrompt,
    editingPrompt,
    setEditingPrompt,
    promptInputRef,
    difficulty,
    setDifficulty,
    timerOpen,
    setTimerOpen,
    timerValue,
    setTimerValue,
    hintOpen,
    setHintOpen,
    hint,
    setHint,
    limitAttempts,
    setLimitAttempts,
    visible,
    setVisible,
    showLimitPopup,
    setShowLimitPopup,
    resetForm,
  } = useProblemFormState();

  // Focus prompt input when editing
  useEffect(() => {
    if (editingPrompt && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [editingPrompt]);


  // ADD THIS NEW USEEFFECT:
  // Load room details (including problems) when page loads
  // useEffect(() => {
  //   if (roomCode && (!currentRoom || currentRoom.code !== roomCode)) {
  //     fetchRoomDetails(roomCode);
  //   }
  // }, [roomCode, currentRoom, fetchRoomDetails]);

  // Handle keyboard delete for shapes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);

      if (!isInput && (e.key === "Delete" || e.key === "Backspace") && selectedId !== null) {
        setShapes(prev => {
          const newShapes = prev.filter(shape => shape.id !== selectedId);
          if (newShapes.length === 0) {
            handleAllShapesDeleted();
          }
          return newShapes;
        });
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, setShapes, setSelectedId, handleAllShapesDeleted]);

  const handleSave = async () => {
    const shapesWithProps = shapes.map(getShapeProperties);

    const payload: ProblemPayload = {
        title,
        description: prompt,
        expected_solution: shapesWithProps,
        difficulty,
        visibility: visible ? "show" : "hide",
        max_attempts: limitAttempts,
        expected_xp: XP_MAP[difficulty as keyof typeof XP_MAP],
        timer: timerOpen ? timerValue : null,
        hint: hintOpen ? hint : null,
    };

    try {
        if (!currentProblem) {
            // CREATE: Call API and add to store
            // const response = await createProblem(payload, roomCode);
            
            // Add the newly created problem to the array (no API call needed!)
            const res = await addProblemToRoom(payload); // Assuming API returns the created problem
            if (!res.success) {
                return Swal.fire({
                    title: "Error",
                    text: res.error || "Failed to create problem",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }

            await Swal.fire({
                title: "Problem Created",
                text: "Your problem has been successfully created!",
                icon: "success",
                confirmButtonText: "OK",
            });
        } else {
            // UPDATE: Call API and update in store
            // const response = await updateProblem(currentProblem.id, payload);
            
            // Update the problem in the array (no API call needed!)
            const res = await updateProblemInRoom(currentProblem.id, payload); // Assuming API returns updated problem
            if (!res.success) {
              return Swal.fire({
                    title: "Error",
                    text: res.error || "Failed to update problem",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
            await Swal.fire({
                title: "Problem Edited",
                text: "Your problem has been successfully edited!",
                icon: "success",
                confirmButtonText: "OK",
            });
        }
        
        // No fetchProblems(roomCode) needed anymore! ✅
        
        resetForm();
        setShapes([]);
        setSelectedId(null);
        handleAllShapesDeleted();
        clearCurrentProblem();
    } catch (error) {
        console.error("Save error:", error);
        await Swal.fire({
            title: "Error",
            text: currentProblem 
                ? "There was an error editing the problem. Please try again."
                : "There was an error creating the problem. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
        });
    }
};

  const handleDeleteProblem = async (problemId: string) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
        try {
            // await deleteProblem(problemId);
            
            // Remove from array (no API call needed!)
            const res = await removeProblemFromRoom(problemId);

            if (res.success) {
                await Swal.fire("Deleted!", "Your problem has been deleted.", "success");
            } else {
                console.log(res.error);
                await Swal.fire("Error!", "Failed to delete the problem.", "error");
            }
        } catch (error) {
            console.error("Error deleting problem:", error);
            await Swal.fire("Error!", "Failed to delete the problem.", "error");
        }
    }
  };

  const handleEditProblem = useCallback(async (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;

    setCurrentProblem(problem);
    setTitle(problem.title || "");
    setPrompt(problem.description || "");
    setShapes(problem.expected_solution || []);
    setDifficulty(problem.difficulty || "Easy");
    setLimitAttempts(problem.max_attempts || 1);
    setTimerOpen(problem.timer !== null && problem.timer !== undefined);
    setTimerValue(typeof problem.timer === 'number' ? problem.timer : 5);
    setHintOpen(problem.hint !== null && problem.hint !== undefined);
    setHint(problem.hint ?? "");
    setVisible(problem.visibility === "show");
  }, [problems, setCurrentProblem, setTitle, setPrompt, setShapes, setDifficulty, setLimitAttempts, setTimerOpen, setTimerValue, setHintOpen, setHint, setVisible]);

  return (
    <div className={styles.root}>
      {/* Back Button */}
      <button 
        onClick={() => router.push(`/teacher/virtual-rooms/${roomCode}`)}
        className={styles.backButton}
        aria-label="Go back to room details"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Room
      </button>

      <div className={styles.workspace}>
        {/* Left Sidebar - Difficulty + Toolbox */}
        <div className={styles.sidebar}>
          <DifficultyDropdown difficulty={difficulty} setDifficulty={setDifficulty} />
          <Toolbox
            shapes={shapes}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            showSides={showSides}
            setShowSides={setShowSides}
            showAngles={showAngles}
            setShowAngles={setShowAngles}
            showHeight={showHeight}
            setShowHeight={setShowHeight}
            showDiameter={showDiameter}
            setShowDiameter={setShowDiameter}
            showCircumference={showCircumference}
            setShowCircumference={setShowCircumference}
            showAreaByShape={showAreaByShape}
            setShowAreaByShape={setShowAreaByShape}
          />
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Title Input */}
          <input 
            className={styles.input} 
            placeholder="Problem Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />

          {/* Prompt Box */}
          <PromptBox
            prompt={prompt}
            setPrompt={setPrompt}
            editingPrompt={editingPrompt}
            setEditingPrompt={setEditingPrompt}
            promptInputRef={promptInputRef}
          />

          {/* Main Drawing Area */}
          <MainArea
            shapes={shapes}
            setShapes={setShapes}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setSelectedTool={setSelectedTool}
            saveButton={
              <button className={`${styles.saveBtn} ${styles.rowBtn}`} onClick={handleSave}>
                {currentProblem ? "Update Problem" : "Save Problem"}
              </button>
            }
            shapeLimit={MAX_SHAPES}
            shapeCount={shapes.length}
            onLimitReached={() => setShowLimitPopup(true)}
            onAllShapesDeleted={handleAllShapesDeleted}
            pxToUnits={pxToUnits}
            showAreaByShape={showAreaByShape}
            showSides={showSides}
            showAngles={showAngles}
            showDiameter={showDiameter}
            showCircumference={showCircumference}
            showHeight={showHeight}
          />

          {/* Controls */}
          <div className={styles.controlsRow}>
            <LimitAttempts limit={limitAttempts} setLimit={setLimitAttempts} />
            <Timer 
              timerOpen={timerOpen} 
              setTimerOpen={setTimerOpen} 
              timerValue={timerValue} 
              setTimerValue={setTimerValue} 
            />
            {(hintOpen || hint) ? (
              <div className={styles.timerContainer}>
                <span className={styles.controlLabel}>Hint</span>
                <div className={styles.timerInputGroup}>
                  <input
                    className={styles.hintInput}
                    type="text"
                    value={hint}
                    onChange={e => setHint(e.target.value)}
                    onBlur={() => { if (!hint) setHintOpen(false); }}
                    placeholder="Enter hint..."
                    autoFocus={hintOpen}
                  />
                </div>
              </div>
            ) : (
              <button className={`${styles.addHintBtn} ${styles.rowBtn}`} onClick={() => setHintOpen(true)}>
                Add Hint
              </button>
            )}
            <SetVisibility visible={visible} setVisible={setVisible} />
          </div>
        </div>

        {/* Right Sidebar - Problems List */}
        <div className={styles.problemsSidebar}>
          <div className={styles.problemsSidebarHeader}>
            Existing Problems
          </div>
          <div className={styles.problemsContent}>
            <ProblemsList
              problems={problems}
              onEdit={handleEditProblem}
              onDelete={handleDeleteProblem}
            />
          </div>
        </div>
      </div>

      {/* Popup */}
      {showLimitPopup && (
        <ShapeLimitPopup onClose={() => setShowLimitPopup(false)} />
      )}
    </div>
  );
};