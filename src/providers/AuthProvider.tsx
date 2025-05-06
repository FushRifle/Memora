'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/client';
import type { Session, User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<(User & Profile) | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = useCallback(async (userId: string) => {
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
        if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            setUser({ ...session.user, ...profile });
            setSession(session);
        } else {
            setUser(null);
            setSession(null);
        }
        setIsLoading(false);
    }, [fetchUserProfile]);

    const handleAuthChange = useCallback(
        async (_event: string, session: Session | null) => {
            await setUserSession(session);
        },
        [setUserSession]
    );

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(handleAuthChange);

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [handleAuthChange, setUserSession]);

    const refreshSession = useCallback(async () => {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) {
            console.error('Failed to refresh session:', error);
            setIsLoading(false);
            return;
        }
        await setUserSession(session);
    }, [setUserSession]);

    const updateProfile = useCallback(async (updates: Partial<Profile>) => {
        if (!user?.id) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', user.id);

            if (error) throw error;

            const profile = await fetchUserProfile(user.id);
            setUser(prev => (prev ? { ...prev, ...profile } : null));
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }, [user?.id, fetchUserProfile]);

    const getCourseProgress = useCallback(async (courseId: string) => {
        if (!user?.id) return 0;
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('completed_hours, target_hours')
                .eq('id', courseId)
                .eq('user_id', user.id)
                .single();

            if (error || !data) return 0;

            return Math.round(
                (Number(data.completed_hours) / (Number(data.target_hours) || 1)) * 100
            );
        } catch (error) {
            console.error('Failed to fetch course progress:', error);
            return 0;
        }
    }, [user?.id]);

    const logout = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout failed:', error);
            return;
        }
        setUser(null);
        setSession(null);
        router.refresh();
    }, [router]);

    const value = useMemo(
        () => ({
            user,
            session,
            isLoading,
            refreshSession,
            updateProfile,
            getCourseProgress,
            logout,
        }),
        [user, session, isLoading, refreshSession, updateProfile, getCourseProgress, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
