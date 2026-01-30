// src/components/ui/DataPanel.tsx

interface DataPanelProps {
  label: string;
  value: string;
  suffix?: string;
  accent?: boolean;
  align?: "left" | "right";
}

export default function DataPanel({
  label,
  value,
  suffix,
  accent,
  align = "left",
}: DataPanelProps) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "6px",
        padding: "6px 10px",
        minWidth: "90px",
        textAlign: align,
      }}
    >
      <p
        style={{
          fontSize: "8px",
          color: "#555",
          letterSpacing: "0.12em",
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: accent ? "16px" : "12px",
          color: accent ? "#ff6b2c" : "#ccc",
          margin: 0,
          fontFamily: "monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {suffix && (
          <span style={{ fontSize: "10px", color: "#666" }}> {suffix}</span>
        )}
      </p>
    </div>
  );
}
