"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from 'next/router';

import {
    FiHome, FiBook, FiFileText, FiMessageSquare, FiCalendar,
    FiBarChart2, FiSettings, FiLogOut
} from 'react-icons/fi';

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();


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
        { name: 'Schedule', href: '/pages/schedule', icon: FiCalendar },
        { name: 'Progress', href: '/pages/progress', icon: FiBarChart2 },
        { name: 'Settings', href: '/pages/settings', icon: FiSettings },
    ];

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
                <div className="flex items-center h-22 px-4 border-b border-gray-200">
                    <div className="flex items-center mt-4">
                        <img src="/memora.png" alt="Logo" className="h-auto w-auto" />
                    </div>
                </div>

                <div className="flex flex-col flex-grow overflow-y-auto mt-5">
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${pathname === item.href
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon
                                    className={`flex-shrink-0 h-5 w-5 mr-3 ${pathname === item.href
                                        ? 'text-indigo-500'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-left text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 cursor-pointer">
                        <FiLogOut className="flex-shrink-0 h-5 w-5 mr-3 text-gray-400" />
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;