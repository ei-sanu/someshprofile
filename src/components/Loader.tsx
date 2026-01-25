import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* Circular Loader - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-2xl" />

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
            <div>
              <Shield
                className={`w-14 h-14 mb-3 ${isComplete ? 'text-cyan-400' : 'text-blue-500'}`}
              />
            </div>
            <span className="text-3xl font-bold text-cyan-400 font-mono">
              {progress}%
            </span>
            {isComplete && (
              <span className="text-xs text-cyan-500 font-mono mt-2">
                Complete!
              </span>
            )}
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8">
          {!isComplete ? (
            <p className="text-blue-400 font-mono text-base text-center whitespace-nowrap">
              Initializing security protocols...
            </p>
          ) : (
            <p className="text-cyan-400 font-mono text-base text-center whitespace-nowrap font-bold">
              System ready!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
