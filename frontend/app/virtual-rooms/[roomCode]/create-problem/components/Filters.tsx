import React, { useState } from "react";
import styles from "@/styles/create-problem.module.css";
import ToggleSwitch from "./ToggleSwitch";

interface FiltersProps {
  shapes: any[];
  showSides: boolean;
  setShowSides: (show: boolean) => void;
  showAngles: boolean;
  setShowAngles: (show: boolean) => void;
  showAreaByShape: {
    circle: boolean;
    triangle: boolean;
    square: boolean;
  };
  setShowAreaByShape: React.Dispatch<React.SetStateAction<{
    circle: boolean;
    triangle: boolean;
    square: boolean;
  }>>;
  showHeight: boolean;
  setShowHeight: (show: boolean) => void;
  showDiameter: boolean;
  setShowDiameter: (show: boolean) => void;
  showCircumference: boolean;
  setShowCircumference: (show: boolean) => void;
}

const Filters: React.FC<FiltersProps> = ({
  shapes,
  showSides,
  setShowSides,
  showAngles,
  setShowAngles,
  showAreaByShape,
  setShowAreaByShape,
  showHeight,
  setShowHeight,
  showDiameter,
  setShowDiameter,
  showCircumference,
  setShowCircumference,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("circle");

  // Check which shapes are present
  const hasCircle = shapes.some((s) => s.type === "circle");
  const hasSquare = shapes.some((s) => s.type === "square");
  const hasTriangle = shapes.some((s) => s.type === "triangle");

  // Check if only circle exists (no sides/angles needed)
  const hasOnlyCircle = hasCircle && !hasSquare && !hasTriangle;
  const shouldShowGlobal = !hasOnlyCircle; // Hide global if only circle

  // Count only active filters for existing shapes
  const getActiveFiltersCount = () => {
    let count = 0;
    
    // Global filters (only count if not circle-only)
    if (shouldShowGlobal && showSides) count++;
    if (shouldShowGlobal && showAngles) count++;
    
    // Shape-specific filters (only count if shape exists)
    if (hasSquare && showAreaByShape.square) count++;
    if (hasTriangle && showAreaByShape.triangle) count++;
    if (hasTriangle && showHeight) count++;
    if (hasCircle && showAreaByShape.circle) count++;
    if (hasCircle && showDiameter) count++;
    if (hasCircle && showCircumference) count++;
    
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Quick action functions
  const showAllProperties = () => {
    // Global properties (only if not circle-only)
    if (shouldShowGlobal) {
      setShowSides(true);
      setShowAngles(true);
    }
    
    // Shape-specific properties (only if shape exists)
    setShowAreaByShape(prev => ({
      ...prev,
      circle: hasCircle ? true : prev.circle,
      triangle: hasTriangle ? true : prev.triangle,
      square: hasSquare ? true : prev.square,
    }));
    
    if (hasTriangle) setShowHeight(true);
    if (hasCircle) {
      setShowDiameter(true);
      setShowCircumference(true);
    }
  };

  const hideAllProperties = () => {
    // Global properties (only if not circle-only)
    if (shouldShowGlobal) {
      setShowSides(false);
      setShowAngles(false);
    }
    
    // All shape-specific properties
    setShowAreaByShape({ circle: false, triangle: false, square: false });
    setShowHeight(false);
    setShowDiameter(false);
    setShowCircumference(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (shapes.length === 0) {
    return (
      <div className={styles.filtersContainer}>
        <div className={styles.filtersEmptyState}>
          <div className={styles.emptyStateIcon} style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none"
          }}>📐</div>
          <div className={styles.emptyStateText} style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none"
          }}>Add a shape to see properties</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.filtersContainer}>
      {/* Quick Actions Row */}
      <div className={styles.quickActions}>
        <button
          className={`${styles.quickActionBtn} ${styles.showAllBtn}`}
          onClick={showAllProperties}
          title="Show all properties"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none"
          }}
        >
          <span className={styles.btnIcon} style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none"
          }}>👁️</span>
          <span className={styles.btnText} style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none"
          }}>All</span>
        </button>
        <button
          className={`${styles.quickActionBtn} ${styles.hideAllBtn}`}
          onClick={hideAllProperties}
          title="Hide all properties"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none"
          }}
        >
          <span className={styles.btnIcon} style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none"
          }}>👁️‍🗨️</span>
          <span className={styles.btnText} style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none"
          }}>None</span>
        </button>
        {activeFiltersCount > 0 && (
          <div className={styles.activeCount}>
            <span className={styles.countBadge} style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none"
            }}>{activeFiltersCount}</span>
          </div>
        )}
      </div>

      {/* Filter Sections */}
      <div className={styles.filterSections}>
        
        {/* Global Properties - Only show if not circle-only */}
        {shouldShowGlobal && (
          <div className={`${styles.filterSection} ${styles.globalSection}`}>
            <button
              className={`${styles.filterSectionHeader} ${expandedSection === 'global' ? styles.expanded : ''}`}
              onClick={() => toggleSection('global')}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}
            >
              <span className={styles.sectionIcon} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>🌐</span>
              <span className={styles.sectionTitle} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>Global</span>
              <span className={styles.expandIcon} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>
                {expandedSection === 'global' ? '▼' : '▶'}
              </span>
            </button>
            
            {expandedSection === 'global' && (
              <div className={styles.filterSectionContent}>
                <div className={styles.filterOption}>
                  <ToggleSwitch
                    checked={showSides}
                    onChange={() => setShowSides(!showSides)}
                    label="Side Lengths"
                  />
                  <div className={styles.optionDescription} style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none"
                  }}>Show measurements</div>
                </div>
                <div className={styles.filterOption}>
                  <ToggleSwitch
                    checked={showAngles}
                    onChange={() => setShowAngles(!showAngles)}
                    label="Angles"
                  />
                  <div className={styles.optionDescription} style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none"
                  }}>Display angles</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Square Properties */}
        {hasSquare && (
          <div className={`${styles.filterSection} ${styles.squareSection}`}>
            <button
              className={`${styles.filterSectionHeader} ${expandedSection === 'square' ? styles.expanded : ''}`}
              onClick={() => toggleSection('square')}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}
            >
              <span className={styles.sectionIcon} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>⬜</span>
              <span className={styles.sectionTitle} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>Square</span>
              <span className={styles.expandIcon} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>
                {expandedSection === 'square' ? '▼' : '▶'}
              </span>
            </button>
            
            {expandedSection === 'square' && (
              <div className={styles.filterSectionContent}>
                <div className={styles.filterOption}>
                  <ToggleSwitch
                    checked={showAreaByShape.square}
                    onChange={() =>
                      setShowAreaByShape((prev) => ({ ...prev, square: !prev.square }))
                    }
                    label="Area Formula"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Triangle Properties */}
        {hasTriangle && (
          <div className={`${styles.filterSection} ${styles.triangleSection}`}>
            <button
              className={`${styles.filterSectionHeader} ${expandedSection === 'triangle' ? styles.expanded : ''}`}
              onClick={() => toggleSection('triangle')}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}
            >
              <span className={styles.sectionIcon} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>🔺</span>
              <span className={styles.sectionTitle} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>Triangle</span>
              <span className={styles.expandIcon} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>
                {expandedSection === 'triangle' ? '▼' : '▶'}
              </span>
            </button>
            
            {expandedSection === 'triangle' && (
              <div className={styles.filterSectionContent}>
                <div className={styles.filterOption}>
                  <ToggleSwitch
                    checked={showAreaByShape.triangle}
                    onChange={() =>
                      setShowAreaByShape((prev) => ({ ...prev, triangle: !prev.triangle }))
                    }
                    label="Area Formula"
                  />
                </div>
                <div className={styles.filterOption}>
                  <ToggleSwitch
                    checked={showHeight}
                    onChange={() => setShowHeight(!showHeight)}
                    label="Height Line"
                  />
                  <div className={styles.optionDescription} style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none"
                  }}>Perpendicular to base</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Circle Properties */}
        {hasCircle && (
          <div className={`${styles.filterSection} ${styles.circleSection}`}>
            <button
              className={`${styles.filterSectionHeader} ${expandedSection === 'circle' ? styles.expanded : ''}`}
              onClick={() => toggleSection('circle')}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}
            >
              <span className={styles.sectionIcon} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>⭕</span>
              <span className={styles.sectionTitle} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>Circle</span>
              <span className={styles.expandIcon} style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}>
                {expandedSection === 'circle' ? '▼' : '▶'}
              </span>
            </button>
            
            {expandedSection === 'circle' && (
              <div className={styles.filterSectionContent}>
                <div className={styles.filterOption}>
                  <ToggleSwitch
                    checked={showAreaByShape.circle}
                    onChange={() =>
                      setShowAreaByShape((prev) => ({ ...prev, circle: !prev.circle }))
                    }
                    label="Area Formula"
                  />
                </div>
                <div className={styles.filterOption}>
                  <ToggleSwitch
                    checked={showDiameter}
                    onChange={() => setShowDiameter(!showDiameter)}
                    label="Diameter"
                  />
                  <div className={styles.optionDescription} style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none"
                  }}>Distance across</div>
                </div>
                <div className={styles.filterOption}>
                  <ToggleSwitch
                    checked={showCircumference}
                    onChange={() => setShowCircumference(!showCircumference)}
                    label="Circumference"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;