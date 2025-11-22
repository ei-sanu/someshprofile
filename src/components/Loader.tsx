import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  angle: number;
  distance: number;
  delay: number;
  size: number;
}

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsComplete(true);

        // Generate bubbles exploding from center
        const newBubbles = Array.from({ length: 50 }, (_, i) => ({
          id: i,
          angle: (360 / 50) * i + Math.random() * 7,
          distance: 200 + Math.random() * 150,
          delay: Math.random() * 0.2,
          size: 10 + Math.random() * 20,
        }));
        setBubbles(newBubbles);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Circular Loader - Centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-48 h-48">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-2xl animate-pulse" />

          {/* Progress circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="86"
              fill="none"
              stroke="rgba(30, 58, 138, 0.3)"
              strokeWidth="8"
            />

            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="86"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 86}`}
              strokeDashoffset={`${2 * Math.PI * 86 * (1 - progress / 100)}`}
              style={{
                transition: 'stroke-dashoffset 0.3s ease-out',
                willChange: 'stroke-dashoffset'
              }}
            />

            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Shield
              className={`w-14 h-14 mb-3 transition-all duration-500 ${isComplete ? 'text-cyan-400 scale-125' : 'text-blue-500 animate-pulse'
                }`}
            />
            <span className="text-3xl font-bold text-cyan-400 font-mono">
              {progress}%
            </span>
            {isComplete && (
              <span className="text-xs text-cyan-500 font-mono mt-2 animate-pulse">
                Complete!
              </span>
            )}
          </div>

          {/* Rotating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                animation: `orbit 3s infinite ease-in-out`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 'calc(100% + 2rem)' }}>
          {!isComplete && (
            <p className="text-blue-400 font-mono text-base text-center whitespace-nowrap animate-pulse">
              Accelerating connection...
            </p>
          )}

          {isComplete && (
            <p className="text-cyan-400 font-mono text-base text-center whitespace-nowrap font-bold">
              Ready to roll!
            </p>
          )}
        </div>
      </div>

      {/* Shield Bubbles exploding from center */}
      {isComplete && bubbles.map((bubble) => {
        const endX = Math.cos((bubble.angle * Math.PI) / 180) * bubble.distance;
        const endY = Math.sin((bubble.angle * Math.PI) / 180) * bubble.distance;

        return (
          <div
            key={bubble.id}
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animation: `explode 1.8s ease-out forwards`,
              animationDelay: `${bubble.delay}s`,
              '--end-x': `${endX}px`,
              '--end-y': `${endY}px`,
              willChange: 'transform, opacity',
            } as React.CSSProperties}
          >
            <Shield
              className="w-full h-full text-cyan-400"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))',
              }}
            />
          </div>
        );
      })}

      <style>{`
        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(100px) rotate(-360deg);
            opacity: 0;
          }
        }

        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(1) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
