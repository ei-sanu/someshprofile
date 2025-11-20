import { Coffee, Send, X } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleCoffeeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCoffeeModal(true);
  };

  const handleDonateClick = () => {
    // Open Buy Me a Coffee in a new window with specific dimensions for a popup feel
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      `https://buymeacoffee.com/someshranjv`,
      'Buy Me a Coffee',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );
  };

  return (
    <>
      <section className="relative py-20 bg-slate-900 overflow-hidden">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 md:p-12 shadow-2xl hover:border-cyan-400/50 transition-all duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Subscribe to My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Newsletter</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Stay updated with the latest in cybersecurity trends and tips
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-6 py-4 bg-slate-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/50"
                  >
                    <Send className="w-5 h-5" />
                    <span>Subscribe</span>
                  </button>
                </div>
                {status === 'success' && (
                  <p className="text-green-400 text-center mt-4 animate-fade-in">
                    ✓ Thanks for subscribing! Check your inbox.
                  </p>
                )}
              </form>

              <div className="border-t border-cyan-500/30 pt-8">
                <div className="text-center">
                  <div className="inline-block mb-4">
                    <Coffee className="w-12 h-12 text-yellow-400 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Support My <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Work</span>
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    If you find my work helpful, consider buying me a coffee to keep me energized and creating more content!
                  </p>
                  <button
                    onClick={handleCoffeeClick}
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50"
                  >
                    <Coffee className="w-5 h-5" />
                    <span>Buy me a coffee</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Coffee Modal */}
      {showCoffeeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowCoffeeModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-2 border-cyan-400/50 rounded-2xl shadow-2xl shadow-cyan-500/50 overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg1OSwgMTMwLCAyNDYsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

            {/* Glowing Orbs */}
            <div className="absolute top-5 right-5 w-24 h-24 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-5 left-5 w-28 h-28 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Header */}
            <div className="relative bg-gradient-to-r from-yellow-600/30 via-orange-600/30 to-yellow-600/30 border-b border-cyan-400/30 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-yellow-400 animate-bounce" />
                <h3 className="text-lg font-bold text-white">Support Me</h3>
              </div>
              <button
                onClick={() => setShowCoffeeModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="relative p-5">
              <div className="text-center mb-5">
                <div className="inline-block p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full mb-3">
                  <Coffee className="w-10 h-10 text-yellow-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Buy Me a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Coffee</span>
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Your support helps me create amazing cybersecurity content!
                </p>

                {/* Single Coffee Card */}
                <div className="max-w-xs mx-auto mb-5">
                  <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-cyan-400/30 hover:border-yellow-400 rounded-xl p-6 transition-all transform hover:scale-105">
                    <div className="text-5xl mb-3">☕</div>
                    <div className="text-xl font-bold text-white mb-2">
                      Donate a Coffee
                    </div>
                    <p className="text-xs text-gray-400">
                      Show your appreciation
                    </p>
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonateClick}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 flex items-center justify-center space-x-2"
                >
                  <Coffee className="w-5 h-5" />
                  <span>Donate Now</span>
                </button>
              </div>

              {/* Footer Info */}
              <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-xs leading-relaxed">
                      <span className="text-cyan-400 font-semibold">Secure:</span> Redirects to Buy Me a Coffee's encrypted checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </>
  );
}
