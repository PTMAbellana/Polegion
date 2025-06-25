import React from "react";

export default function PromptBox({
  prompt,
  setPrompt,
  editingPrompt,
  setEditingPrompt,
  promptInputRef,
}: any) {
  return (
    <div>
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
            style={{
              width: "100%",
              height: "100%",
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Poppins",
              fontSize: 24,
              fontWeight: 300,
              color: "#000",
            }}
          />
        ) : (
          <span>
            {prompt.trim() === "" ? "Input problem details." : prompt}
          </span>
        )}
      </div>
    </div>
  );
}