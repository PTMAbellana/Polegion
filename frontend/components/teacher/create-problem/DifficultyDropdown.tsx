import React, { useRef, useState, useEffect } from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import { DropdownProps } from "@/types/props/problem";
import { DIFFICULTY_COLORS } from "@/constants/dropdown";

const DifficultyDropdown: React.FC<DropdownProps> = ({ difficulty, setDifficulty }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      className={styles.difficultyWrapper}
    >
      <div
        className={styles.difficultyBox}
        style={{
          background: DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS],
          borderBottomLeftRadius: open ? 0 : 20,
          borderBottomRightRadius: open ? 0 : 20,
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.difficultyText}>{difficulty}</span>
        <span className={styles.difficultyArrow}>
          {open ? "▲" : "▼"}
        </span>
      </div>
      {open && (
        <div className={styles.difficultyDropdownMenu}>
          {["Easy", "Intermediate", "Hard"].map((diff) => (
            <div
              key={diff}
              className={styles.difficultyDropdownItem}
              style={{
                background: DIFFICULTY_COLORS[diff as keyof typeof DIFFICULTY_COLORS],
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
