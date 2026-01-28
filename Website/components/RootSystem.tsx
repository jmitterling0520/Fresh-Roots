export default function RootSystem() {
  return (
    <div className="root-system">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
        className="root-system-svg"
        aria-hidden="true"
      >
        <defs>
          {/* Main root gradients with complementary colors */}
          <linearGradient id="rootGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(91, 107, 125, 0.6)" />
            <stop offset="50%" stopColor="rgba(58, 69, 86, 0.5)" />
            <stop offset="100%" stopColor="rgba(102, 126, 234, 0.4)" />
          </linearGradient>
          <linearGradient id="rootGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(91, 107, 125, 0.5)" />
            <stop offset="50%" stopColor="rgba(118, 75, 162, 0.4)" />
            <stop offset="100%" stopColor="rgba(58, 69, 86, 0.4)" />
          </linearGradient>
          <linearGradient id="rootGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(102, 126, 234, 0.35)" />
            <stop offset="100%" stopColor="rgba(118, 75, 162, 0.3)" />
          </linearGradient>
          {/* Accent gradient with gold/yellow touches */}
          <linearGradient id="rootAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 235, 59, 0.25)" />
            <stop offset="100%" stopColor="rgba(255, 215, 0, 0.15)" />
          </linearGradient>
        </defs>
        
        {/* Central core - center of the grid */}
        <circle
          cx="300"
          cy="300"
          r="12"
          fill="url(#rootGradient1)"
          stroke="rgba(91, 107, 125, 0.8)"
          strokeWidth="3"
        />
        {/* Accent highlight on core */}
        <circle
          cx="300"
          cy="300"
          r="10"
          fill="url(#rootAccent)"
          opacity="0.6"
        />
        
        {/* Roots sprawling to the 4 corners/edges of the service boxes */}
        
        {/* Top-left box (reaching top-left corner) */}
        <path
          d="M300 300 Q250 280, 200 260 Q150 240, 100 220 Q50 200, 0 180"
          stroke="url(#rootGradient1)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 260 Q180 250, 160 240 Q140 230, 120 220 Q100 210, 80 200"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M100 220 Q80 210, 60 200 Q40 190, 20 180"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 260 Q150 250, 100 240"
          stroke="url(#rootGradient3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M100 220 Q70 210, 40 200"
          stroke="url(#rootGradient3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Top-right box (reaching top-right corner) */}
        <path
          d="M300 300 Q350 280, 400 260 Q450 240, 500 220 Q550 200, 600 180"
          stroke="url(#rootGradient1)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M400 260 Q420 250, 440 240 Q460 230, 480 220 Q500 210, 520 200"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M500 220 Q520 210, 540 200 Q560 190, 580 180"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M400 260 Q450 250, 500 240"
          stroke="url(#rootGradient3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M500 220 Q530 210, 560 200"
          stroke="url(#rootGradient3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Bottom-right box (reaching bottom-right corner) */}
        <path
          d="M300 300 Q350 320, 400 340 Q450 360, 500 380 Q550 400, 600 420"
          stroke="url(#rootGradient1)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M400 340 Q420 350, 440 360 Q460 370, 480 380 Q500 390, 520 400"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M500 380 Q520 390, 540 400 Q560 410, 580 420"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M400 340 Q450 350, 500 360"
          stroke="url(#rootGradient3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M500 380 Q530 390, 560 400"
          stroke="url(#rootGradient3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Bottom-left box (reaching bottom-left corner) */}
        <path
          d="M300 300 Q250 320, 200 340 Q150 360, 100 380 Q50 400, 0 420"
          stroke="url(#rootGradient1)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 340 Q180 350, 160 360 Q140 370, 120 380 Q100 390, 80 400"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M100 380 Q80 390, 60 400 Q40 410, 20 420"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 340 Q150 350, 100 360"
          stroke="url(#rootGradient3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M100 380 Q70 390, 40 400"
          stroke="url(#rootGradient3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Additional connecting roots between boxes */}
        <path
          d="M300 300 Q300 250, 300 200 Q300 150, 300 100"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M300 300 Q300 350, 300 400 Q300 450, 300 500"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M300 300 Q250 300, 200 300 Q150 300, 100 300"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M300 300 Q350 300, 400 300 Q450 300, 500 300"
          stroke="url(#rootGradient2)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Fine root hairs extending to box edges */}
        <path
          d="M0 180 Q10 175, 20 170"
          stroke="url(#rootGradient3)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M600 180 Q590 175, 580 170"
          stroke="url(#rootGradient3)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M600 420 Q590 425, 580 430"
          stroke="url(#rootGradient3)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M0 420 Q10 425, 20 430"
          stroke="url(#rootGradient3)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

