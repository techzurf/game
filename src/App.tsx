import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameHUD } from './components/GameHUD';
import { Target, TARGET_THEMES } from './components/Target';
import { TapEffects, HitEffect, MissEffect } from './components/TapEffects';
import { GameOverModal } from './components/GameOverModal';
import { StartScreen } from './components/StartScreen';
import { Confetti } from './components/Confetti';
import { soundEffects } from './utils/audio';

type GameState = 'START' | 'PLAYING' | 'GAME_OVER';

const GAME_DURATION = 30; // 30 seconds
const STORAGE_KEY = 'tap_the_target_high_score';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [initialHighScore, setInitialHighScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Target coordinates and dimensions
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [targetSize, setTargetSize] = useState<number>(82);

  // Visual tap effects
  const [hits, setHits] = useState<HitEffect[]>([]);
  const [misses, setMisses] = useState<MissEffect[]>([]);
  const [totalMisses, setTotalMisses] = useState<number>(0);

  // High score celebration confetti flag
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Refs
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickSecondRef = useRef<number>(6);

  // Update target size based on score:
  // Starts around 82px, shrinks smoothly down to 38px as score rises
  const calculateTargetSize = useCallback((currentScore: number) => {
    return Math.max(38, Math.round(82 - Math.min(currentScore * 1.4, 44)));
  }, []);

  // Compute a random position strictly within container bounds
  const getNextPosition = useCallback((size: number) => {
    if (!gameAreaRef.current) {
      return { x: 50, y: 50 };
    }
    const rect = gameAreaRef.current.getBoundingClientRect();
    const padding = 16;
    const maxX = Math.max(padding, rect.width - size - padding);
    const maxY = Math.max(padding, rect.height - size - padding);

    const x = padding + Math.random() * Math.max(0, maxX - padding);
    const y = padding + Math.random() * Math.max(0, maxY - padding);

    return { x: Math.round(x), y: Math.round(y) };
  }, []);

  // Spawn new target
  const spawnNewTarget = useCallback((newScore: number) => {
    const size = calculateTargetSize(newScore);
    setTargetSize(size);
    const pos = getNextPosition(size);
    setTargetPos(pos);
  }, [calculateTargetSize, getNextPosition]);

  // Start or restart game
  const startGame = useCallback(() => {
    setScore(0);
    setTotalMisses(0);
    setHits([]);
    setMisses([]);
    setShowConfetti(false);
    setTimeLeft(GAME_DURATION);
    setInitialHighScore(highScore);
    lastTickSecondRef.current = 6;

    setGameState('PLAYING');
    startTimeRef.current = performance.now();

    // Spawn first target
    const initialSize = calculateTargetSize(0);
    setTargetSize(initialSize);
    // Ensure bounds are measured
    requestAnimationFrame(() => {
      const initialPos = getNextPosition(initialSize);
      setTargetPos(initialPos);
    });
  }, [calculateTargetSize, getNextPosition, highScore]);

  // End game handler
  const handleGameOver = useCallback((finalScore: number) => {
    setGameState('GAME_OVER');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const isNewBest = finalScore > initialHighScore && finalScore > 0;
    if (isNewBest) {
      setShowConfetti(true);
      soundEffects.playHighScoreCelebration();
    } else {
      soundEffects.playGameOver();
    }

    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem(STORAGE_KEY, finalScore.toString());
      } catch {
        // Safe fallback
      }
    }
  }, [highScore, initialHighScore]);

  // Main countdown timer loop using high-precision performance.now()
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const tick = (now: number) => {
      const elapsedSeconds = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, GAME_DURATION - elapsedSeconds);
      setTimeLeft(remaining);

      // Play audio cue for final 5 seconds
      const currentCeil = Math.ceil(remaining);
      if (currentCeil <= 5 && currentCeil > 0 && currentCeil < lastTickSecondRef.current) {
        lastTickSecondRef.current = currentCeil;
        soundEffects.playCountdownTick();
      }

      if (remaining <= 0) {
        handleGameOver(score);
      } else {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, handleGameOver, score]);

  // Target Hit Handler
  const handleTargetHit = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (gameState !== 'PLAYING') return;

      const newScore = score + 1;
      setScore(newScore);

      // Sound
      soundEffects.playPop(newScore);

      // Active theme color for visual effects
      const theme = TARGET_THEMES[Math.floor(score / 3) % TARGET_THEMES.length];

      // Spawn visual hit floating indicator
      const rect = gameAreaRef.current?.getBoundingClientRect();
      const clickX = rect ? e.clientX - rect.left : targetPos.x + targetSize / 2;
      const clickY = rect ? e.clientY - rect.top : targetPos.y + targetSize / 2;

      const newHitId = Date.now() + Math.random();
      setHits((prev) => [
        ...prev.slice(-8), // Keep max 8 active floating indicators
        { id: newHitId, x: clickX, y: clickY, color: theme.accent },
      ]);

      // Remove effect after animation completes
      setTimeout(() => {
        setHits((prev) => prev.filter((h) => h.id !== newHitId));
      }, 700);

      // Move target immediately to random new position
      spawnNewTarget(newScore);

      // If surpassed high score in real-time, update high score
      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          localStorage.setItem(STORAGE_KEY, newScore.toString());
        } catch {
          // Ignore
        }
      }
    },
    [gameState, score, targetPos, targetSize, spawnNewTarget, highScore]
  );

  // Background Game Area Tap (Miss) Handler
  const pointerDownRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleGameAreaPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (gameState !== 'PLAYING') return;

      // Don't register miss if clicked on HUD or controls
      if ((e.target as HTMLElement).closest('button')) return;

      pointerDownRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      };
    },
    [gameState]
  );

  const handleGameAreaPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (gameState !== 'PLAYING' || !pointerDownRef.current) return;

      const dx = Math.abs(e.clientX - pointerDownRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownRef.current.y);
      const dt = performance.now() - pointerDownRef.current.time;
      pointerDownRef.current = null;

      // If moved more than 10px or pressed for longer than 400ms, it's a scroll gesture, not a tap
      if (dx > 10 || dy > 10 || dt > 400) {
        return;
      }

      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      setTotalMisses((prev) => prev + 1);

      const missId = Date.now() + Math.random();
      setMisses((prev) => [
        ...prev.slice(-5),
        { id: missId, x: clickX, y: clickY },
      ]);

      setTimeout(() => {
        setMisses((prev) => prev.filter((m) => m.id !== missId));
      }, 550);
    },
    [gameState]
  );

  // Handle Window Resize to keep target strictly inside game area
  useEffect(() => {
    const handleResize = () => {
      if (gameState === 'PLAYING' && gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const padding = 16;
        setTargetPos((prev) => ({
          x: Math.min(Math.max(padding, prev.x), Math.max(padding, rect.width - targetSize - padding)),
          y: Math.min(Math.max(padding, prev.y), Math.max(padding, rect.height - targetSize - padding)),
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gameState, targetSize]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
  };

  const isNewHighScore = score > initialHighScore && score > 0;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 select-none flex flex-col items-center relative overflow-x-hidden">
      {/* Decorative ambient gradient spots covering full screen */}
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-96 h-96 rounded-full bg-fuchsia-600/15 blur-3xl pointer-events-none" />

      {/* Confetti Celebration */}
      {showConfetti && <Confetti />}

      {/* Main app container: Full width on mobile, cleanly centered on desktop */}
      <div className="w-full max-w-md min-h-screen flex flex-col justify-between p-2 sm:p-3 relative z-10">
        {/* Game HUD (Score, High Score, 30s Countdown, Sound Toggle) */}
        <GameHUD
          score={score}
          highScore={highScore}
          timeLeft={timeLeft}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          isNewHighScore={isNewHighScore}
          totalTime={GAME_DURATION}
        />

        {/* Main Interactive Game Arena */}
        <main
          ref={gameAreaRef}
          onPointerDown={handleGameAreaPointerDown}
          onPointerUp={handleGameAreaPointerUp}
          className="relative flex-1 my-2 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-sm overflow-hidden cursor-crosshair flex flex-col min-h-[460px] touch-pan-y w-full"
          aria-label="Target Game Arena"
        >
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Start Game Screen Overlay */}
          {gameState === 'START' && (
            <StartScreen onStart={startGame} highScore={highScore} />
          )}

          {/* Interactive Target during PLAYING state */}
          {gameState === 'PLAYING' && (
            <Target
              x={targetPos.x}
              y={targetPos.y}
              size={targetSize}
              score={score}
              onHit={handleTargetHit}
            />
          )}

          {/* Visual Tap Feedback (Hit ripples, +1 floating text, miss ripples) */}
          <TapEffects hits={hits} misses={misses} />

          {/* Game Over Screen */}
          {gameState === 'GAME_OVER' && (
            <GameOverModal
              score={score}
              highScore={highScore}
              isNewHighScore={isNewHighScore}
              onPlayAgain={startGame}
              totalHits={score}
              totalMisses={totalMisses}
            />
          )}
        </main>

        {/* Bottom Subtle Status Bar / Info */}
        <footer className="py-2 px-2 text-center text-[11px] text-slate-500 font-medium">
          {gameState === 'PLAYING' ? (
            <span>Target size shrinks as your score climbs · Tap fast!</span>
          ) : (
            <span>Tap the Target · Mobile Reflex Challenge</span>
          )}
        </footer>
      </div>
    </div>
  );
}
