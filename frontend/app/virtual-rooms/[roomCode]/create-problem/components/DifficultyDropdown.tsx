import React, { useRef, useState, useEffect } from "react";
import styles from "@/styles/create-problem.module.css";

const DIFFICULTY_COLORS = {
  Easy: "#8FFFC2",
  Intermediate: "#FFFD9B",
  Hard: "#FFB49B",
};

interface Props {
  difficulty: string;
  setDifficulty: (d: string) => void;
}

const DifficultyDropdown: React.FC<Props> = ({ difficulty, setDifficulty }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      style={{ width: "100%", position: "relative" }}
      className={open ? styles.dropdownActive : ""}
    >
      <div
        className={styles.difficultyBox}
        style={{
          background: DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS],
          cursor: "pointer",
          zIndex: 20,
          width: "100%",
          marginBottom: open ? 0 : 16,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: open ? 0 : 20,
          borderBottomRightRadius: open ? 0 : 20,
          transition: "border-radius 0.2s, margin-bottom 0.2s",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.difficultyText}>{difficulty}</span>
        <span style={{ marginLeft: 12, fontSize: 18, color: "#2c514c" }}>
          ▼
        </span>
      </div>
      {open && (
        <div className={styles.difficultyDropdownMenu} style={{
          width: "100%",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
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
                setOpen(false);
              }}
            >
              {diff}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DifficultyDropdown;