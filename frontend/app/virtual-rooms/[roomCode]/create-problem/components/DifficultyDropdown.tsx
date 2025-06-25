import React from "react";
import styles from "@/styles/create-problem.module.css";

const DIFFICULTY_COLORS = {
  Easy: "#8FFFC2",
  Intermediate: "#FFFD9B",
  Hard: "#FFB49B",
};

interface Props {
  difficulty: string;
  setDifficulty: (d: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const DifficultyDropdown: React.FC<Props> = ({
  difficulty,
  setDifficulty,
  dropdownOpen,
  setDropdownOpen,
  dropdownRef,
}) => (
  <div
    ref={dropdownRef}
    className={styles.difficultyBox}
    style={{
      background: DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS],
      cursor: "pointer",
      zIndex: 20,
      width: "100%",
      marginBottom: 16,
      position: "relative",
    }}
    onClick={() => setDropdownOpen((open) => !open)}
  >
    <span className={styles.difficultyText}>{difficulty}</span>
    <span style={{ marginLeft: 12, fontSize: 18, color: "#2c514c" }}>
      ▼
    </span>
    {dropdownOpen && (
      <div className={styles.difficultyDropdownMenu} style={{ width: "100%" }}>
        {["Easy", "Intermediate", "Hard"].map((diff) => (
          <div
            key={diff}
            className={styles.difficultyDropdownItem}
            style={{
              background: DIFFICULTY_COLORS[diff as keyof typeof DIFFICULTY_COLORS],
              color: "#2c514c",
              fontWeight: 600,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setDifficulty(diff);
              setDropdownOpen(false);
            }}
          >
            {diff}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default DifficultyDropdown;