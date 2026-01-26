// src/components/ui/StatBadge.tsx

interface StatBadgeProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export default function StatBadge({ label, value, highlight }: StatBadgeProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${highlight ? "rgba(255,107,44,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "12px",
        padding: "12px 20px",
      }}
    >
      <p
        style={{
          fontSize: "9px",
          color: "#555",
          letterSpacing: "0.1em",
          margin: 0,
          marginBottom: "2px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "16px",
          fontWeight: 300,
          color: highlight ? "#ff6b2c" : "#fff",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}
