import { AlertCircle, Coffee, Send, X } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);

  // Email validation function
  const validateEmail = (email: string): { isValid: boolean; message: string } => {
    // Check if email is empty
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' };
    }

    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }

    const emailParts = email.split('@');
    const localPart = emailParts[0];
    const domainPart = emailParts[1]?.toLowerCase();

    // Check for minimum length before @
    if (localPart.length < 2) {
      return { isValid: false, message: 'Email address is too short' };
    }

    // Check for maximum length
    if (email.length > 254) {
      return { isValid: false, message: 'Email address is too long' };
    }

    // Check for consecutive dots
    if (email.includes('..')) {
      return { isValid: false, message: 'Invalid email format' };
    }

    // Check if starts or ends with dot
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return { isValid: false, message: 'Invalid email format' };
    }

    // Check for obviously fake/test patterns
    const obviousFakePatterns = [
      /^test@/i,
      /^fake@/i,
      /^example@/i,
      /^demo@/i,
      /^admin@test/i,
      /^[0-9]{10,}@/i,  // 10+ consecutive numbers
      /@test\.test$/i,
      /@example\.com$/i,
      /@example\.org$/i,
    ];

    for (const pattern of obviousFakePatterns) {
      if (pattern.test(email)) {
        return { isValid: false, message: 'Please enter a real email address' };
      }
    }

    // Check for disposable/temporary email services (common ones)
    const disposableDomains = [
      'tempmail', 'throwaway', '10minutemail', 'guerrillamail',
      'mailinator', 'trashmail', 'fakeinbox', 'maildrop',
      'yopmail', 'temp-mail', 'disposablemail', 'getnada',
      'sharklasers', 'guerrillamailblock', 'spam4', 'grr.la',
      'emailondeck', 'mintemail', 'mytrashmail', 'mailnesia',
      'mohmal', 'crazymailing', 'dispostable'
    ];

    // Check if domain contains any disposable keywords
    const isDomainDisposable = disposableDomains.some(disposable =>
      domainPart?.includes(disposable)
    );

    if (isDomainDisposable) {
      return { isValid: false, message: 'Temporary email addresses are not allowed' };
    }

    // Check for valid domain structure
    if (!domainPart || !domainPart.includes('.')) {
      return { isValid: false, message: 'Invalid email domain' };
    }

    // Check for valid TLD (top-level domain)
    const tld = domainPart.split('.').pop();
    if (!tld || tld.length < 2) {
      return { isValid: false, message: 'Invalid email domain' };
    }

    // Check for common typos in popular domains (optional, less restrictive)
    const domainTypos: { [key: string]: string } = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmil.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
    };

    if (domainTypos[domainPart]) {
      return {
        isValid: false,
        message: `Did you mean ${email.replace(domainPart, domainTypos[domainPart])}?`
      };
    }

    // All checks passed
    return { isValid: true, message: '' };
  };

  // Real-time email validation as user types
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Clear error message when user starts typing again
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate email before submission
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    setStatus('sending');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyL4Gt01t4ZhjCW27vdq1pQdN9HNl97NIH3PPWyxU61UrC3Qf3GiOjABzKbK5GIjVhh/exec';

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}`
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to subscribe. Please try again.');
        setTimeout(() => {
          setStatus('idle');
          setErrorMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection.');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleCoffeeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCoffeeModal(true);
  };

  const handleDonateClick = () => {
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
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      disabled={status === 'sending'}
                      className={`w-full px-6 py-4 bg-slate-900/80 backdrop-blur-sm border ${errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-blue-500/30 focus:border-cyan-400 focus:ring-cyan-400/20'
                        } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errorMessage && (
                      <div className="flex items-center space-x-2 mt-2 text-red-400 text-sm animate-fade-in">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="cyber-loader" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>
                {status === 'success' && (
                  <div className="mt-4 animate-fade-in">
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <div className="success-checkmark">
                        <div className="check-icon">
                          <span className="icon-line line-tip"></span>
                          <span className="icon-line line-long"></span>
                          <div className="icon-circle"></div>
                          <div className="icon-fix"></div>
                        </div>
                      </div>
                      <span className="font-semibold">Thanks for subscribing! Check your inbox.</span>
                    </div>
                  </div>
                )}
                {status === 'error' && !errorMessage && (
                  <div className="mt-4 animate-fade-in">
                    <div className="flex items-center justify-center space-x-2 text-red-400">
                      <div className="error-cross">
                        <div className="cross-icon">
                          <span className="cross-line cross-line-1"></span>
                          <span className="cross-line cross-line-2"></span>
                          <div className="cross-circle"></div>
                        </div>
                      </div>
                      <span className="font-semibold">Something went wrong. Please try again.</span>
                    </div>
                  </div>
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
        /* Cyber Loader Animation */
        .cyber-loader {
          width: 20px;
          height: 20px;
          border: 3px solid transparent;
          border-top-color: #22d3ee;
          border-bottom-color: #3b82f6;
          border-radius: 50%;
          animation: cyber-spin 1s linear infinite;
          position: relative;
        }

        .cyber-loader::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border: 3px solid transparent;
          border-top-color: rgba(34, 211, 238, 0.3);
          border-radius: 50%;
          animation: cyber-spin 1.5s linear infinite reverse;
        }

        @keyframes cyber-spin {
          0% {
            transform: rotate(0deg);
            box-shadow: 0 0 5px rgba(34, 211, 238, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(34, 211, 238, 0.8), 0 0 25px rgba(59, 130, 246, 0.5);
          }
          100% {
            transform: rotate(360deg);
            box-shadow: 0 0 5px rgba(34, 211, 238, 0.5);
          }
        }

        /* Success Checkmark Animation */
        .success-checkmark {
          width: 24px;
          height: 24px;
        }

        .check-icon {
          width: 24px;
          height: 24px;
          position: relative;
          border-radius: 50%;
          box-sizing: content-box;
          border: 2px solid #22c55e;
          animation: checkmark-scale 0.3s ease-in-out;
        }

        .icon-line {
          height: 2px;
          background-color: #22c55e;
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
        }

        .icon-line.line-tip {
          top: 11px;
          left: 5px;
          width: 6px;
          transform: rotate(45deg);
          animation: icon-line-tip 0.3s 0.1s ease-in-out forwards;
          opacity: 0;
        }

        .icon-line.line-long {
          top: 9px;
          right: 4px;
          width: 12px;
          transform: rotate(-45deg);
          animation: icon-line-long 0.3s 0.2s ease-in-out forwards;
          opacity: 0;
        }

        .icon-circle {
          top: -2px;
          left: -2px;
          z-index: 10;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          position: absolute;
          box-sizing: content-box;
          border: 2px solid rgba(34, 197, 94, 0.3);
          animation: checkmark-circle 0.6s ease-in-out;
        }

        .icon-fix {
          top: 6px;
          width: 3px;
          left: 13px;
          z-index: 1;
          height: 7px;
          position: absolute;
          background-color: #1e293b;
          transform: rotate(-45deg);
        }

        @keyframes checkmark-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes checkmark-circle {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.2);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        @keyframes icon-line-tip {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 6px;
            opacity: 1;
          }
        }

        @keyframes icon-line-long {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 12px;
            opacity: 1;
          }
        }

        /* Error Cross Animation */
        .error-cross {
          width: 24px;
          height: 24px;
        }

        .cross-icon {
          width: 24px;
          height: 24px;
          position: relative;
          border-radius: 50%;
          box-sizing: content-box;
          border: 2px solid #ef4444;
          animation: cross-scale 0.3s ease-in-out;
        }

        .cross-line {
          height: 2px;
          background-color: #ef4444;
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
          top: 10px;
          width: 12px;
          left: 4px;
        }

        .cross-line-1 {
          transform: rotate(45deg);
          animation: cross-line-animate 0.3s 0.1s ease-in-out forwards;
          opacity: 0;
        }

        .cross-line-2 {
          transform: rotate(-45deg);
          animation: cross-line-animate 0.3s 0.2s ease-in-out forwards;
          opacity: 0;
        }

        .cross-circle {
          top: -2px;
          left: -2px;
          z-index: 10;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          position: absolute;
          box-sizing: content-box;
          border: 2px solid rgba(239, 68, 68, 0.3);
          animation: cross-circle-animate 0.6s ease-in-out;
        }

        @keyframes cross-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes cross-circle-animate {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.2);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        @keyframes cross-line-animate {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 12px;
            opacity: 1;
          }
        }

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
