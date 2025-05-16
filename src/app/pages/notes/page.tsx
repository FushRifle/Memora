'use client';
import { useState, useEffect } from 'react';
import CreateNoteModal from '@/app/components/notes/CreateNote';
import UploadNoteModal from '@/app/components/notes/UploadNotes';
import NoteList from '@/app/components/notes/NoteList';
import { FiPlus, FiUpload } from 'react-icons/fi';
import { supabase } from '@/lib/client';

interface Course {
    id: string;
    title: string;
    color?: string;
}

export default function NotesPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all courses from the courses table
                const { data, error: supabaseError } = await supabase
                    .from('courses')
                    .select('id, title, color')
                    .order('title', { ascending: true });

                if (supabaseError) throw supabaseError;

                setCourses(data || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseCreated = (newCourse: Course) => {
        setCourses([...courses, newCourse]);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">All Notes</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage all your study notes
                    </p>
                </div>
                <div className="space-x-4">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                        Create Note
                    </button>

                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                        <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                        Upload Note
                    </button>
                </div>
            </div>

            {/* Modals */}
            <CreateNoteModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                courses={courses}
                onCourseCreated={handleCourseCreated}
            />

            <UploadNoteModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                courses={courses}
                onCourseCreated={handleCourseCreated}
            />

            <NoteList courses={courses} />
        </div>
    );
}