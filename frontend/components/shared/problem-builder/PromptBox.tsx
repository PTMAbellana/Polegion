import React from "react";
import styles from "@/styles/problem-builder.module.css";
import { PromptBoxProps } from "@/types";

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
