'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {
    FiHome, FiBook, FiFileText, FiMessageSquare, FiCalendar,
    FiBarChart2, FiSettings, FiLogOut
} from 'react-icons/fi';

const MobileSidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();
    const router = useRouter();

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
        { name: 'Home', href: '/pages/dashboard', icon: FiHome },
        { name: 'Courses', href: '/pages/courses', icon: FiBook },
        { name: 'Notes', href: '/pages/notes', icon: FiFileText },
        { name: 'Tutor', href: '/pages/tutor', icon: FiMessageSquare },
        { name: 'Schedule', href: '/pages/schedule', icon: FiCalendar },
        { name: 'Progress', href: '/pages/progress', icon: FiBarChart2 },
        { name: 'Settings', href: '/pages/settings', icon: FiSettings },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
            <div className="flex justify-between px-2 py-2">
                {navItems.slice(0, 4).map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex flex-col items-center flex-1 text-xs"
                    >
                        <item.icon
                            className={`h-5 w-5 mb-1 ${pathname === item.href
                                ? 'text-indigo-600'
                                : 'text-gray-400'
                                }`}
                        />
                        <span className={pathname === item.href ? 'text-indigo-600' : 'text-gray-500'}>
                            {item.name}
                        </span>
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center flex-1 text-xs text-gray-500"
                >
                    <FiLogOut className="h-5 w-5 mb-1 text-gray-400" />
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default MobileSidebar;
