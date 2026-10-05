import React from 'react';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  totalHits: number;
  totalMisses: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  onPlayAgain,
  totalHits,
  totalMisses,
}) => {
  const totalTaps = totalHits + totalMisses;
  const accuracy = totalTaps > 0 ? Math.round((totalHits / totalTaps) * 100) : 100;
  const tapsPerSecond = (score / 30).toFixed(1);

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-sm my-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="relative mb-3">
          {isNewHighScore ? (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
              <Trophy className="w-9 h-9 text-slate-950" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
          )}
        </div>

        {isNewHighScore ? (
          <div className="mb-1 flex items-center gap-1.5 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>New High Score!</span>
            <Sparkles className="w-4 h-4" />
          </div>
        ) : (
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Game Over
          </span>
        )}

        <h2 className="font-display font-black text-3xl text-white tracking-tight mb-4">
          {isNewHighScore ? 'Outstanding!' : 'Time’s Up!'}
        </h2>

        {/* Score Showcase */}
        <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-5">
          <div className="text-xs font-medium text-slate-400 mb-1">Final Score</div>
          <div className="font-display font-black text-5xl text-white tabular-nums tracking-tight">
            {score}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 px-2">
            <span>All-Time Best</span>
            <span className="font-bold text-amber-400 tabular-nums text-sm">
              {highScore} pts
            </span>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="w-full grid grid-cols-2 gap-2 text-left mb-6">
          <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800/60">
            <div className="text-[11px] text-slate-400">Speed</div>
            <div className="font-display font-bold text-slate-200 text-base tabular-nums">
              {tapsPerSecond} <span className="text-xs font-normal text-slate-400">taps/s</span>
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800/60">
            <div className="text-[11px] text-slate-400">Accuracy</div>
            <div className="font-display font-bold text-slate-200 text-base tabular-nums">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Primary CTA: Play Again */}
        <button
          onClick={onPlayAgain}
          type="button"
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-display font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all hover:brightness-110"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
};
