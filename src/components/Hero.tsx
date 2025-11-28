import { ArrowUp, FolderGit2, Github, Lock, Shield, Terminal, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Spark {
  id: number;
  x: number;
  y: number;
}

interface GitHubStats {
  followers: number;
  following: number;
  public_repos: number;
  name: string;
  bio: string;
  avatar_url: string;
}

export default function Hero() {
  const [terminalText, setTerminalText] = useState('');
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string>('');
  const [iconPositions, setIconPositions] = useState({
    icon1: { x: 0, y: 0 },
    icon2: { x: 0, y: 0 },
    icon3: { x: 0, y: 0 },
    icon4: { x: 0, y: 0 },
    icon5: { x: 0, y: 0 },
    icon6: { x: 0, y: 0 }
  });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [imageTilt, setImageTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [badgeTilt, setBadgeTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const fullText = 'blue-team-defender';

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTerminalText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      const newSpark: Spark = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setSparks(prev => [...prev, newSpark]);

      setTimeout(() => {
        setSparks(prev => prev.filter(spark => spark.id !== newSpark.id));
      }, 1200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleIconHover = (iconKey: string, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const deltaX = centerX - mouseX;
    const deltaY = centerY - mouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const maxDistance = 100;
    const force = Math.min(distance, maxDistance) / maxDistance;
    const moveX = (deltaX / distance) * force * 30;
    const moveY = (deltaY / distance) * force * 30;

    setIconPositions(prev => ({
      ...prev,
      [iconKey]: { x: moveX, y: moveY }
    }));
  };

  const handleIconLeave = (iconKey: string) => {
    setIconPositions(prev => ({
      ...prev,
      [iconKey]: { x: 0, y: 0 }
    }));
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * -10;
    const rotateX = ((y - centerY) / centerY) * 10;

    setImageTilt({ rotateX, rotateY });
  };

  const handleImageMouseLeave = () => {
    setImageTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleBadgeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((y - centerY) / centerY) * -8;

    setBadgeTilt({ rotateX, rotateY });
  };

  const handleBadgeMouseLeave = () => {
    setBadgeTilt({ rotateX: 0, rotateY: 0 });
  };

  const crystalColors = [
    { start: 'rgba(236, 72, 153, 1)', end: 'rgba(236, 72, 153, 0.3)', glow: 'rgba(236, 72, 153, 0.8)' },
    { start: 'rgba(34, 197, 94, 1)', end: 'rgba(34, 197, 94, 0.3)', glow: 'rgba(34, 197, 94, 0.8)' },
    { start: 'rgba(59, 130, 246, 1)', end: 'rgba(59, 130, 246, 0.3)', glow: 'rgba(59, 130, 246, 0.8)' },
    { start: 'rgba(168, 85, 247, 1)', end: 'rgba(168, 85, 247, 0.3)', glow: 'rgba(168, 85, 247, 0.8)' },
    { start: 'rgba(34, 211, 238, 1)', end: 'rgba(34, 211, 238, 0.3)', glow: 'rgba(34, 211, 238, 0.8)' },
  ];

  // Fetch GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Check if we have cached data (valid for 5 minutes)
        const cachedData = localStorage.getItem('githubStats');
        const cachedTime = localStorage.getItem('githubStatsTime');

        if (cachedData && cachedTime) {
          const timeDiff = Date.now() - parseInt(cachedTime);
          if (timeDiff < 5 * 60 * 1000) { // 5 minutes
            console.log('Using cached GitHub data');
            setGithubStats(JSON.parse(cachedData));
            setLoadingStats(false);
            return;
          }
        }

        console.log('Fetching GitHub stats for: ei-sanu');

        // Add your GitHub Personal Access Token here (optional but recommended)
        // Get it from: https://github.com/settings/tokens
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json',
        };

        // Only add Authorization if token exists
        if (import.meta.env.VITE_GITHUB_TOKEN) {
          headers['Authorization'] = `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`;
        }

        const response = await fetch('https://api.github.com/users/ei-sanu', {
          headers,
        });

        console.log('Response status:', response.status);
        console.log('Rate limit remaining:', response.headers.get('X-RateLimit-Remaining'));
        console.log('Rate limit reset:', new Date(parseInt(response.headers.get('X-RateLimit-Reset') || '0') * 1000).toLocaleTimeString());

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Rate limit exceeded. Please wait or add a GitHub token.');
          }
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();
        console.log('GitHub data:', data);

        // Cache the dataaa
        localStorage.setItem('githubStats', JSON.stringify(data));
        localStorage.setItem('githubStatsTime', Date.now().toString());

        setGithubStats(data);
        setLoadingStats(false);
        setError('');
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch stats');
        setLoadingStats(false);

        // Try to use cached data even if expired
        const cachedData = localStorage.getItem('githubStats');
        if (cachedData) {
          console.log('Using expired cached data due to error');
          setGithubStats(JSON.parse(cachedData));
        }
      }
    };

    fetchGitHubStats();

    // Refresh stats every 10 minutes instead of 5
    const interval = setInterval(fetchGitHubStats, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 custom-cursor">
        {/* Animated Dark Overlay with Spotlight Effect */}
        <div
          className="spotlight-overlay"
          style={{
            background: `radial-gradient(circle 1000px at ${cursorPosition.x}px ${cursorPosition.y}px, transparent 0%, rgba(0, 0, 0, 0.30) 100%)`
          }}
        />

        {/* Custom Cursor - Only Doot */}
        <div
          className="custom-cursor-dot"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`
          }}
        />

        {/* Colorful Crystal Sparks on Click */}
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="spark-effect"
            style={{
              left: `${spark.x}px`,
              top: `${spark.y}px`
            }}
          >
            <div className="spark-ring" />
            <div className="spark-ring" style={{ animationDelay: '0.1s' }} />
            <div className="spark-ring" style={{ animationDelay: '0.2s' }} />
          </div>
        ))}

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg1OSwgMTMwLCAyNDYsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:pt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* Right Side - GitHub Stats (Profile Image Commented Out) */}
              <div className="relative flex flex-col justify-center items-center animate-slide-right order-1 lg:order-2 mb-8 lg:mb-0 space-y-8">

                {/* PROFILE IMAGE SECTION - COMMENTED OUT FOR NOW */}
                {/*
                <div className="relative group" style={{ perspective: '1000px' }}>
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-75 blur-2xl group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>

                  <div
                    className="relative transform hover:scale-105 transition-all duration-500"
                    onMouseMove={handleImageMouseMove}
                    onMouseLeave={handleImageMouseLeave}
                    style={{
                      transform: `perspective(1000px) rotateX(${imageTilt.rotateX}deg) rotateY(${imageTilt.rotateY}deg) scale(${imageTilt.rotateX !== 0 || imageTilt.rotateY !== 0 ? 1.05 : 1})`,
                      transition: 'transform 0.3s ease-out',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] rounded-2xl overflow-hidden border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50 sticker-effect">
                      <img
                        src="/sanuprofile.jpeg"
                        alt="Somesh Ranjan Biswal"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent"></div>
                    </div>

                    <div
                      className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 w-full px-2 sm:px-4"
                      onMouseMove={handleBadgeMouseMove}
                      onMouseLeave={handleBadgeMouseLeave}
                      style={{
                        transform: `translate(-50%, 0) perspective(1000px) rotateX(${badgeTilt.rotateX}deg) rotateY(${badgeTilt.rotateY}deg)`,
                        transition: 'transform 0.3s ease-out',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-purple-600/30 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-500/30 sticker-badge animate-bounce-slow backdrop-blur-xl">
                        <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1.5 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-xl border border-cyan-400/30">
                          <h2 className="text-[10px] sm:text-base lg:text-lg xl:text-xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-wide sm:tracking-wider uppercase animate-gradient leading-tight">
                            CYBER SECURITY ENTHUSIAST
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div
                      className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-12 sm:h-12 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400 rounded-lg flex items-center justify-center animate-float-slow cursor-pointer hover:bg-cyan-500/40 transition-all duration-300"
                      onMouseMove={(e) => handleIconHover('icon1', e)}
                      onMouseLeave={() => handleIconLeave('icon1')}
                      style={{
                        transform: `translate(${iconPositions.icon1.x}px, ${iconPositions.icon1.y}px)`,
                        transition: 'transform 0.3s ease-out'
                      }}
                    >
                      <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-blue-500/20 backdrop-blur-sm border border-blue-400 rounded-lg flex items-center justify-center animate-float-slow cursor-pointer hover:bg-blue-500/40 transition-all duration-300"
                      style={{
                        animationDelay: '0.5s',
                        transform: `translate(${iconPositions.icon2.x}px, ${iconPositions.icon2.y}px)`,
                        transition: 'transform 0.3s ease-out'
                      }}
                      onMouseMove={(e) => handleIconHover('icon2', e)}
                      onMouseLeave={() => handleIconLeave('icon2')}
                    >
                      <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                  </div>
                </div>
                */}

                {/* GitHub Stats Section - Now in Right Column */}
                <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl pointer-events-auto space-y-6">
                  {/* GitHub Stats Card */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 sm:p-5 lg:p-6 hover:border-cyan-400/50 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <Github className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">GitHub Stats</h3>
                    </div>

                    {loadingStats ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-2"></div>
                        <p className="text-gray-400 text-sm">Loading stats...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-4">
                        <p className="text-red-400 text-sm mb-2">⚠️ {error}</p>
                        <button
                          onClick={() => {
                            setLoadingStats(true);
                            setError('');
                            window.location.reload();
                          }}
                          className="text-cyan-400 text-xs hover:text-cyan-300 underline"
                        >
                          Retry
                        </button>
                      </div>
                    ) : githubStats ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105">
                          <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">{githubStats.followers}</div>
                          <div className="text-xs text-gray-400 mt-1">Followers</div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105">
                          <UserPlus className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">{githubStats.following}</div>
                          <div className="text-xs text-gray-400 mt-1">Following</div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105">
                          <FolderGit2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">{githubStats.public_repos}</div>
                          <div className="text-xs text-gray-400 mt-1">Repositories</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-sm mt-4">
                        Unable to fetch GitHub stats. Please try again later.
                      </div>
                    )}
                  </div>

                  {/* Glowing Cyber Security Enthusiast Badge */}
                  <div className="relative group">
                    {/* Animated background glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>

                    {/* Badge container */}
                    <div className="relative bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-purple-600/30 p-1 rounded-xl shadow-2xl shadow-blue-500/30 backdrop-blur-xl">
                      <div className="bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-lg border border-cyan-400/30">
                        <div className="flex items-center justify-center space-x-3">
                          <Shield className="w-6 h-6 text-cyan-400 animate-pulse" />
                          <h2 className="text-base sm:text-lg lg:text-xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-wider uppercase animate-gradient">
                            CYBER SECURITY ENTHUSIAST
                          </h2>
                          <Lock className="w-6 h-6 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Side - Text Content */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-slide-left order-2 lg:order-1 text-center lg:text-left pointer-events-auto">
                <div className="flex space-x-3 sm:space-x-4 mb-4 sm:mb-6 justify-center lg:justify-start pointer-events-auto">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer pointer-events-auto"
                    onMouseMove={(e) => handleIconHover('icon4', e)}
                    onMouseLeave={() => handleIconLeave('icon4')}
                    style={{
                      transform: `translate(${iconPositions.icon4.x}px, ${iconPositions.icon4.y}px)`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  >
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-400 animate-float pointer-events-none" />
                  </div>
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer pointer-events-auto"
                    onMouseMove={(e) => handleIconHover('icon5', e)}
                    onMouseLeave={() => handleIconLeave('icon5')}
                    style={{
                      transform: `translate(${iconPositions.icon5.x}px, ${iconPositions.icon5.y}px)`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  >
                    <Terminal className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-400 animate-float pointer-events-none" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer pointer-events-auto"
                    onMouseMove={(e) => handleIconHover('icon6', e)}
                    onMouseLeave={() => handleIconLeave('icon6')}
                    style={{
                      transform: `translate(${iconPositions.icon6.x}px, ${iconPositions.icon6.y}px)`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  >
                    <Lock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-400 animate-float pointer-events-none" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tilted-text group cursor-pointer leading-tight pointer-events-auto">
                  <span className="inline-block transition-all duration-300 hover:text-cyan-400 hover:scale-110 hover:rotate-2">SOMESH</span>{' '}
                  <span className="inline-block transition-all duration-300 hover:text-blue-400 hover:scale-110 hover:-rotate-2">RANJAN</span>{' '}
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 hover:scale-110 hover:rotate-3 hover:from-cyan-300 hover:to-blue-400">
                    BISWAL
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-0 pointer-events-auto tagline-text">
                  Defending digital infrastructures, one threat at a time
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-12 justify-center lg:justify-start px-2 sm:px-0 pointer-events-auto">
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 bg-blue-600/20 border border-blue-500/50 rounded-full text-cyan-400 text-xs sm:text-sm lg:text-base font-medium backdrop-blur-sm hover:bg-blue-600/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                    Blue Team
                  </span>
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 bg-blue-600/20 border border-blue-500/50 rounded-full text-cyan-400 text-xs sm:text-sm lg:text-base font-medium backdrop-blur-sm hover:bg-blue-600/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                    Security Analyst
                  </span>
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 bg-blue-600/20 border border-blue-500/50 rounded-full text-cyan-400 text-xs sm:text-sm lg:text-base font-medium backdrop-blur-sm hover:bg-blue-600/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                    Threat Hunter
                  </span>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto lg:mx-0 text-left font-mono hover:border-cyan-400/50 transition-all duration-300 pointer-events-auto">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <div className="flex space-x-1 sm:space-x-1.5">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-gray-400 text-xs sm:text-sm">sanu@kali:~</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm lg:text-base">
                    <div className="text-cyan-400">$ whoami</div>
                    <div className="text-white">{terminalText}<span className="animate-pulse">_</span></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0 justify-center lg:justify-start pointer-events-auto">
                  <button
                    onClick={() => navigate('/projects')}
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
                  >
                    View Projects
                  </button>
                  <a
                    href="#contact"
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-lg text-sm sm:text-base font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all transform hover:scale-105"
                  >
                    Contact Me
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

          .tagline-text {
            font-family: 'Space Grotesk', 'Orbitron', sans-serif;
            font-weight: 500;
            letter-spacing: 0.05em;
            line-height: 1.6;
          }

          @keyframes animate-gradient {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: animate-gradient 3s ease infinite;
          }

          .spotlight-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            transition: background 0.15s ease-out;
          }

          .custom-cursor {
            cursor: none;
          }

          .custom-cursor * {
            cursor: none !important;
          }

          .custom-cursor-dot {
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(34, 211, 238, 0.8) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            transition: transform 0.1s ease;
          }

          .spark-effect {
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
          }

          .spark-ring {
            position: absolute;
            width: 0;
            height: 0;
            border: 2px solid rgba(34, 211, 238, 0.8);
            border-radius: 50%;
            animation: sparkExpand 1.2s ease-out forwards;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }

          @keyframes sparkExpand {
            0% {
              width: 0;
              height: 0;
              opacity: 1;
              border-width: 3px;
            }
            50% {
              opacity: 0.6;
              border-width: 2px;
            }
            100% {
              width: 100px;
              height: 100px;
              opacity: 0;
              border-width: 1px;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
            }
            50% {
              box-shadow: 0 0 40px rgba(34, 211, 238, 0.8);
            }
          }

          .icon-float {
            transition: transform 0.3s ease-out;
          }
        `}</style>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-to-top ${showScrollTop ? 'show' : ''}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <style>{`
        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          border: 2px solid rgba(34, 211, 238, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(100px) scale(0.8);
          box-shadow: 0 10px 30px rgba(34, 211, 238, 0.3);
          color: white;
          margin-right: 2px;
        }

        .scroll-to-top.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .scroll-to-top:hover {
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 15px 40px rgba(34, 211, 238, 0.5);
          background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
          border-color: rgba(34, 211, 238, 0.8);
        }

        .scroll-to-top:active {
          transform: translateY(-2px) scale(1.05);
        }

        /* Pulse animation */
        .scroll-to-top::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          border: 2px solid rgba(34, 211, 238, 0.6);
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .scroll-to-top {
            width: 48px;
            height: 48px;
            bottom: 20px;
            right: 20px;
          }

          .scroll-to-top svg {
            width: 20px;
            height: 20px;
            ;
          }
        }
      `}</style>
    </>
  );
}
