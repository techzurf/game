import React from 'react';

export interface HitEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

export interface MissEffect {
  id: number;
  x: number;
  y: number;
}

interface TapEffectsProps {
  hits: HitEffect[];
  misses: MissEffect[];
}

export const TapEffects: React.FC<TapEffectsProps> = ({ hits, misses }) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
      {/* Hit Effects: Floating "+1" and glowing ripple */}
      {hits.map((hit) => (
        <React.Fragment key={hit.id}>
          {/* Expanding Hit Ripple */}
          <div
            style={{
              left: `${hit.x}px`,
              top: `${hit.y}px`,
              borderColor: hit.color,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 animate-ripple opacity-80"
          />

          {/* Floating +1 Text */}
          <div
            style={{
              left: `${hit.x}px`,
              top: `${hit.y}px`,
              textShadow: `0 2px 10px ${hit.color}`,
            }}
            className="absolute font-display font-black text-xl text-white animate-float-score"
          >
            +1
          </div>
        </React.Fragment>
      ))}

      {/* Subtle Miss Effect */}
      {misses.map((miss) => (
        <div
          key={miss.id}
          style={{
            left: `${miss.x}px`,
            top: `${miss.y}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-slate-600/50 animate-ripple opacity-50"
        />
      ))}
    </div>
  );
};
