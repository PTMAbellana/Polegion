import React, { useEffect, useRef } from "react";
import styles from "@/styles/create-problem-teacher.module.css";
import { ShapeLimitPopupProps } from "@/types";

const ShapeLimitPopup: React.FC<ShapeLimitPopupProps> = ({ onClose, limit = 1 }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const shapeWord = limit === 1 ? 'shape' : 'shapes';

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox} ref={modalRef}>
        <p>You can only place {limit} {shapeWord} in the Main Area.</p>
        <button onClick={onClose} className={styles.okButton}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ShapeLimitPopup;
