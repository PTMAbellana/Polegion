import React from "react";
import styles from "@/styles/create-problem-teacher.module.css";

interface PromptBoxProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  editingPrompt: boolean;
  setEditingPrompt: (editing: boolean) => void;
  promptInputRef: React.RefObject<HTMLTextAreaElement>;
}

const PromptBox: React.FC<PromptBoxProps> = ({
  prompt,
  setPrompt,
  editingPrompt,
  setEditingPrompt,
  promptInputRef,
}) => {
  return (
    <div className={styles.promptBox}>
      <textarea
        ref={promptInputRef}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        onFocus={() => {
          setEditingPrompt(true);
          if (
            prompt.trim() === "" ||
            prompt === "Input problem details."
          ) {
            setPrompt("");
          }
        }}
        onBlur={() => {
          setEditingPrompt(false);
          if (prompt.trim() === "") {
            setPrompt("");
          }
        }}
        placeholder="Input problem details."
        className={styles.promptTextarea}
      />
    </div>
  );
};

export default PromptBox;
