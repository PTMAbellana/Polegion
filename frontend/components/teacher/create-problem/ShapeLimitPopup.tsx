import React, { useEffect, useRef } from "react";
import styles from "@/styles/create-problem-teacher.module.css";

interface ShapeLimitPopupProps {
  onClose: () => void;
}

const ShapeLimitPopup: React.FC<ShapeLimitPopupProps> = ({ onClose }) => {
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

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox} ref={modalRef}>
        <p>You can only place one shape in the Main Area.</p>
        <button onClick={onClose} className={styles.okButton}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ShapeLimitPopup;
