import React, { useState } from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import ToggleSwitch from "./ToggleSwitch";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { FiltersProps } from "@/types/props/problem";

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

  const hasCircle = shapes.some((s) => s.type === "circle");
  const hasSquare = shapes.some((s) => s.type === "square");
  const hasTriangle = shapes.some((s) => s.type === "triangle");
  const hasOnlyCircle = hasCircle && !hasSquare && !hasTriangle;
  const shouldShowGlobal = !hasOnlyCircle;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (shouldShowGlobal && showSides) count++;
    if (shouldShowGlobal && showAngles) count++;
    if (hasSquare && showAreaByShape.square) count++;
    if (hasTriangle && showAreaByShape.triangle) count++;
    if (hasTriangle && showHeight) count++;
    if (hasCircle && showAreaByShape.circle) count++;
    if (hasCircle && showDiameter) count++;
    if (hasCircle && showCircumference) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const showAllProperties = () => {
    if (shouldShowGlobal) {
      setShowSides(true);
      setShowAngles(true);
    }
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
    if (shouldShowGlobal) {
      setShowSides(false);
      setShowAngles(false);
    }
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
          <div className={styles.emptyStateIcon}></div>
          <div className={styles.emptyStateText}>Add a shape to see properties</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.quickActions}>
        <button className={`${styles.quickActionBtn} ${styles.showAllBtn}`} onClick={showAllProperties} title="Show all properties">
          <span className={styles.btnIcon}></span>
          <span className={styles.btnText}>All</span>
        </button>
        <button className={`${styles.quickActionBtn} ${styles.hideAllBtn}`} onClick={hideAllProperties} title="Hide all properties">
          <span className={styles.btnIcon}></span>
          <span className={styles.btnText}>None</span>
        </button>
        {activeFiltersCount > 0 && (
          <div className={styles.activeCount}>
            <span className={styles.countBadge}>{activeFiltersCount}</span>
          </div>
        )}
      </div>

      <div className={styles.filterSections}>
        {shouldShowGlobal && (
          <div className={`${styles.filterSection} ${styles.globalSection}`}>
            <button className={`${styles.filterSectionHeader} ${expandedSection === 'global' ? styles.expanded : ''}`} onClick={() => toggleSection('global')}>
              <span className={styles.sectionIcon}></span>
              <span className={styles.sectionTitle}>Global</span>
              <span className={styles.expandIcon}>{expandedSection === 'global' ? <FaCaretDown /> : <FaCaretRight />}</span>
            </button>
            {expandedSection === 'global' && (
              <div className={styles.filterSectionContent}>
                <div className={styles.filterOption}>
                  <ToggleSwitch checked={showSides} onChange={() => setShowSides(!showSides)} label="Side Lengths" description="Show measurements" />
                </div>
                <div className={styles.filterOption}>
                  <ToggleSwitch checked={showAngles} onChange={() => setShowAngles(!showAngles)} label="Angles" description="Display angles" />
                </div>
              </div>
            )}
          </div>
        )}

        {hasSquare && (
          <div className={`${styles.filterSection} ${styles.squareSection}`}>
            <button className={`${styles.filterSectionHeader} ${expandedSection === 'square' ? styles.expanded : ''}`} onClick={() => toggleSection('square')}>
              <span className={styles.sectionIcon}>■</span>
              <span className={styles.sectionTitle}>Square</span>
              <span className={styles.expandIcon}>{expandedSection === 'square' ? <FaCaretDown /> : <FaCaretRight />}</span>
            </button>
            {expandedSection === 'square' && (
              <div className={styles.filterSectionContent}>
                <div className={styles.filterOption}>
                  <ToggleSwitch checked={showAreaByShape.square} onChange={() => setShowAreaByShape((prev) => ({ ...prev, square: !prev.square }))} label="Area Formula" />
                </div>
              </div>
            )}
          </div>
        )}

        {hasTriangle && (
          <div className={`${styles.filterSection} ${styles.triangleSection}`}>
            <button className={`${styles.filterSectionHeader} ${expandedSection === 'triangle' ? styles.expanded : ''}`} onClick={() => toggleSection('triangle')}>
              <span className={styles.sectionIcon}>▲</span>
              <span className={styles.sectionTitle}>Triangle</span>
              <span className={styles.expandIcon}>{expandedSection === 'triangle' ? <FaCaretDown /> : <FaCaretRight />}</span>
            </button>
            {expandedSection === 'triangle' && (
              <div className={styles.filterSectionContent}>
                <div className={styles.filterOption}>
                  <ToggleSwitch checked={showAreaByShape.triangle} onChange={() => setShowAreaByShape((prev) => ({ ...prev, triangle: !prev.triangle }))} label="Area Formula" />
                </div>
                <div className={styles.filterOption}>
                  <ToggleSwitch checked={showHeight} onChange={() => setShowHeight(!showHeight)} label="Height Line" description="Perpendicular to base" />
                </div>
              </div>
            )}
          </div>
        )}

        {hasCircle && (
          <div className={`${styles.filterSection} ${styles.circleSection}`}>
            <button className={`${styles.filterSectionHeader} ${expandedSection === 'circle' ? styles.expanded : ''}`} onClick={() => toggleSection('circle')}>
              <span className={styles.sectionIcon}>●</span>
              <span className={styles.sectionTitle}>Circle</span>
              <span className={styles.expandIcon}>{expandedSection === 'circle' ?  <FaCaretDown /> : <FaCaretRight />}</span>
            </button>
            {expandedSection === 'circle' && (
              <div className={styles.filterSectionContent}>
                <div className={styles.filterOption}>
                  <ToggleSwitch checked={showAreaByShape.circle} onChange={() => setShowAreaByShape((prev) => ({ ...prev, circle: !prev.circle }))} label="Area Formula" />
                </div>
                <div className={styles.filterOption}>
                  <ToggleSwitch checked={showDiameter} onChange={() => setShowDiameter(!showDiameter)} label="Diameter" description="Distance across" />
                </div>
                <div className={styles.filterOption}>
                  <ToggleSwitch checked={showCircumference} onChange={() => setShowCircumference(!showCircumference)} label="Circumference" />
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
