"use client";
import { useState, useEffect } from 'react';
import { use } from 'react'; // Import the use hook
import { supabase } from '@/lib/client';
import NoteDetail from '@/app/components/notes/NoteDetail';
import LoadingSpinner from '@/app/components/notes/LoadingSpinner';

interface Note {
    id: string;
    user_id: string;
    content: string;
    processed_at: string | null;
    status: string;
    course_id: string;
    created_at?: string;
    title?: string;
    type?: string;
    course?: Course;
}

interface Course {
    id: string;
    title: string;
    color?: string;
}

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const unwrappedParams = use(params); // Unwrap the params promise

    useEffect(() => {
        const verifyNoteExists = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('notes')
                    .select('id')
                    .eq('id', unwrappedParams.id) // Use the unwrapped params
                    .single();

                if (error) throw error;
                if (!data) throw new Error('Note not found');
            } catch (err) {
                console.error('Error verifying note:', err);
                setError(err instanceof Error ? err.message : 'Failed to load note');
            } finally {
                setLoading(false);
            }
        };

        verifyNoteExists();
    }, [unwrappedParams.id]); // Use unwrappedParams in dependencies

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return <NoteDetail params={unwrappedParams} />; // Pass unwrapped params
}