import { useState, useCallback, useEffect } from 'react';

export const usePropertiesManagement = (shapes: Array<{ id: number; type: string; [key: string]: unknown }>) => {
  const [showSides, setShowSides] = useState(false);
  const [showAngles, setShowAngles] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [showHeight, setShowHeight] = useState(false);
  const [showDiameter, setShowDiameter] = useState(false);
  const [showCircumference, setShowCircumference] = useState(false);
  const [showAreaByShape, setShowAreaByShape] = useState({
    circle: false,
    triangle: false,
    square: false,
  });

  const handleAllShapesDeleted = useCallback(() => {
    setShowSides(false);
    setShowAngles(false);
    setShowArea(false);
    setShowHeight(false);
    setShowDiameter(false);
    setShowCircumference(false);
    setShowAreaByShape({
      circle: false,
      triangle: false,
      square: false,
    });
  }, []);

  useEffect(() => {
    if (shapes.length === 0) {
      handleAllShapesDeleted();
    }
  }, [shapes.length, handleAllShapesDeleted]);

  return {
    showSides,
    setShowSides,
    showAngles,
    setShowAngles,
    showArea,
    setShowArea,
    showHeight,
    setShowHeight,
    showDiameter,
    setShowDiameter,
    showCircumference,
    setShowCircumference,
    showAreaByShape,
    setShowAreaByShape,
    handleAllShapesDeleted,
  };
};
