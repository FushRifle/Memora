'use client';

import { FiBookOpen } from 'react-icons/fi';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/client';
import { useAuth } from '@/providers/AuthProvider';

interface Course {
    id: string;
    name: string;
    progress: number;
    color: string;
    targetHours: number;
    completedHours: number;
}

interface SupabaseCourse {
    id: string;
    title: string;
    color: string | null;
    target_hours: number | null;
    completed_hours: number | null;
    is_active: boolean;
}

const DEFAULT_TARGET_HOURS = 10;
const DEFAULT_COLOR = 'bg-indigo-600';

const StudyProgress = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCourses = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);

        const { data, error } = await supabase
            .from('courses')
            .select('id, title, color, target_hours, completed_hours, is_active')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching courses:', error);
            return;
        }

        const formatted = (data as SupabaseCourse[]).map(course => {
            const target = course.target_hours || DEFAULT_TARGET_HOURS;
            const completed = course.completed_hours || 0;

            return {
                id: course.id,
                name: course.title,
                color: course.color || DEFAULT_COLOR,
                progress: Math.min(Math.round((completed / target) * 100), 100),
                targetHours: target,
                completedHours: completed,
            };
        });

        setCourses(formatted);
        setIsLoading(false);
    }, [user?.id]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Study Progress</h2>
                <Link href="/courses" className="text-sm text-indigo-600 hover:text-indigo-500">
                    View all
                </Link>
            </div>

            {courses.length === 0 ? <EmptyState /> : (
                <div className="space-y-4">
                    {courses.map(course => (
                        <CourseProgressItem key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CourseProgressItem = ({ course }: { course: Course }) => (
    <div>
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
                <FiBookOpen className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">{course.name}</span>
            </div>
            <span className="text-xs font-medium text-gray-500">
                {course.progress}% ({course.completedHours.toFixed(1)}h / {course.targetHours}h)
            </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className={`${course.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${course.progress}%` }}
            />
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Study Progress</h2>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 bg-gray-200 rounded-full" />
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                        </div>
                        <div className="h-4 w-8 bg-gray-200 rounded" />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-300 h-2 rounded-full w-1/2 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    </>
);

const EmptyState = () => (
    <div className="text-center py-4">
        <p className="text-gray-500">No active courses found</p>
        <Link href="/courses/new" className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 inline-block">
            Add a new course
        </Link>
    </div>
);

export default StudyProgress;
