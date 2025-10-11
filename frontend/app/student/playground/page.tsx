"use client";

import React from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import PageHeader from "@/components/PageHeader";
import Toolbox from "@/components/teacher/create-problem/Toolbox";
import MainArea from "@/components/teacher/create-problem/MainArea";
import ShapeLimitPopup from "@/components/teacher/create-problem/ShapeLimitPopup";

// Hooks
import { useShapeManagement } from "@/hooks/teacher/useShapeManagement";
import { usePropertiesManagement } from "@/hooks/teacher/usePropertiesManagement";
import { useAuthStore } from "@/store/authStore";

const MAX_SHAPES = 1;

export default function PlaygroundPage() {
  const { userProfile } = useAuthStore();

  // Custom hooks
  const {
    shapes,
    setShapes,
    selectedId,
    setSelectedId,
    selectedTool,
    setSelectedTool,
    pxToUnits,
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

  // Local state
  const [showLimitPopup, setShowLimitPopup] = React.useState(false);

  const handleLimitReached = () => {
    setShowLimitPopup(true);
  };

  return (
    <div className={styles.playgroundRoot}>
      <PageHeader
        title="Geometry Playground"
        userName={userProfile?.first_name}
        subtitle="Explore shapes and their properties"
        showAvatar={true}
      />

      <div className={styles.playgroundWorkspace}>
        {/* Left Sidebar - Toolbox */}
        <div className={styles.sidebar}>
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

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <MainArea
            shapes={shapes}
            setShapes={setShapes}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setSelectedTool={setSelectedTool}
            shapeLimit={MAX_SHAPES}
            shapeCount={shapes.length}
            onLimitReached={handleLimitReached}
            onAllShapesDeleted={handleAllShapesDeleted}
            pxToUnits={pxToUnits}
            showAreaByShape={showAreaByShape}
            showSides={showSides}
            showAngles={showAngles}
            showDiameter={showDiameter}
            showCircumference={showCircumference}
            showHeight={showHeight}
          />
        </div>
      </div>

      {/* Shape Limit Popup */}
      {showLimitPopup && (
        <ShapeLimitPopup onClose={() => setShowLimitPopup(false)} />
      )}
    </div>
  );
}
