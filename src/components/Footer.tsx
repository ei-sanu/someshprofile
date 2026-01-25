import { Briefcase, FileText, Github, Home, Instagram, Linkedin, Lock, Mail, Shield, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/yourusername', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: 'https://linkedin.com/in/yourusername', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://instagram.com/yourusername', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Github, href: 'https://github.com/ei-sanu', label: 'GitHub', color: 'hover:text-purple-400' },
  ];

  const quickLinks = [
    { icon: Home, href: '/', label: 'Home', color: 'hover:text-cyan-400' },
    { icon: FileText, href: '/terms', label: 'Terms', color: 'hover:text-blue-400' },
    { icon: Briefcase, href: '/projects', label: 'Projects', color: 'hover:text-purple-400' },
    { icon: Lock, href: '/privacy', label: 'Privacy', color: 'hover:text-green-400' },
    { icon: Mail, href: '#contact', label: 'Contact', color: 'hover:text-pink-400' },
  ];

  const handleLinkClick = (href: string) => {
    // Scroll to top when navigating to a new page
    if (!href.startsWith('#')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="relative bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 border-t border-cyan-500/20 text-gray-300 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-5 left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <div
          className="absolute bottom-5 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content - Centered */}
        <div className="flex flex-col items-center space-y-4">

          {/* Logo/Name Section - Animated */}
          <div
            className="text-center space-y-1"
          >
            <div className="flex items-center justify-center space-x-2 group">
              <div>
                <Shield className="w-7 h-7 text-cyan-400 drop-shadow-glow" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-wider">
                SANU
              </h2>
              <div>
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <p className="text-gray-400 text-xs font-mono">
              &lt; Cyber Security Enthusiast /&gt;
            </p>
          </div>

          {/* Social Media Links - Animated Icons */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative p-3 bg-slate-900/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-xs font-medium text-cyan-400">{social.label}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Divider with Animation */}
          <div
            className="max-w-xs h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          />

          {/* Quick Links - Icon Based */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {quickLinks.map((link, index) => (
              <div
                key={link.label}
              >
                <Link
                  to={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`group relative flex flex-col items-center space-y-1 p-2.5 bg-slate-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg transition-all duration-300 hover:scale-110 hover:border-cyan-400 hover:shadow-lg hover:shadow-blue-500/50 ${link.color}`}
                >
                  <link.icon className="w-5 h-5 text-gray-300 group-hover:scale-125 transition-transform duration-300 drop-shadow-glow" />
                  <span className="text-[10px] font-medium text-gray-400 group-hover:text-cyan-400 transition-colors duration-300">
                    {link.label}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur" />
                </Link>
              </div>
            ))}
          </div>

          {/* Divider with Animation */}
          <div
            className="max-w-xs h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />

          {/* Copyright - Robotic Font */}
          <div
            className="text-center"
          >
            <p className="text-xs text-gray-400 font-mono tracking-widest robotic-text">
              <span className="text-cyan-400">©</span> {currentYear} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold">SANU</span>. ALL RIGHTS RESERVED.
            </p>
            <div className="mt-1 flex items-center justify-center space-x-2 text-[10px] text-gray-500">
              <span>
                ●
              </span>
              <span className="font-mono">SECURED BY CYBERNOVA</span>
              <span>
                ●
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .robotic-text {
          font-family: 'Orbitron', 'Courier New', monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.6));
        }
      `}</style>
    </footer>
  );
}
