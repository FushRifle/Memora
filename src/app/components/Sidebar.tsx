"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from 'next/router';

import {
    FiHome, FiBook, FiFileText, FiMessageSquare, FiCalendar,
    FiBarChart2, FiSettings, FiLogOut, FiChevronLeft, FiBookOpen,
    FiChevronRight, FiMenu, FiX, FiStar
} from 'react-icons/fi';

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setMobileOpen(false);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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

    const navItems = [
        { name: 'Dashboard', href: '/pages/dashboard', icon: FiHome },
        { name: 'Courses', href: '/pages/courses', icon: FiBook },
        { name: 'Notes', href: '/pages/notes', icon: FiFileText },
        { name: 'AI Tutor', href: '/pages/tutor', icon: FiMessageSquare },
        { name: 'Quiz', href: '/pages/quiz', icon: FiBookOpen },
        { name: 'Schedule', href: '/pages/schedule', icon: FiCalendar },
        { name: 'Progress', href: '/pages/progress', icon: FiBarChart2 },
        { name: 'Settings', href: '/pages/settings', icon: FiSettings },
    ];

    const toggleSidebar = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md text-gray-500"
            >
                <FiMenu size={24} />
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:relative z-50 h-full transition-all duration-300 bg-white border-r border-gray-200
          ${mobileOpen ? 'left-0 w-64' : '-left-full w-0 md:left-0'} 
          ${isMobile ? '' : collapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between h-22 px-4 border-b border-gray-200">
                        {(!collapsed || isMobile) && (
                            <div className="flex items-center mt-4">
                                <img src="/memora.png" alt="Logo" className="h-auto w-auto" />
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                            {isMobile ? (
                                <FiX size={20} />
                            ) : collapsed ? (
                                <FiChevronRight size={20} />
                            ) : (
                                <FiChevronLeft size={20} />
                            )}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex flex-col flex-grow overflow-y-auto">
                        <nav className="flex-1 px-3 py-6 space-y-2">
                            {/* Navigation Links */}
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center rounded-lg group transition-all 
                    ${collapsed && !isMobile ? 'px-3 py-4 justify-center' : 'px-4 py-3'} 
                    ${pathname === item.href
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon
                                        className={`flex-shrink-0 ${pathname === item.href
                                            ? 'text-indigo-500'
                                            : 'text-gray-500 group-hover:text-gray-700'
                                            } ${collapsed && !isMobile ? 'text-xl' : 'text-lg mr-4'}`}
                                    />
                                    {(!collapsed || isMobile) && (
                                        <span className="text-base font-medium whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    )}
                                    {collapsed && !isMobile && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center w-full rounded-lg hover:bg-gray-50 hover:text-gray-900 cursor-pointer transition-all ${collapsed && !isMobile ? 'px-3 py-3 justify-center' : 'px-4 py-3'
                                }`}
                        >
                            <FiLogOut
                                className={`${collapsed && !isMobile ? 'text-xl' : 'text-lg mr-4'} text-gray-500 hover:text-gray-700`}
                            />
                            {(!collapsed || isMobile) && (
                                <span className="text-base font-medium">Sign out</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;