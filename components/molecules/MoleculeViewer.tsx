'use client'

export default function MoleculeViewer() {
  return (
    <div className="bg-black/30 rounded-2xl p-10 relative overflow-hidden min-h-[220px] flex items-center justify-center">
      {/* Grid Background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[30%] w-32 h-32 bg-accent-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[30%] right-[30%] w-24 h-24 bg-accent-red/10 rounded-full blur-3xl" />
      </div>

      {/* Molecule SVG */}
      <svg
        viewBox="0 0 320 170"
        className="w-full max-w-xs relative z-10 drop-shadow-[0_0_20px_rgba(255,107,44,0.3)]"
      >
        <defs>
          <radialGradient id="nodeGrad" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#ffb800" />
            <stop offset="100%" stopColor="#ff6b2c" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bonds */}
        <g stroke="rgba(255,255,255,0.2)" strokeWidth="2">
          <line x1="40" y1="85" x2="80" y2="60" />
          <line x1="80" y1="60" x2="120" y2="85" />
          <line x1="120" y1="85" x2="160" y2="60" />
          <line x1="160" y1="60" x2="200" y2="85" />
          <line x1="200" y1="85" x2="240" y2="60" />
          <line x1="240" y1="60" x2="280" y2="85" />
          <line x1="80" y1="60" x2="80" y2="25" />
          <line x1="160" y1="60" x2="160" y2="120" />
          <line x1="240" y1="60" x2="240" y2="25" />
        </g>

        {/* Double bonds */}
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="2">
          <line x1="83" y1="58" x2="83" y2="28" />
          <line x1="237" y1="58" x2="237" y2="28" />
        </g>

        {/* Main Nodes */}
        <g filter="url(#glow)">
          {[
            { cx: 40, cy: 85, r: 10 },
            { cx: 80, cy: 60, r: 10 },
            { cx: 120, cy: 85, r: 10 },
            { cx: 160, cy: 60, r: 10 },
            { cx: 200, cy: 85, r: 10 },
            { cx: 240, cy: 60, r: 10 },
            { cx: 280, cy: 85, r: 8 },
          ].map((node, i) => (
            <circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill="url(#nodeGrad)"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </g>

        {/* Terminal Nodes */}
        <circle cx="80" cy="25" r="6" fill="#ff2d55" />
        <circle cx="240" cy="25" r="6" fill="#ff2d55" />
        <circle cx="160" cy="120" r="5" fill="#4a4a55" />

        {/* Labels */}
        <text fill="#fff" fontFamily="monospace" fontSize="11" x="35" y="108">N</text>
        <text fill="#fff" fontFamily="monospace" fontSize="11" x="75" y="18">O</text>
        <text fill="#fff" fontFamily="monospace" fontSize="11" x="235" y="18">O</text>
      </svg>
    </div>
  )
}