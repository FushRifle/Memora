"use client";
import { FiSearch, FiBell, FiUser, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Notification = {
    id: string;
    type: 'message' | 'alert' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
};

const Navbar = () => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user, logout } = useAuth();
    const router = useRouter();
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Load dummy notifications
    useEffect(() => {
        setNotifications([
            {
                id: '1',
                type: 'message',
                title: 'New message',
                message: 'You have a new message from John Doe',
                time: '2 mins ago',
                read: false
            },
            {
                id: '2',
                type: 'alert',
                title: 'Document approved',
                message: 'Your document "Project Proposal" has been approved',
                time: '1 hour ago',
                read: true
            },
            {
                id: '3',
                type: 'system',
                title: 'System update',
                message: 'New features available in your dashboard',
                time: '3 days ago',
                read: true
            }
        ]);
    }, []);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/auth/Signin');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to logout');
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!user) return null;

    return (
        <div className="border-b border-gray-200 bg-white shadow-sm">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className={`h-5 w-5 transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search courses, documents..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-gray-400"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationsRef}>
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 relative"
                        >
                            <FiBell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                                <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() => markAsRead(notification.id)}
                                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-indigo-50' : ''}`}
                                            >
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {notification.type === 'message' && (
                                                            <FiMessageSquare className="h-5 w-5 text-blue-500" />
                                                        )}
                                                        {notification.type === 'alert' && (
                                                            <FiAlertCircle className="h-5 w-5 text-yellow-500" />
                                                        )}
                                                        {notification.type === 'system' && (
                                                            <FiAlertCircle className="h-5 w-5 text-indigo-500" />
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {notification.title}
                                                            {!notification.read && (
                                                                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {notification.message}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center">
                                            <p className="text-sm text-gray-500">No notifications</p>
                                        </div>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
                                        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                                            Mark all as read
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative group">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
                                    <FiUser className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                                    {user.full_name}
                                </div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                                    {user.role}
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                                Your Profile
                            </a>
                            <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                                Settings
                            </a>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;