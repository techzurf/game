import React from 'react';
import { Volume2, VolumeX, Trophy, Timer, Flame } from 'lucide-react';

interface GameHUDProps {
  score: number;
  highScore: number;
  timeLeft: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isNewHighScore: boolean;
  totalTime?: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  timeLeft,
  soundEnabled,
  onToggleSound,
  isNewHighScore,
  totalTime = 30,
}) => {
  const isUrgent = timeLeft <= 5 && timeLeft > 0;
  const progressRatio = Math.max(0, Math.min(1, timeLeft / totalTime));

  // Circular progress math
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <header className="w-full flex flex-col gap-3 max-w-md mx-auto px-4 pt-3 pb-2">
      {/* Top bar with Game Title & Sound toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="w-3 h-3 rounded-full bg-white ring-2 ring-white/50" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg md:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Tap the Target
            </h1>
          </div>
        </div>

        <button
          onClick={onToggleSound}
          type="button"
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-95 shadow-sm"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
        </button>
      </div>

      {/* Metrics Row: Score, Timer Ring, High Score */}
      <div className="grid grid-cols-3 gap-2.5 items-center">
        {/* Score Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col items-center justify-center shadow-md relative overflow-hidden">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Score</span>
            {isNewHighScore && score > 0 && (
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            )}
          </div>
          <span className="font-display font-extrabold text-2xl md:text-3xl text-white tabular-nums tracking-tight">
            {score}
          </span>
          {isNewHighScore && score > 0 && (
            <span className="text-[10px] font-bold text-amber-400 leading-none">
              BEST!
            </span>
          )}
        </div>

        {/* Countdown Timer with Animated Circular Ring */}
        <div
          className={`bg-slate-900/90 border rounded-2xl p-2 flex flex-col items-center justify-center shadow-md transition-all relative ${
            isUrgent
              ? 'border-rose-500/80 bg-rose-950/30 ring-2 ring-rose-500/40 animate-pulse'
              : 'border-slate-800/80'
          }`}
        >
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                className={`transition-all duration-200 ${
                  isUrgent
                    ? 'stroke-rose-500'
                    : timeLeft <= 10
                    ? 'stroke-amber-400'
                    : 'stroke-cyan-400'
                }`}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`font-display font-black text-xl tabular-nums leading-none ${
                  isUrgent ? 'text-rose-400 scale-110' : 'text-cyan-300'
                }`}
              >
                {Math.ceil(timeLeft)}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">
                sec
              </span>
            </div>
          </div>
        </div>

        {/* High Score Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col items-center justify-center shadow-md">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Best</span>
          </div>
          <span className="font-display font-extrabold text-2xl md:text-3xl text-amber-400 tabular-nums tracking-tight">
            {highScore}
          </span>
          <span className="text-[10px] text-slate-400 leading-none">
            Record
          </span>
        </div>
      </div>
    </header>
  );
};
