"use client";

import React from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import PageHeader from "@/components/PageHeader";
import Toolbox from "@/components/teacher/create-problem/Toolbox";
import MainArea from "@/components/teacher/create-problem/MainArea";
import PropertiesPanel from "@/components/teacher/create-problem/PropertiesPanel";
import ShapeLimitPopup from "@/components/teacher/create-problem/ShapeLimitPopup";
import LandscapePrompt from "@/components/LandscapePrompt";

// Hooks
import { useShapeManagement } from "@/hooks/teacher/useShapeManagement";
import { usePropertiesManagement } from "@/hooks/teacher/usePropertiesManagement";
import { useAuthStore } from "@/store/authStore";

const MAX_SHAPES = 5; // Allow up to 5 shapes in playground

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

  // Local state
  const [showLimitPopup, setShowLimitPopup] = React.useState(false);

  const handleLimitReached = () => {
    setShowLimitPopup(true);
  };

  // Get selected shape
  const selectedShape = shapes.find(shape => shape.id === selectedId) || null;

  return (
    <div className={styles.playgroundRoot}>
      {/* Landscape Prompt for Mobile Portrait */}
      <LandscapePrompt />
      
      <PageHeader
        title="Geometry Playground"
        userName={userProfile?.first_name}
        subtitle="Explore shapes and their properties"
        showAvatar={true}
      />

      <div className={styles.playgroundWorkspaceWithPanel}>
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
            showLength={showLength}
            showMidpoint={showMidpoint}
            showMeasurement={showMeasurement}
            showArcRadius={showArcRadius}
          />
        </div>

        {/* Properties Panel - Right Side */}
        <div className={styles.propertiesPanelContainer}>
          <PropertiesPanel
            selectedShape={selectedShape}
            pxToUnits={pxToUnits}
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
