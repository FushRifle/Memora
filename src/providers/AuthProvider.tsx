'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/client';
import type { Session, User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
    updated_at?: string;
}

interface AuthContextType {
    user: (User & Profile) | null;
    session: Session | null;
    isLoading: boolean;
    refreshSession: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<void>;
    getCourseProgress: (courseId: string) => Promise<number>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session management constants
const SESSION_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;    // 5 minutes
const SESSION_EXPIRY_BUFFER = 5 * 60 * 1000;     // 5 minutes buffer for refresh

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<(User & Profile) | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
    const sessionCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

    const fetchUserProfile = useCallback(async (userId: string): Promise<Profile | null> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            return null;
        }
    }, []);

    const setUserSession = useCallback(async (session: Session | null) => {
        setIsLoading(true);
        try {
            if (session?.user) {
                const profile = await fetchUserProfile(session.user.id);
                setUser({ ...session.user, ...profile });
                setSession(session);
            } else {
                setUser(null);
                setSession(null);
            }
        } catch (error) {
            console.error('Error setting user session:', error);
            setUser(null);
            setSession(null);
        } finally {
            setIsLoading(false);
        }
    }, [fetchUserProfile]);

    const handleAuthChange = useCallback(
        async (event: string, session: Session | null) => {
            if (event === 'SIGNED_OUT') {
                await setUserSession(null);
                router.refresh();
            } else if (session) {
                await setUserSession(session);
            }
        },
        [setUserSession, router]
    );

    const checkSessionValidity = useCallback(async () => {
        if (!session) return;

        try {
            const { data: { session: currentSession }, error } = await supabase.auth.getSession();

            if (error || !currentSession) {
                console.error('Session invalid:', error);
                await logout();
                return false;
            }

            if (typeof currentSession.expires_at === 'undefined') {
                console.error('Session expiry time is undefined');
                await logout();
                return false;
            }
            const expiresAt = new Date(currentSession.expires_at * 1000);
            const timeLeft = expiresAt.getTime() - Date.now();

            if (timeLeft < SESSION_EXPIRY_BUFFER) {
                await refreshSession();
            }
            return true;
        } catch (error) {
            console.error('Session check error:', error);
            return false;
        }
    }, [session]);

    const refreshSession = useCallback(async () => {
        if (!session) return;

        setIsLoading(true);
        try {
            const { data: { session: newSession }, error } = await supabase.auth.refreshSession();

            if (error || !newSession) {
                console.error('Session refresh failed:', error);
                await logout();
                return;
            }

            await setUserSession(newSession);
        } catch (error) {
            console.error('Refresh session error:', error);
            await logout();
        } finally {
            setIsLoading(false);
        }
    }, [session, setUserSession]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            setSession(null);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const updateProfile = useCallback(async (updates: Partial<Profile>) => {
        if (!user?.id) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            const profile = await fetchUserProfile(user.id);
            setUser(prev => (prev ? { ...prev, ...profile } : null));
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    }, [user?.id, fetchUserProfile]);

    const getCourseProgress = useCallback(async (courseId: string) => {
        if (!user?.id) return 0;

        try {
            const { data, error } = await supabase
                .from('courses')
                .select('completed_hours, target_hours')
                .eq('course_id', courseId)
                .eq('user_id', user.id)
                .single();

            if (error || !data) return 0;

            return Math.round(
                (Number(data.completed_hours) / (Number(data.target_hours) || 1)) * 100
            );
        } catch (error) {
            console.error('Course progress fetch failed:', error);
            return 0;
        }
    }, [user?.id]);

    // Initialize auth and set up listeners
    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            if (mounted) {
                await setUserSession(initialSession);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

        // Set up periodic session maintenance
        refreshTimerRef.current = setInterval(refreshSession, SESSION_REFRESH_INTERVAL);
        sessionCheckTimerRef.current = setInterval(checkSessionValidity, SESSION_CHECK_INTERVAL);

        initializeAuth();

        return () => {
            mounted = false;
            subscription.unsubscribe();
            if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
            if (sessionCheckTimerRef.current) clearInterval(sessionCheckTimerRef.current);
        };
    }, [handleAuthChange, refreshSession, checkSessionValidity, setUserSession]);

    const value = useMemo(() => ({
        user,
        session,
        isLoading,
        refreshSession,
        updateProfile,
        getCourseProgress,
        logout,
    }), [
        user,
        session,
        isLoading,
        refreshSession,
        updateProfile,
        getCourseProgress,
        logout,
    ]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};