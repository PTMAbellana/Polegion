import React from "react";

export default function HintBox({
  hintOpen,
  setHintOpen,
  hint,
  setHint,
}: any) {
  return (
    <span style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 8 }}>
      {!hintOpen ? (
        <button
          style={{
            background: "#fabc60",
            border: "1px solid #000",
            borderRadius: 4,
            padding: "2px 10px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => setHintOpen(true)}
        >
          Add Hint
        </button>
      ) : (
        <div
          style={{
            background: "#fffbe6",
            border: "1px solid #aaa",
            borderRadius: 8,
            padding: 12,
            minWidth: 320,
            minHeight: 60,
            marginBottom: 4,
            position: "relative",
            display: "inline-block"
          }}
        >
          <textarea
            value={hint}
            onChange={e => setHint(e.target.value)}
            placeholder="Input hint here."
            style={{
              width: "100%",
              minHeight: 40,
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Poppins",
              fontSize: 18,
              fontWeight: 300,
              color: "#000",
            }}
          />
          <button
            style={{
              position: "absolute",
              top: 6,
              right: 8,
              background: "#fabc60",
              border: "1px solid #000",
              borderRadius: 4,
              padding: "2px 10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => setHintOpen(false)}
            title="Close"
          >
            ✕
          </button>
        </div>
      )}
    </span>
  );
}