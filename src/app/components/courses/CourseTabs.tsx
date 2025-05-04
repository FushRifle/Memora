'use client';

import { useState } from 'react';
import { FiBookOpen, FiFileText, FiAward, FiBarChart2 } from 'react-icons/fi';
import CourseContent from './CourseContent';
import CourseNotes from './CourseNotes';
import CourseQuizzes from './CourseQuizzes';
import CourseAnalytics from './CourseAnalytics';

interface SyllabusItem {
    week: number;
    topic: string;
    completed: boolean;
    resources?: string[];
}

interface Course {
    id: string;
    syllabus: SyllabusItem[];
    totalNotes: number;
    totalQuizzes: number;
}

export default function CourseTabs({ course }: { course: Course }) {
    const [activeTab, setActiveTab] = useState('content');

    const tabs = [
        { id: 'content', name: 'Course Content', icon: FiBookOpen },
        { id: 'notes', name: 'Notes', icon: FiFileText },
        { id: 'quizzes', name: 'Quizzes', icon: FiAward },
        { id: 'analytics', name: 'Analytics', icon: FiBarChart2 },
    ];

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <tab.icon className="mr-2 h-4 w-4" />
                            {tab.name}
                            {tab.id === 'notes' && (
                                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {course.totalNotes}
                                </span>
                            )}
                            {tab.id === 'quizzes' && (
                                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {course.totalQuizzes}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-6">
                {activeTab === 'content' && <CourseContent syllabus={course.syllabus} />}
                {activeTab === 'notes' && <CourseNotes courseId={course.id} />}
                {activeTab === 'quizzes' && <CourseQuizzes courseId={course.id} />}
                {activeTab === 'analytics' && <CourseAnalytics courseId={course.id} />}
            </div>
        </div>
    );
}