import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/app/components/Sidebar';
import Navbar from '@/app/components/Navbar';
import { AuthProvider } from '@/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Settings | Memora AI',
    description: 'Your AI-powered study assistant settings',
};

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='bg-white transition duration-300 ease-in-out'>
            <AuthProvider>
                <div className="flex h-screen overflow-hidden">

                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main content */}
                    <div className="flex-1 overflow-auto">
                        {/* Navbar */}
                        <Navbar />

                        {/* Page content */}
                        <main className="p-6 max-w-6xl mx-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </AuthProvider>
        </div>
    );
}