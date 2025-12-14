"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/api/axios';
import { submitProblemAttempt, getUserProblemStats } from '@/api/problems';
import MainArea from '@/components/teacher/create-problem/MainArea';
import { useShapeManagement } from '@/hooks/teacher/useShapeManagement';
import { usePropertiesManagement } from '@/hooks/teacher/usePropertiesManagement';
import Toolbox from '@/components/teacher/create-problem/Toolbox';
import PropertiesPanel from '@/components/teacher/create-problem/PropertiesPanel';
import styles from './solve-problem.module.css';
import Swal from 'sweetalert2';
import Loader from '@/components/Loader';

const MAX_SHAPES = 1;

export default function SolveProblemPage({ params }: { params: Promise<{ roomCode: string; problemId: string }> }) {
  const router = useRouter();
  const { roomCode, problemId } = use(params);
  
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  
  // Shape management
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
    showLength,
    setShowLength,
    showMidpoint,
    setShowMidpoint,
    showMeasurement,
    setShowMeasurement,
    showArcRadius,
    setShowArcRadius,
    showAreaByShape,
    setShowAreaByShape,
    handleAllShapesDeleted,
  } = usePropertiesManagement(shapes);

  useEffect(() => {
    fetchProblemDetails();
    fetchUserStats();
    
    // Load timer from localStorage
    const saved = localStorage.getItem(`timer_${problemId}`);
    if (saved) {
      const savedTime = parseInt(saved);
      setTimer(savedTime);
    }
  }, [problemId]);

  // Timer effect with persistence
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1;
          // Save to localStorage on each tick
          if (typeof window !== 'undefined') {
            localStorage.setItem(`timer_${problemId}`, newTime.toString());
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, problemId]);

  // Start timer when component mounts
  useEffect(() => {
    setTimerRunning(true);
    
    // Clean up timer on unmount
    return () => {
      setTimerRunning(false);
    };
  }, []);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/problems/public-problem/${problemId}`);
      setProblem(response.data.data);
    } catch (error) {
      console.error('Error fetching problem:', error);
      Swal.fire('Error', 'Failed to load problem details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await getUserProblemStats(problemId);
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSubmit = async () => {
    if (shapes.length === 0) {
      Swal.fire('No Solution', 'Please draw at least one shape before submitting.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      setTimerRunning(false); // Stop timer

      const shapesWithProps = shapes.map(getShapeProperties);
      
      // Prepare solution data
      const solution = {
        shapes: shapesWithProps,
        time_spent: timer,
      };

      // Submit to backend
      const response = await submitProblemAttempt(problemId, solution);

      if (response.success) {
        const result = response.data;
        
        // Clear timer from localStorage on successful submission
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`timer_${problemId}`);
        }
        
        // Show grading result
        await Swal.fire({
          title: result.is_correct ? '🎉 Correct!' : '❌ Incorrect',
          html: `
            <div style="text-align: left; padding: 1rem;">
              <p style="font-size: 1.1rem; margin-bottom: 1rem;">${result.feedback}</p>
              
              <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                <strong style="color: #2c514c;">Score:</strong> 
                <span style="font-size: 1.5rem; font-weight: bold; color: ${result.score >= 70 ? '#10b981' : '#ef4444'};">
                  ${result.score.toFixed(1)}/100
                </span>
              </div>
              
              <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem;">
                <strong style="color: #92400e;">XP Gained:</strong> 
                <span style="font-size: 1.3rem; font-weight: bold; color: #78350f;">
                  +${result.xp_gained} XP
                </span>
              </div>
              
              ${result.validation_details ? `
                <div style="margin-top: 1rem; font-size: 0.9rem; color: #6b7280;">
                  <p><strong>What was checked:</strong></p>
                  <ul style="text-align: left;">
                    ${result.validation_details.shape_valid !== undefined ? `<li>Shape Type: ${result.validation_details.shape_valid ? '✅' : '❌'}</li>` : ''}
                    ${result.validation_details.calculation_correct !== undefined ? `<li>Calculation: ${result.validation_details.calculation_correct ? '✅' : '❌'}</li>` : ''}
                  </ul>
                </div>
              ` : ''}
            </div>
          `,
          icon: result.is_correct ? 'success' : 'error',
          confirmButtonText: 'View Leaderboard',
          showCancelButton: true,
          cancelButtonText: 'Try Again',
          confirmButtonColor: '#2c514c',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/student/joined-rooms/${roomCode}/practice-problems/${problemId}/leaderboard`);
          } else {
            // Reset for another attempt
            setShapes([]);
            setTimer(0);
            // Clear timer from localStorage
            if (typeof window !== 'undefined') {
              localStorage.removeItem(`timer_${problemId}`);
            }
            setTimerRunning(true);
            fetchUserStats();
          }
        });
      } else {
        Swal.fire('Error', response.message || 'Failed to submit solution', 'error');
        setTimerRunning(true); // Resume timer
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire('Error', 'An error occurred while submitting your solution', 'error');
      setTimerRunning(true); // Resume timer
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Loader />;
  }

  if (!problem) {
    return (
      <div className={styles.errorContainer}>
        <h2>Problem not found</h2>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className={styles.problemContainer}>
      <div className={styles.scrollableContent}>
        {/* Header */}
        <div className={styles.header}>
        <button 
          onClick={() => router.push(`/student/joined-rooms/${roomCode}`)}
          className={styles.backButton}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Room
        </button>

        <div className={styles.titleSection}>
          <h1 className={styles.problemTitle}>{problem.title}</h1>
          <div className={styles.badges}>
            <span className={styles.difficultyBadge} data-difficulty={problem.difficulty}>
              {problem.difficulty}
            </span>
            <span className={styles.typeBadge}>
              {problem.problem_type?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⏱️</span>
          <span className={styles.statLabel}>Time:</span>
          <span className={styles.statValue}>{formatTime(timer)}</span>
        </div>
        {userStats && (
          <>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🎯</span>
              <span className={styles.statLabel}>Your Best:</span>
              <span className={styles.statValue}>{userStats.best_score?.toFixed(1) || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>📝</span>
              <span className={styles.statLabel}>Attempts:</span>
              <span className={styles.statValue}>{userStats.attempts || 0}</span>
            </div>
          </>
        )}
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⭐</span>
          <span className={styles.statLabel}>XP:</span>
          <span className={styles.statValue}>{problem.expected_xp}</span>
        </div>
      </div>

      {/* Problem Description */}
      <div className={styles.descriptionCard}>
        <h3 className={styles.descriptionTitle}>Problem Description</h3>
        <p className={styles.description}>{problem.description}</p>
        {problem.hint && (
          <div className={styles.hint}>
            <span className={styles.hintIcon}>💡</span>
            <span>{problem.hint}</span>
          </div>
        )}
      </div>

      {/* Workspace */}
      <div className="playgroundWorkspaceWithPanel" style={{ 
        display: 'grid',
        gridTemplateColumns: '250px 1fr 300px',
        gap: '1rem',
        minHeight: '600px',
        background: 'transparent'
      }}>
        {/* Toolbox */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 12rem)',
          display: 'flex',
          flexDirection: 'column'
        }}>
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
            showLength={showLength}
            setShowLength={setShowLength}
            showMidpoint={showMidpoint}
            setShowMidpoint={setShowMidpoint}
            showMeasurement={showMeasurement}
            setShowMeasurement={setShowMeasurement}
            showArcRadius={showArcRadius}
            setShowArcRadius={setShowArcRadius}
            showAreaByShape={showAreaByShape}
            setShowAreaByShape={setShowAreaByShape}
          />
        </div>

        {/* Main Drawing Area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minHeight: '0'
        }}>
          <MainArea
            shapes={shapes}
            setShapes={setShapes}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            saveButton={null}
            shapeLimit={MAX_SHAPES}
            shapeCount={shapes.length}
            onLimitReached={() => {}}
            onAllShapesDeleted={handleAllShapesDeleted}
            pxToUnits={pxToUnits}
            disabled={false}
            showAreaByShape={showAreaByShape}
            showSides={showSides}
            showAngles={showAngles}
            showDiameter={showDiameter}
            showCircumference={showCircumference}
            showHeight={showHeight}
            showLength={showLength}
            showMidpoint={showMidpoint}
            showMeasurement={showMeasurement}
            showArcRadius={showArcRadius}
          />

          {/* Submit Button */}
          <div style={{
            padding: '1rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <button
              style={{
                background: submitting || shapes.length === 0 ? '#ccc' : 'linear-gradient(135deg, #2c514c 0%, #3d6b64 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: submitting || shapes.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 auto'
              }}
              onClick={handleSubmit}
              disabled={submitting || shapes.length === 0}
            >
              {submitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Grading...
                </>
              ) : (
                <>
                  Submit Solution
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 12rem)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <PropertiesPanel
            selectedShape={shapes.find(shape => shape.id === selectedId) || null}
            pxToUnits={pxToUnits}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
