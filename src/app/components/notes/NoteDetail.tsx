'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/client';
import NoteEditor from '@/app/components/notes/NoteEditor';
import LoadingSpinner from '@/app/components/notes/LoadingSpinner';

interface Course {
    id: string;
    title: string;
}

interface Note {
    id: string;
    title: string;
    content: string;
    course_id: string;
    created_at: string;
    updated_at: string;
    type: string; // Added type property
    status: string; // Added status property
    // Add other note properties as needed
}
interface NoteDetailProps {
    params: { id: string };
}
export default function NoteDetail({ params }: NoteDetailProps) {
    const [note, setNote] = useState<Note | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Verify we have a valid ID
                const noteId = params?.id;
                if (!noteId || typeof noteId !== 'string') {
                    throw new Error('Invalid note ID');
                }

                // Fetch note
                const { data: noteData, error: noteError } = await supabase
                    .from('notes')
                    .select('*')
                    .eq('id', noteId)
                    .single();

                if (noteError) throw noteError;
                if (!noteData) throw new Error('Note not found');

                // Fetch courses
                const { data: coursesData, error: coursesError } = await supabase
                    .from('courses')
                    .select('id, title');

                if (coursesError) throw coursesError;

                setNote(noteData);
                setCourses(coursesData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error instanceof Error ? error.message : 'Failed to load note data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!note) return <div className="p-4">Note not found</div>;

    return (
        <div className="container mx-auto p-4">
            <NoteEditor note={note} courses={courses} />
        </div>
    );
}