'use client';
import { useState } from 'react';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';
import { supabase } from '@/lib/client';

interface Course {
    id: string;
    title: string;
    color?: string;
}

interface UploadNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    courses: Course[];
    onCourseCreated?: (newCourse: Course) => void;
}

export default function UploadNoteModal({ isOpen, onClose, courses, onCourseCreated }: UploadNoteModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showNewCourseInput, setShowNewCourseInput] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');

    const [noteDetails, setNoteDetails] = useState({
        course_id: courses.length > 0 ? courses[0].id : '',
        type: 'lecture' as 'lecture' | 'handwritten' | 'book' | 'other',
        title: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // Set default title from filename
            const fileName = e.target.files[0].name.split('.')[0];
            setNoteDetails(prev => ({ ...prev, title: fileName }));
        }
    };

    const handleAddNewCourse = async () => {
        if (!newCourseTitle.trim()) return;

        try {
            setIsUploading(true);
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

            setNoteDetails(prev => ({
                ...prev,
                course_id: course.id
            }));

            setShowNewCourseInput(false);
            setNewCourseTitle('');
        } catch (error) {
            console.error('Error creating course:', error);
            setError('Failed to create new course. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // 1. Upload file to storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('notes')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Create note record in database
            const { error: dbError } = await supabase
                .from('notes')
                .insert([{
                    title: noteDetails.title || file.name.split('.')[0],
                    course_id: noteDetails.course_id,
                    type: noteDetails.type,
                    file_path: filePath,
                    content: '', // You might extract text here if needed
                    date: new Date().toISOString(),
                    lastEdited: new Date().toISOString(),
                    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                    processed: false,
                    relatedNotes: []
                }])
                .select()
                .single();

            if (dbError) throw dbError;

            onClose();
        } catch (error) {
            console.error('Error uploading note:', error);
            setError(error instanceof Error ? error.message : 'Failed to upload note');
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    const selectedCourse = courses.find(c => c.id === noteDetails.course_id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <div className="flex items-center space-x-2">
                        <FiUpload className="h-5 w-5 text-green-600" />
                        <h2 className="text-lg font-medium text-gray-900">Upload Note</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                        disabled={isUploading}
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

                <div className="p-4">
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept=".pdf,.md,.txt,.docx"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                {file ? file.name : 'PDF, Markdown, TXT, or DOCX up to 10MB'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Note Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={noteDetails.title}
                            onChange={(e) => setNoteDetails({ ...noteDetails, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="mt-4">
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
                                    disabled={!newCourseTitle.trim() || isUploading}
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
                                    value={noteDetails.course_id}
                                    onChange={(e) => setNoteDetails({ ...noteDetails, course_id: e.target.value })}
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

                    <div className="mt-4">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Note Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={noteDetails.type}
                            onChange={(e) => setNoteDetails({ ...noteDetails, type: e.target.value as any })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="lecture">Lecture Notes</option>
                            <option value="handwritten">Handwritten Notes</option>
                            <option value="book">Book Summary</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUploading}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading || !file}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {isUploading ? (
                                'Uploading...'
                            ) : (
                                <>
                                    <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                                    Upload
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}