import { create } from 'zustand';
import { supabase } from '@/lib/client';
import { Quiz } from '@/types/page';

interface QuizStore {
    quizzes: Quiz[];
    loading: boolean;
    error: string | null;
    fetchQuizzes: (userId: string) => Promise<void>;
    addQuiz: (quiz: Omit<Quiz, 'id' | 'created_at'>, userId: string) => Promise<Quiz | null>;
    getQuizById: (id: string) => Promise<Quiz | null>;
}

export const useQuizStore = create<QuizStore>((set) => ({
    quizzes: [],
    loading: false,
    error: null,

    fetchQuizzes: async (userId) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ quizzes: data || [] });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to fetch quizzes' });
        } finally {
            set({ loading: false });
        }
    },

    addQuiz: async (quiz, userId) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .insert([{ ...quiz, user_id: userId }])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({ quizzes: [data, ...state.quizzes] }));
            return data;
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to save quiz' });
            return null;
        } finally {
            set({ loading: false });
        }
    },

    getQuizById: async (id) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to fetch quiz' });
            return null;
        } finally {
            set({ loading: false });
        }
    },
}));