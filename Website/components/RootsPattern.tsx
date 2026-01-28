export default function RootsPattern() {
  return (
    <div className="roots-pattern">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="roots-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="rootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.35)" />
          </linearGradient>
        </defs>
        {/* Root system pattern */}
        <path
          d="M200 50 Q150 100, 120 150 T80 200 T60 250"
          stroke="url(#rootGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 50 Q250 100, 280 150 T320 200 T340 250"
          stroke="url(#rootGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 50 Q180 80, 170 110 T160 150 T155 180"
          stroke="url(#rootGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 50 Q220 80, 230 110 T240 150 T245 180"
          stroke="url(#rootGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Additional root branches */}
        <path
          d="M120 150 Q100 170, 90 190 T85 220"
          stroke="url(#rootGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M280 150 Q300 170, 310 190 T315 220"
          stroke="url(#rootGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Additional main roots */}
        <path
          d="M160 50 Q130 100, 100 150 T60 200 T40 250"
          stroke="url(#rootGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M240 50 Q270 100, 300 150 T340 200 T360 250"
          stroke="url(#rootGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M120 50 Q100 100, 85 140 T70 190 T55 240"
          stroke="url(#rootGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M280 50 Q300 100, 315 140 T330 190 T345 240"
          stroke="url(#rootGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Center roots */}
        <path
          d="M200 50 Q190 90, 185 130 T180 170 T178 210"
          stroke="url(#rootGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 50 Q210 90, 215 130 T220 170 T222 210"
          stroke="url(#rootGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* More branches from existing roots */}
        <path
          d="M80 200 Q70 210, 65 220 T60 240"
          stroke="url(#rootGradient)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M320 200 Q330 210, 335 220 T340 240"
          stroke="url(#rootGradient)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M100 150 Q95 160, 92 170 T88 190"
          stroke="url(#rootGradient)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M300 150 Q305 160, 308 170 T312 190"
          stroke="url(#rootGradient)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M160 150 Q155 160, 152 170 T148 190"
          stroke="url(#rootGradient)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M240 150 Q245 160, 248 170 T252 190"
          stroke="url(#rootGradient)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

