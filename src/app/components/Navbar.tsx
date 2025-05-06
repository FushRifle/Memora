"use client";
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { user, logout } = useAuth();
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

    return (
        <div className="border-b border-gray-200 bg-white shadow-sm">
            {/* Toast Container */}
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
                    <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 relative cursor-pointer">
                        <FiBell className="h-6 w-6" />
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="relative ml-3 group">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
                                    <FiUser className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                                    {user ? user.full_name : 'Guest'}
                                </div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                                    {user ? user.role : 'Visitor'}
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