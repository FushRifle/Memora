'use client';

import Link from 'next/link';
import { FiFileText, FiAward } from 'react-icons/fi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Course {
    id: string;
    title: string;
    color: string;
    target_hours: number;
    completed_hours: number;
    last_studied: string;
}

export default function CourseCard({ course }: { course: Course }) {
    const initials = course.title
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const progress = course.target_hours
        ? Math.min(100, Math.round((Number(course.completed_hours) / course.target_hours) * 100))
        : 0;

    const lastAccessed = course.last_studied
        ? dayjs(course.last_studied).fromNow()
        : 'Never';

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center">
                    <div
                        className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center font-bold text-lg"
                        style={{
                            backgroundColor: course.color || '#EEF2FF',
                            color: '#111827',
                        }}
                    >
                        {initials}
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500">Target: {course.target_hours} hrs</p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 sm:px-6">
                <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-500">
                        <FiFileText className="mr-2 h-4 w-4" />
                        <span>{course.completed_hours} hrs done</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <FiAward className="mr-2 h-4 w-4" />
                        <span>{course.target_hours} hrs goal</span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 sm:px-6 bg-gray-50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Last studied {lastAccessed}</span>
                    <Link
                        href={`/pages/courses/${course.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        View course →
                    </Link>
                </div>
            </div>
        </div>
    );
}
