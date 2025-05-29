'use client';
import { useState } from 'react';
import { FiSave, FiDownload, FiX, FiArrowLeft } from 'react-icons/fi';
import { supabase } from '@/lib/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Note {
    id: string;
    title: string;
    content: string;
    course_id: string;
    type: string;
    status: string;
}

interface Course {
    id: string;
    title: string;
}

export default function NoteEditor({ note, courses }: { note: Note; courses: Course[] }) {
    const router = useRouter();
    const [editedNote, setEditedNote] = useState<Note>(note);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedNote(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('notes')
                .update({
                    title: editedNote.title,
                    content: editedNote.content,
                    course_id: editedNote.course_id,
                    type: editedNote.type,
                    status: 'updated'
                })
                .eq('id', note.id);

            if (error) throw error;

            router.refresh();
            toast.success('Note saved successfully!'); // ✅ show success toast
        } catch (error) {
            console.error('Error saving note:', error);
            setError('Failed to save note. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([editedNote.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${editedNote.title || 'note'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Note downloaded!'); // ✅ show success toast
    };


    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-2xl">

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-blue-800 mb-6
                cursor-pointer"
            >
                <FiArrowLeft className="mr-2" />
                Back
            </button>

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center">
                        <FiX className="text-red-500 mr-2" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Title Input */}
            <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Note Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={editedNote.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter note title"
                />
            </div>

            {/* Course and Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Course
                    </label>
                    <select
                        id="course_id"
                        name="course_id"
                        value={editedNote.course_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Note Type
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={editedNote.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        <option value="lecture">Lecture Notes</option>
                        <option value="handwritten">Handwritten</option>
                        <option value="book">Book Summary</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={editedNote.content}
                    onChange={handleChange}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Write your note content here..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                    onClick={handleDownload}
                    disabled={isSaving}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiDownload className="mr-2" />
                    Download
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiSave className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
