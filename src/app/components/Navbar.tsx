"use client";
import { useState, useRef, useEffect } from 'react';
import {
    FiSearch, FiBell, FiUser, FiMessageSquare, FiAlertCircle,
    FiSun, FiMoon, FiChevronDown, FiChevronRight, FiSettings,
    FiLogOut, FiStar, FiHome, FiBook, FiFileText
} from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

type Notification = {
    id: string;
    type: 'message' | 'alert' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
};

type NavItem = {
    name: string;
    href?: string;
    icon?: React.ReactNode;
    children?: NavItem[];
};

const Navbar = () => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const { user, logout } = useAuth();
    const router = useRouter();
    const notificationsRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Toggle dark mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

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

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
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

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(openSubmenu === name ? null : name);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Nested navigation items
    const navItems: NavItem[] = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: <FiHome className="mr-3" />
        },
        {
            name: 'Courses',
            href: '/courses',
            icon: <FiBook className="mr-3" />,
            children: [
                { name: 'My Courses', href: '/courses/my' },
                { name: 'Browse All', href: '/courses/all' },
                { name: 'Completed', href: '/courses/completed' }
            ]
        },
        {
            name: 'Resources',
            icon: <FiFileText className="mr-3" />,
            children: [
                { name: 'Notes', href: '/resources/notes' },
                { name: 'Documents', href: '/resources/documents' },
                { name: 'Templates', href: '/resources/templates' }
            ]
        },
        {
            name: 'AI Tutor',
            href: '/tutor',
            icon: <FiMessageSquare className="mr-3" />
        }
    ];

    if (!user) return null;

    return (
        <>
            <div className="border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
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
                    theme={darkMode ? "dark" : "light"}
                />

                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className={`h-5 w-5 transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-400'}`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses, documents..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-gray-400 dark:hover:border-gray-500 dark:text-white"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-1 cursor-pointer rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                        </button>

                        {/* Premium Button */}
                        <button
                            onClick={() => router.push('/premium')}
                            className="hidden lg:flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-medium hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 
                            cursor-pointer"
                        >
                            <FiStar className="mr-1" />
                            Upgrade
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-1 cursor-pointer rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 relative"
                            >
                                <FiBell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => markAsRead(notification.id)}
                                                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
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
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {notification.title}
                                                                {!notification.read && (
                                                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                                                {notification.message}
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-400">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-6 text-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-300">No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative group">
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <div className="flex-shrink-0">
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt="User avatar"
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors duration-200">
                                            <FiUser className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="hidden lg:block">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                        {user.full_name || user.email}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                                        {user.role || 'Member'}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 border border-gray-200 dark:border-gray-700">
                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Your Profile
                                </a>
                                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Settings
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className="md:hidden flex items-center justify-between h-16 px-4">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex items-center space-x-4">
                        {/* Mobile Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 relative"
                            >
                                <FiBell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                                )}
                            </button>
                        </div>

                        {/* Mobile User Profile */}
                        <div className="flex-shrink-0">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="User avatar"
                                    className="h-8 w-8 rounded-full object-cover"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                />
                            ) : (
                                <div
                                    className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-800 cursor-pointer"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    <FiUser className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-800 mt-16 overflow-y-auto"
                >
                    <div className="px-4 py-6">
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className={`h-5 w-5 transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-400'}`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses, documents..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-gray-400 dark:hover:border-gray-500 dark:text-white"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </div>

                        {/* Navigation Items */}
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <div key={item.name}>
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.icon}
                                            <span className="ml-3">{item.name}</span>
                                        </Link>
                                    ) : (
                                        <div>
                                            <button
                                                onClick={() => toggleSubmenu(item.name)}
                                                className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <div className="flex items-center">
                                                    {item.icon}
                                                    <span className="ml-3">{item.name}</span>
                                                </div>
                                                {openSubmenu === item.name ? (
                                                    <FiChevronDown className="h-5 w-5" />
                                                ) : (
                                                    <FiChevronRight className="h-5 w-5" />
                                                )}
                                            </button>
                                            {openSubmenu === item.name && item.children && (
                                                <div className="ml-6 mt-1 space-y-1">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href || '#'}
                                                            className="block px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Premium Button */}
                        <button
                            onClick={() => {
                                router.push('/premium');
                                setMobileMenuOpen(false);
                            }}
                            className="w-full mt-6 flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-medium hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <FiStar className="mr-2" />
                            Upgrade to Premium
                        </button>

                        {/* User Menu */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center px-3">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt="User avatar"
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                        <FiUser className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                                    </div>
                                )}
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {user.full_name || user.email}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.role || 'Member'}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-1">
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Your Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="mt-6 flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Dark Mode
                            </span>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${darkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;