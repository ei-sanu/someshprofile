import { useEffect, useState } from 'react';
import { Shield, Lock, Terminal } from 'lucide-react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Initializing...');

  useEffect(() => {
    const texts = [
      'Initializing...',
      'Loading security modules...',
      'Establishing secure connection...',
      'Verifying credentials...',
      'Access granted'
    ];

    let currentTextIndex = 0;
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      if (currentProgress >= 25 * (currentTextIndex + 1) && currentTextIndex < texts.length - 1) {
        currentTextIndex++;
        setText(texts[currentTextIndex]);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Shield className="w-12 h-12 text-blue-500 animate-pulse" style={{ animationDelay: '0ms' }} />
            <Lock className="w-16 h-16 text-cyan-400 animate-pulse" style={{ animationDelay: '150ms' }} />
            <Terminal className="w-12 h-12 text-blue-500 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>

          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-32 h-32 border-4 border-blue-500/20 rounded-full animate-ping" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-wider">
            {text}
          </h2>

          <div className="w-80 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 transition-all duration-300 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          <p className="text-blue-400 font-mono text-sm">{progress}%</p>
        </div>

        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
