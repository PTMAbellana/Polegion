import React from "react";
import styles from "@/styles/create-problem.module.css";

export default function PromptBox({
  prompt,
  setPrompt,
  editingPrompt,
  setEditingPrompt,
  promptInputRef,
}: any) {
  return (
    <div className={styles.promptBox}>
      <div
        onClick={() => {
          setEditingPrompt(true);
          if (
            prompt.trim() === "" ||
            prompt === "Input problem details."
          ) {
            setPrompt("");
          }
        }}
      >
        {editingPrompt ? (
          <textarea
            ref={promptInputRef}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onBlur={() => setEditingPrompt(false)}
            placeholder="Input problem details."
            className={styles.promptTextarea}
          />
        ) : (
          <span className={styles.promptText}>
            {prompt.trim() === "" ? "Input problem details." : prompt}
          </span>
        )}
      </div>
    </div>
  );
}