import React from "react";

export default function Logo() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 24px",
        borderRadius: "12px",
        border: "2px solid #333",
        background: "linear-gradient(135deg, #ffffff 0%, #f1f1f1 100%)",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: "1.8rem",
        letterSpacing: "0.12em",
        color: "#111",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      <span
        style={{
          background: "linear-gradient(90deg, #7c3aed, #00d0ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        AWE
      </span>
    </div>
  );
}
