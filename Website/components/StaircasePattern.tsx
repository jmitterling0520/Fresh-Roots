export default function StaircasePattern() {
  return (
    <div className="staircase-pattern">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
        className="staircase-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="stepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(91, 107, 125, 0.15)" />
            <stop offset="100%" stopColor="rgba(91, 107, 125, 0.08)" />
          </linearGradient>
        </defs>
        {/* Ascending steps from bottom left to top right with more spacing */}
        {/* First block at bottom left, aligned with "O" in "Our Approach" */}
        <rect
          x="0"
          y="540"
          width="70"
          height="60"
          fill="url(#stepGradient)"
          rx="4"
        />
        <rect
          x="110"
          y="470"
          width="70"
          height="60"
          fill="url(#stepGradient)"
          rx="4"
        />
        <rect
          x="220"
          y="400"
          width="70"
          height="60"
          fill="url(#stepGradient)"
          rx="4"
        />
        <rect
          x="330"
          y="330"
          width="70"
          height="60"
          fill="url(#stepGradient)"
          rx="4"
        />
        <rect
          x="440"
          y="260"
          width="70"
          height="60"
          fill="url(#stepGradient)"
          rx="4"
        />
        <rect
          x="550"
          y="190"
          width="70"
          height="60"
          fill="url(#stepGradient)"
          rx="4"
        />
        <rect
          x="660"
          y="120"
          width="70"
          height="60"
          fill="url(#stepGradient)"
          rx="4"
        />
        {/* Last block at top right, aligned with first line of text */}
        <rect
          x="730"
          y="50"
          width="70"
          height="60"
          fill="url(#stepGradient)"
          rx="4"
        />
      </svg>
    </div>
  )
}

