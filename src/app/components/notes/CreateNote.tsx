'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiFileText, FiBook, FiSave } from 'react-icons/fi';
import { supabase } from '@/lib/client';
import { useRouter } from 'next/navigation';

interface Course {
    id: string;
    title: string;
    color?: string;
}

interface CreateNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    courses: Course[];
    onCourseCreated?: (newCourse: Course) => void;
}

export default function CreateNoteModal({ isOpen, onClose, courses, onCourseCreated }: CreateNoteModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showNewCourseInput, setShowNewCourseInput] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [userId, setUserId] = useState<string | null>(null);

    // Get the current user's ID when component mounts
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        fetchUser();
    }, []);

    const [newNote, setNewNote] = useState({
        title: '',
        course_id: courses.length > 0 ? courses[0].id : '',
        type: 'lecture' as 'lecture' | 'handwritten' | 'book' | 'other',
        content: '# New Note\n\nStart writing here...',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewNote(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddNewCourse = async () => {
        if (!newCourseTitle.trim()) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const { data: course, error } = await supabase
                .from('courses')
                .insert({
                    title: newCourseTitle,
                    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
                })
                .select()
                .single();

            if (error) throw error;
            if (!course) throw new Error('Failed to create course');

            if (onCourseCreated) {
                onCourseCreated(course);
            }

            setNewNote(prev => ({
                ...prev,
                course_id: course.id
            }));

            setShowNewCourseInput(false);
            setNewCourseTitle('');
        } catch (error) {
            console.error('Error creating course:', error);
            setError('Failed to create new course. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!userId) {
                throw new Error('You must be logged in to create notes');
            }

            const { data, error: supabaseError } = await supabase
                .from('notes')
                .insert([{
                    title: newNote.title,
                    content: newNote.content,
                    course_id: newNote.course_id,
                    type: newNote.type,
                    status: 'draft',
                    user_id: userId // Include the user_id in the insert
                }])
                .select()
                .single();

            if (supabaseError) throw supabaseError;
            if (!data) throw new Error('No data returned from insert');

            onClose();
            router.refresh();
            router.push(`/notes/${data.id}`);
        } catch (error) {
            console.error('Error creating note:', error);
            setError(error instanceof Error ? error.message : 'Failed to create note. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <div className="flex items-center space-x-2">
                        <FiFileText className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-medium text-gray-900">Create New Note</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                        disabled={isSubmitting}
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newNote.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">
                                Course
                            </label>
                            {showNewCourseInput ? (
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newCourseTitle}
                                        onChange={(e) => setNewCourseTitle(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder="New course name"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddNewCourse}
                                        disabled={!newCourseTitle.trim() || isSubmitting}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewCourseInput(false)}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <select
                                        id="course_id"
                                        name="course_id"
                                        value={newNote.course_id}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    >
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewCourseInput(true)}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <FiPlus className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                Note Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={newNote.type}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            >
                                <option value="lecture">Lecture Notes</option>
                                <option value="handwritten">Handwritten Notes</option>
                                <option value="book">Book Summary</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content (Markdown supported)
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={newNote.content}
                            onChange={handleChange}
                            rows={10}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border font-mono"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                'Creating...'
                            ) : (
                                <>
                                    <FiSave className="-ml-1 mr-2 h-5 w-5" />
                                    Create Note
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}