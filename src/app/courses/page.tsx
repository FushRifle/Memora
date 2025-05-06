'use client';

import { useEffect, useState } from 'react';
import CourseCard from '@/app/components/courses/CourseCard';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { supabase } from '@/lib/client';

interface Course {
    id: string;
    user_id: string;
    title: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    color: string;
    target_hours: number;
    completed_hours: number;
    last_studied: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;
            if (!user) return;

            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true);

            if (error) {
                console.error('Failed to fetch courses:', error.message);
            } else {
                setCourses(data || []);
            }

            setLoading(false);
        };

        fetchCourses();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">My Courses</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage all your enrolled courses
                    </p>
                </div>
                <Link
                    href="/courses/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                    Add Course
                </Link>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">Loading courses...</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                    {courses.length === 0 && (
                        <p className="text-sm text-gray-500 col-span-full">No active courses found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
