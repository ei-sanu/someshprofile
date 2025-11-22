import { AlertCircle, Github, Mail, MapPin, Phone, Send, X } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const formDataToSend = new FormData();
    formDataToSend.append('access_key', '9c4dbdf0-8c38-47a5-aab1-9e3b06b196db');
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('message', formData.message);

    // Custom subject line
    formDataToSend.append('subject', '🚀 Portfolio Contact: New Message from ' + formData.name);

    // Custom email template with better formatting
    formDataToSend.append('from_name', 'Portfolio Contact Form');

    // Add redirect (optional - where to redirect after form submission)
    formDataToSend.append('redirect', window.location.origin + '/?success=true');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Failed to send message. Please try again.');
        setTimeout(() => {
          setStatus('idle');
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection.');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Location',
      value: 'Odisha, India',
      onClick: () => setShowMap(true)
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'Click to email',
      link: 'mailto:someshranjanbiswal13678@gmail.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 7008450074',
      link: 'tel:+917008450074'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'ei-sanu',
      link: 'https://github.com/ei-sanu'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-white mb-4">
            Get in <span className="text-cyan-400">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-12" />

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 text-center lg:text-left">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {contactInfo.map((info) => (
                    <div
                      key={info.label}
                      className="flex flex-col items-center justify-center text-center space-y-2 p-4 bg-slate-950/50 border border-blue-500/30 rounded-lg hover:border-cyan-400 hover:bg-slate-950/70 transition-all cursor-pointer group min-h-[140px]"
                      onClick={info.onClick}
                    >
                      <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-cyan-400/20 transition-colors">
                        <info.icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{info.label}</p>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-white text-sm font-semibold hover:text-cyan-400 transition-colors block break-words"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-white text-sm font-semibold break-words">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center lg:text-left">Let's Connect</h3>
                <p className="text-gray-300 leading-relaxed text-center lg:text-left">
                  Have a project in mind or want to discuss security solutions? Feel free to reach out.
                  I'm always open to discussing new opportunities and collaborations in the cybersecurity space.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 bg-slate-950 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 bg-slate-950 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="yourname@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2 font-medium">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 bg-slate-950 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tell me about your project or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/50"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="cyber-loader" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <div className="success-checkmark">
                        <div className="check-icon">
                          <span className="icon-line line-tip"></span>
                          <span className="icon-line line-long"></span>
                          <div className="icon-circle"></div>
                          <div className="icon-fix"></div>
                        </div>
                      </div>
                      <span className="font-semibold">Message sent successfully! I'll get back to you soon.</span>
                    </div>
                  </div>
                )}

                {status === 'error' && errorMessage && (
                  <div className="animate-fade-in">
                    <div className="flex items-center space-x-2 text-red-400">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold">{errorMessage}</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowMap(false)}
        >
          <div
            className="relative bg-slate-900 border border-cyan-400/50 rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-blue-500/30 bg-slate-950">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Dhenkanal, Odisha, India</h3>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
            <div className="relative w-full h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59733.78466846232!2d85.5586806536228!3d20.654865090440833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a18dffbd38b1513%3A0x4fe423769b5f1ee7!2sDhenkanal%2C%20Odisha!5e0!3m2!1sen!2sin!4v1744143270876!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
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
          background-color: #0f172a;
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
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
