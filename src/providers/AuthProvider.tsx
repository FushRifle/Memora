'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<{
        user: (User & Profile) | null;
        session: Session | null;
        isLoading: boolean;
    }>({
        user: null,
        session: null,
        isLoading: true,
    });

    const fetchUserProfile = useCallback(async (userId: string) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return profile;
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            return null;
        }
    }, []);

    const handleAuthChange = useCallback(async (event: string, session: Session | null) => {
        if (session) {
            const profile = await fetchUserProfile(session.user.id);
            setState({
                user: { ...session.user, ...profile },
                session,
                isLoading: false,
            });
        } else {
            setState({
                user: null,
                session: null,
                isLoading: false,
            });
            router.refresh();
        }
    }, [fetchUserProfile, router]);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => handleAuthChange(event, session));

        // Initialize auth state
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                handleAuthChange('SIGNED_IN', session);
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        });

        return () => subscription.unsubscribe();
    }, [handleAuthChange]);

    const refreshSession = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) {
            console.error('Failed to refresh session:', error);
            setState(prev => ({ ...prev, isLoading: false }));
            return;
        }
        await handleAuthChange('SIGNED_IN', session);
    }, [handleAuthChange]);

    const updateProfile = useCallback(async (updates: Partial<Profile>) => {
        if (!state.user?.id) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', state.user.id);

            if (error) throw error;

            // Refresh user data
            const profile = await fetchUserProfile(state.user.id);
            setState(prev => ({
                ...prev,
                user: prev.user ? { ...prev.user, ...profile } : null,
            }));
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }, [state.user?.id, fetchUserProfile]);

    const getCourseProgress = useCallback(async (courseId: string) => {
        if (!state.user?.id) return 0;

        try {
            const { data, error } = await supabase
                .from('courses')
                .select('completed_hours, target_hours')
                .eq('id', courseId)
                .eq('user_id', state.user.id)
                .single();

            if (error || !data) return 0;

            return Math.round(
                (Number(data.completed_hours) / (Number(data.target_hours) || 1)) * 100
            );
        } catch (error) {
            console.error('Failed to fetch course progress:', error);
            return 0;
        }
    }, [state.user?.id]);

    const value = {
        user: state.user,
        session: state.session,
        isLoading: state.isLoading,
        refreshSession,
        updateProfile,
        getCourseProgress,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};