import React from 'react';

export interface TargetColorTheme {
  name: string;
  outerRing: string;
  middleRing: string;
  centerDot: string;
  glow: string;
  accent: string;
}

export const TARGET_THEMES: TargetColorTheme[] = [
  {
    name: 'Neon Coral',
    outerRing: 'from-rose-500 to-pink-500',
    middleRing: 'bg-white',
    centerDot: 'bg-rose-600',
    glow: 'rgba(244, 63, 94, 0.45)',
    accent: '#f43f5e',
  },
  {
    name: 'Electric Cyan',
    outerRing: 'from-cyan-400 to-blue-500',
    middleRing: 'bg-white',
    centerDot: 'bg-cyan-500',
    glow: 'rgba(6, 182, 212, 0.45)',
    accent: '#06b6d4',
  },
  {
    name: 'Vibrant Emerald',
    outerRing: 'from-emerald-400 to-teal-500',
    middleRing: 'bg-white',
    centerDot: 'bg-emerald-500',
    glow: 'rgba(16, 185, 129, 0.45)',
    accent: '#10b981',
  },
  {
    name: 'Sunset Amber',
    outerRing: 'from-amber-400 to-orange-500',
    middleRing: 'bg-white',
    centerDot: 'bg-amber-500',
    glow: 'rgba(245, 158, 11, 0.45)',
    accent: '#f59e0b',
  },
  {
    name: 'Hyper Purple',
    outerRing: 'from-purple-500 to-indigo-500',
    middleRing: 'bg-white',
    centerDot: 'bg-purple-600',
    glow: 'rgba(168, 85, 247, 0.45)',
    accent: '#a855f7',
  },
];

interface TargetProps {
  x: number;
  y: number;
  size: number;
  score: number;
  onHit: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const Target: React.FC<TargetProps> = ({
  x,
  y,
  size,
  score,
  onHit,
}) => {
  // Rotate theme every 3 targets for visual variety and progression
  const theme = TARGET_THEMES[Math.floor(score / 3) % TARGET_THEMES.length];

  // Hitbox size: Ensure at least 44px on touch devices even if visual size is smaller
  const hitboxSize = Math.max(size, 46);
  const offset = (hitboxSize - size) / 2;

  return (
    <div
      style={{
        left: `${x - offset}px`,
        top: `${y - offset}px`,
        width: `${hitboxSize}px`,
        height: `${hitboxSize}px`,
      }}
      className="absolute cursor-pointer flex items-center justify-center touch-none select-none z-20 group"
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onHit(e);
      }}
      role="button"
      tabIndex={0}
      aria-label="Tap Target"
    >
      {/* Outer ambient pulsing aura */}
      <div
        style={{
          width: `${size + 14}px`,
          height: `${size + 14}px`,
          boxShadow: `0 0 25px ${theme.glow}`,
        }}
        className="absolute rounded-full animate-ping opacity-25 pointer-events-none"
      />

      {/* Target Body with Pop-In Animation Keyed to Position/Score */}
      <div
        key={`${score}-${x}-${y}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: `0 8px 24px -4px ${theme.glow}, 0 2px 8px rgba(0,0,0,0.5)`,
        }}
        className="relative rounded-full animate-pop-in flex items-center justify-center active:scale-90 transition-transform duration-75"
      >
        {/* Outer Ring Gradient */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.outerRing} p-1 shadow-inner`}
        >
          {/* Inner Groove Line */}
          <div className="w-full h-full rounded-full border border-white/40 flex items-center justify-center">
            {/* White Ring */}
            <div className="w-[66%] h-[66%] rounded-full bg-white shadow-sm flex items-center justify-center p-0.5">
              {/* Core Bullseye */}
              <div
                className={`w-[60%] h-[60%] rounded-full ${theme.centerDot} shadow-inner flex items-center justify-center`}
              >
                {/* Center pip highlight */}
                <div className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle crosshair pips for authentic arcade target aesthetic */}
        <div className="absolute top-0 bottom-0 w-[1.5px] bg-white/30 pointer-events-none" />
        <div className="absolute left-0 right-0 h-[1.5px] bg-white/30 pointer-events-none" />
      </div>
    </div>
  );
};
