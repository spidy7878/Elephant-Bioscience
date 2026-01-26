// src/components/sections/StatsOverviewSection.tsx
"use client";

export default function StatsOverviewSection() {
  const stats = [
    { label: "Purity Level", value: "99.2", unit: "%" },
    { label: "Quantity", value: "50", unit: "mg" },
    { label: "Storage Temp", value: "-20", unit: "°C" },
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 10,
        padding: "80px 40px",
        background: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
              transition: "all 0.3s",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#666",
                letterSpacing: "0.15em",
                marginBottom: "12px",
                fontWeight: 600,
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontSize: "56px",
                fontWeight: 900,
                color: "#fff",
                margin: 0,
                lineHeight: 1,
              }}
            >
              {stat.value}
              <span
                style={{
                  fontSize: "28px",
                  color: "#ff6b2c",
                  marginLeft: "4px",
                }}
              >
                {stat.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
