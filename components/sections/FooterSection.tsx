// src/components/sections/FooterSection.tsx
"use client";

export default function FooterSection() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 10,
        padding: "80px 40px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "transparent",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          background: "linear-gradient(135deg, #ff2d55, #ff6b2c)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px auto",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
        © 2024 Red Elephant Research. All rights reserved.
      </p>
      <p style={{ color: "#444", fontSize: "12px" }}>
        For research purposes only. Not for human consumption.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginTop: "24px",
        }}
      >
        {["Privacy", "Terms", "Contact"].map((item) => (
          <a
            key={item}
            href="#"
            style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}
          >
            {item}
          </a>
        ))}
      </div>
    </footer>
  );
}
