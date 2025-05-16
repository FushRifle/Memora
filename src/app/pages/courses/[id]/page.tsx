'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import CourseHeader from '@/app/components/courses/CourseHeader';
import CourseTabs from '@/app/components/courses/CourseTabs';

interface SyllabusItem {
    week: number;
    topic: string;
    completed: boolean;
}

interface CourseView {
    id: string;
    course_id: string;
    user_id: string;
    course_title: string;
    instructor: string;
    description: string;
    progress: number;
    thumbnail: string;
    last_accessed: string;
    total_notes: number;
    total_quizzes: number;
    syllabus: SyllabusItem[];
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const supabase = createClientComponentClient();

    const [course, setCourse] = useState<CourseView | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCourseView() {
            try {
                setLoading(true);
                setError(null);

                // First try to get the most recent view
                const { data: views, error: viewsError } = await supabase
                    .from('course_view')
                    .select('*')
                    .eq('course_id', id)
                    .order('last_accessed', { ascending: false })
                    .limit(1);

                if (viewsError) throw viewsError;

                // If we have a view, use it
                if (views && views.length > 0) {
                    setCourse(views[0] as CourseView);
                    return;
                }

                // If no view exists, try to get basic course info
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (courseError) throw courseError;

                // Create a minimal CourseView from the course data
                if (courseData) {
                    const minimalView: CourseView = {
                        id: '',
                        course_id: courseData.id,
                        user_id: '', // You might want to set this to the current user
                        course_title: courseData.title || '',
                        instructor: courseData.instructor || '',
                        description: courseData.description || '',
                        progress: 0,
                        thumbnail: courseData.thumbnail || '',
                        last_accessed: new Date().toISOString(),
                        total_notes: 0,
                        total_quizzes: 0,
                        syllabus: courseData.syllabus || []
                    };
                    setCourse(minimalView);
                } else {
                    setCourse(null);
                }
            } catch (err) {
                console.error('Error fetching course:', err);
                setError(err instanceof Error ? err.message : 'Failed to load course data');
                setCourse(null);
            } finally {
                setLoading(false);
            }
        }

        fetchCourseView();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!course) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            <CourseHeader
                course={{
                    title: course.course_title,
                    lastAccessed: course.last_accessed,
                    totalNotes: course.total_notes,
                    totalQuizzes: course.total_quizzes,
                    ...course,
                }}
            />
            <CourseTabs
                course={{
                    ...course,
                    totalNotes: course.total_notes,
                    totalQuizzes: course.total_quizzes,
                }}
            />
        </div>
    );
}