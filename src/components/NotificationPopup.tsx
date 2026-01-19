import { AlertCircle, Bell, CheckCircle, Clock, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Notification } from '../types/payment';

interface NotificationPopupProps {
    notifications: Notification[];
    isOpen: boolean;
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

export default function NotificationPopup({
    notifications,
    isOpen,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead,
}: NotificationPopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const unreadNotifications = notifications.filter((n) => !n.is_read);
    const readNotifications = notifications.filter((n) => n.is_read);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            case 'payment_pending':
                return <Clock className="w-5 h-5 text-orange-400" />;
            case 'payment_approved':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            default:
                return <Bell className="w-5 h-5 text-blue-400" />;
        }
    };

    const getNotificationBg = (type: string) => {
        switch (type) {
            case 'success':
            case 'payment_approved':
                return 'bg-green-500/10 border-green-500/30';
            case 'warning':
                return 'bg-yellow-500/10 border-yellow-500/30';
            case 'error':
                return 'bg-red-500/10 border-red-500/30';
            case 'payment_pending':
                return 'bg-orange-500/10 border-orange-500/30';
            default:
                return 'bg-blue-500/10 border-blue-500/30';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 px-4">
            <div
                ref={popupRef}
                className="bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                        {unreadNotifications.length > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                {unreadNotifications.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mark All as Read Button */}
                {unreadNotifications.length > 0 && (
                    <div className="px-4 py-2 border-b border-white/10">
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Mark all as read
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {/* Unread Notifications */}
                            {unreadNotifications.length > 0 && (
                                <>
                                    <div className="px-4 py-2 bg-cyan-500/5">
                                        <p className="text-xs font-semibold text-cyan-400 uppercase">
                                            Unread
                                        </p>
                                    </div>
                                    {unreadNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${getNotificationBg(
                                                notification.type
                                            )} border-l-4`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-white mb-1">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-400 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(
                                                                notification.created_at
                                                            ).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                        <button
                                                            onClick={() => onMarkAsRead(notification.id)}
                                                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Read Notifications */}
                            {readNotifications.length > 0 && (
                                <>
                                    <div className="px-4 py-2 bg-gray-800/30">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">
                                            Read
                                        </p>
                                    </div>
                                    {readNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-4 opacity-60 hover:opacity-80 transition-opacity"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-white mb-1">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-400 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(
                                                            notification.created_at
                                                        ).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
