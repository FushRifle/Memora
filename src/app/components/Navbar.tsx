import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

const Navbar = () => {
    return (
        <div className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between h-16 px-4">

                {/* Search Bar */}
                <div className="flex-1 max-w-md justify-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <FiBell className="h-6 w-6" />
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="relative ml-3">
                        <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <FiUser className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="text-sm font-medium text-gray-700">Alex Johnson</div>
                                <div className="text-xs text-gray-500">Student</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;