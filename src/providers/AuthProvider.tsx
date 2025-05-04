'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'student' | 'educator';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mock function to simulate API call delay
    const mockApiCall = async <T,>(data: T, success = true, delay = 1000): Promise<T> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (success) {
                    resolve(data);
                } else {
                    reject(new Error('Mock API error'));
                }
            }, delay);
        });
    };

    // Check for existing session on initial load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // In a real app, you would check for an existing session/token
                const storedUser = localStorage.getItem('memora-user');

                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    // Mock validation
                    await mockApiCall(userData);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Session initialization failed:', error);
                localStorage.removeItem('memora-user');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Mock login - in a real app, this would call your authentication API
            if (email === 'demo@memora.ai' && password === 'demo123') {
                const mockUser: User = {
                    id: 'user-123',
                    name: 'Demo User',
                    email: 'demo@memora.ai',
                    role: 'student'
                };

                await mockApiCall(mockUser);
                setUser(mockUser);
                localStorage.setItem('memora-user', JSON.stringify(mockUser));
                router.push('/dashboard');
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            // Mock registration
            const mockUser: User = {
                id: `user-${Math.random().toString(36).substring(2, 9)}`,
                name,
                email,
                role: 'student'
            };

            await mockApiCall(mockUser);
            setUser(mockUser);
            localStorage.setItem('memora-user', JSON.stringify(mockUser));
            router.push('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Mock logout
            await mockApiCall({ success: true });
            setUser(null);
            localStorage.removeItem('memora-user');
            router.push('/auth/signin');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const refreshSession = async () => {
        if (!user) return;

        try {
            // Mock session refresh
            await mockApiCall(user);
            // In a real app, you would validate/refresh the token here
        } catch (error) {
            console.error('Session refresh failed:', error);
            await logout();
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshSession
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};