import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Bell, Settings, Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Notification } from '../types/payment';
import { getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../utils/paymentApi';
import { getCurrentUser, isUserAdmin } from '../utils/userSync';
import NotificationPopup from './NotificationPopup';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Check if user is admin and fetch notifications
  useEffect(() => {
    async function checkAdmin() {
      if (user?.id) {
        const adminStatus = await isUserAdmin(user.id);
        setIsAdmin(adminStatus);

        // Fetch notifications
        const currentUser = await getCurrentUser(user.id);
        if (currentUser) {
          setCurrentUserId(currentUser.id);
          const userNotifications = await getUserNotifications(currentUser.id);
          setNotifications(userNotifications);
          const unreadCount = userNotifications.filter((n) => !n.is_read).length;
          setNotificationCount(unreadCount);
        }
      }
    }
    checkAdmin();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(checkAdmin, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleProjectsClick = () => {
    navigate('/projects');
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', action: () => scrollToSection('home') },
    { label: 'About', action: () => scrollToSection('about') },
    { label: 'Projects', action: handleProjectsClick },
    { label: 'Services', action: () => scrollToSection('services') },
    { label: 'Contact', action: () => scrollToSection('contact') }
  ];

  const handlePaymentClick = () => {
    navigate('/payments');
    setIsMenuOpen(false);
  };

  const handleTransactionsClick = () => {
    navigate('/transactions');
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setIsMenuOpen(false);
  };

  // Determine redirect URL based on current page
  const getRedirectUrl = () => {
    return location.pathname === '/projects' ? '/projects' : '/';
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setNotificationCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUserId) return;
    try {
      await markAllNotificationsAsRead(currentUserId);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setNotificationCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-transparent backdrop-blur-lg border-b border-white/10">
      <NotificationPopup
        notifications={notifications}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={() => setIsMenuOpen(false)}>
            <img
              src="/bgrmsanu.png"
              alt="Somesh Ranjan Biswal"
              className="w-32 h-24 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          </Link>

          {/* Navigation Items - Center */}
          <div className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons - Right Side */}
          <div className="hidden md:flex items-center space-x-4 mr-8">
            <SignedIn>
              {/* Notification Bell */}
              <button
                onClick={handleNotificationClick}
                className="relative p-2 text-gray-300 hover:text-cyan-400 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Admin Panel Button */}
              {isAdmin && (
                <button
                  onClick={handleAdminClick}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Admin Panel
                </button>
              )}

              {/* Make/Verify Payment Button */}
              <button
                onClick={handlePaymentClick}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                <Wallet className="w-4 h-4" />
                <span>Payments</span>
              </button>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10 ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent'
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" redirectUrl={getRedirectUrl()}>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4 ">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9 ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent'
                  }
                }}
              />
            </SignedIn>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Settings
                  className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                    }`}
                />
                <X
                  className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 space-y-2 border-t border-white/10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-all rounded-lg"
              >
                {item.label}
              </button>
            ))}
            <SignedIn>
              {isAdmin && (
                <button
                  onClick={handleAdminClick}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={handlePaymentClick}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                <Wallet className="w-4 h-4" />
                <span>Payments</span>
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" redirectUrl={getRedirectUrl()}>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>
    </header>
  );
}
