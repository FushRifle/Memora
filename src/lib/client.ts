import { createClient } from '@supabase/supabase-js';

// Define types for your database schema
type Database = {
    public: {
        Tables: {
            notes: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    content: string;
                    course: string;
                    type: 'lecture' | 'handwritten' | 'book' | 'other';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    content: string;
                    course: string;
                    type: 'lecture' | 'handwritten' | 'book' | 'other';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    content?: string;
                    course?: string;
                    type?: 'lecture' | 'handwritten' | 'book' | 'other';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            courses: {
                Row: {
                    id: string;
                    name: string;
                    user_id: string;
                    // Add other course fields
                };
            };
        };
        Views: {
            // Define views if needed
        };
        Functions: {
            // Define functions if needed
        };
    };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Supabase URL and Anon Key must be provided in environment variables'
    );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
    realtime: {
        heartbeatIntervalMs: 10000,
    },
});

// Auth Helper Functions
export const getCurrentUser = async () => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        console.error('Error getting current user:', error.message);
        return null;
    }

    return user;
};

export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login error:', error.message);
        throw error;
    }

    return data;
};

export const signUpWithEmail = async (
    email: string,
    password: string,
    userMetadata: Record<string, any> = {}
) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: userMetadata,
        },
    });

    if (error) {
        console.error('Signup error:', error.message);
        throw error;
    }

    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Logout error:', error.message);
        throw error;
    }
};

// Data Operations
export interface ScheduleItem {
    id: string;
    title: string;
    type: string;
    start_time: string;
    end_time: string;
}

export const getUpcomingSchedule = async (userId: string): Promise<ScheduleItem[]> => {
    const { data, error } = await supabase
        .from('schedule_items')
        .select('id, title, type, start_time, end_time')
        .eq('user_id', userId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

    if (error) {
        console.error('Error fetching schedule:', error);
        return [];
    }

    return data;
};

export const fetchNotes = async (userId: string) => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching notes:', error.message);
        throw error;
    }

    return data;
};

export const fetchNoteById = async (noteId: string) => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single();

    if (error) {
        console.error('Error fetching note:', error.message);
        throw error;
    }

    return data;
};

export const createNote = async (noteData: Database['public']['Tables']['notes']['Insert']) => {
    const { data, error } = await supabase
        .from('notes')
        .insert(noteData)
        .select()
        .single();

    if (error) {
        console.error('Error creating note:', error.message);
        throw error;
    }

    return data;
};

export const updateNote = async (
    noteId: string,
    updates: Database['public']['Tables']['notes']['Update']
) => {
    const { data, error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', noteId)
        .select()
        .single();

    if (error) {
        console.error('Error updating note:', error.message);
        throw error;
    }

    return data;
};

export const deleteNote = async (noteId: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);

    if (error) {
        console.error('Error deleting note:', error.message);
        throw error;
    }
};

// Realtime Subscriptions
export const subscribeToNotes = (
    userId: string,
    callback: (payload: any) => void
) => {
    const subscription = supabase
        .channel('notes-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'notes',
                filter: `user_id=eq.${userId}`,
            },
            callback
        )
        .subscribe();

    return () => {
        supabase.removeChannel(subscription);
    };
};

// Storage Functions
export const uploadFile = async (
    bucket: string,
    path: string,
    file: File,
    options = {}
) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, options);

    if (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }

    return data;
};

export const getFileUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
        console.error('Error deleting file:', error.message);
        throw error;
    }
};

export { createClient };
