'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NewCoursePage() {
    const [formData, setFormData] = useState({
        title: '',
        color: '#6366f1',
        targetHours: 10,
        instructor: '',
        description: '',
        thumbnail: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'targetHours' ? Number(value) : value
        }));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || formData.targetHours <= 0) {
            toast.error('Please enter a valid title and target hours.');
            return;
        }

        try {
            setLoading(true);

            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                toast.error('User not authenticated.');
                throw userError || new Error('No user found');
            }

            // Create the course
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .insert({
                    user_id: user.id,
                    title: formData.title,
                    color: formData.color,
                    target_hours: formData.targetHours,
                    completed_hours: 0,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    last_studied: null,
                    instructor: formData.instructor,
                    description: formData.description,
                    thumbnail: formData.thumbnail
                })
                .select()
                .single();

            if (courseError || !courseData) {
                toast.error(`Error creating course: ${courseError?.message}`);
                throw courseError || new Error('No course data returned');
            }

            // Upsert the course view (insert or update if exists)
            const { error: viewError } = await supabase
                .from('course_view')
                .upsert({
                    user_id: user.id,
                    course_id: courseData.id,
                    course_title: courseData.title,
                    instructor: formData.instructor,
                    description: formData.description,
                    thumbnail: formData.thumbnail,
                    last_accessed: new Date().toISOString(),
                    viewed_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,course_id' // Handle duplicate key constraint
                });

            if (viewError) {
                // If upsert fails, try to update existing record
                const { error: updateError } = await supabase
                    .from('course_view')
                    .update({
                        course_title: courseData.title,
                        instructor: formData.instructor,
                        description: formData.description,
                        thumbnail: formData.thumbnail,
                        last_accessed: new Date().toISOString(),
                        viewed_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                    .eq('course_id', courseData.id);

                if (updateError) {
                    console.error('Failed to update course view:', updateError);
                    toast.warning('Course created but view could not be updated');
                }
            }

            toast.success('Course created successfully!');
            router.push(`/courses/${courseData.id}`);

        } catch (err) {
            console.error('Unexpected error:', err);
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('Something went wrong.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add New Course</h1>

            <form onSubmit={handleCreate} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Title*</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Biology 101"
                        className="w-full border border-gray-300 p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Target Study Hours*</label>
                    <input
                        type="number"
                        name="targetHours"
                        required
                        value={formData.targetHours}
                        min={1}
                        onChange={handleChange}
                        placeholder="e.g. 40"
                        className="w-full border border-gray-300 p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Color</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-10 h-10 border rounded cursor-pointer"
                        />
                        <span className="text-gray-600 text-sm">{formData.color}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Instructor</label>
                    <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleChange}
                        placeholder="e.g. Prof. Smith"
                        className="w-full border border-gray-300 p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Course description"
                        className="w-full border border-gray-300 p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                    <input
                        type="text"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        placeholder="https://example.com/thumbnail.jpg"
                        className="w-full border border-gray-300 p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition flex justify-center items-center gap-2"
                >
                    {loading ? (
                        <>
                            Creating course...
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </>
                    ) : 'Create Course'}
                </button>
            </form>

            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        </div>
    );
}