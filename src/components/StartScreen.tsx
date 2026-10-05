import React from 'react';
import { Play, Zap, Flame, ShieldAlert } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Background ambient lighting */}
      <div className="w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl absolute pointer-events-none" />

      {/* Target Preview Avatar */}
      <div className="relative mb-5 flex items-center justify-center">
        {/* Outer glowing ripple ring */}
        <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
        
        {/* Bullseye sample visual */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 p-1.5 shadow-2xl shadow-rose-500/40 relative flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-white/50 flex items-center justify-center">
            <div className="w-[66%] h-[66%] rounded-full bg-white shadow flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full bg-rose-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </div>
          {/* Subtle crosshair */}
          <div className="absolute top-0 bottom-0 w-[1.5px] bg-white/40 pointer-events-none" />
          <div className="absolute left-0 right-0 h-[1.5px] bg-white/40 pointer-events-none" />
        </div>
      </div>

      {/* Instructions */}
      <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight mb-2">
        Ready for the Challenge?
      </h2>
      <p className="text-slate-300 text-sm max-w-xs leading-relaxed mb-6">
        Tap as many targets as you can in <span className="text-cyan-400 font-semibold">30 seconds</span>. Targets shrink as your score climbs!
      </p>

      {/* Mini Feature Perks */}
      <div className="flex items-center gap-4 text-xs text-slate-400 mb-8">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Quick Reflexes</span>
        </div>
        <span>·</span>
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Shrinking Target</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        type="button"
        className="w-full max-w-xs h-14 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 active:scale-[0.98] transition-all text-white font-display font-black text-lg tracking-wide shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group cursor-pointer"
      >
        <Play className="w-5 h-5 fill-white group-hover:translate-x-0.5 transition-transform" />
        <span>Start Game</span>
      </button>

      {highScore > 0 && (
        <div className="mt-4 text-xs text-slate-400 font-medium">
          Current High Score: <span className="text-amber-400 font-bold">{highScore}</span>
        </div>
      )}
    </div>
  );
};
