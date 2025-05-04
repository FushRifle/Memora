import Link from 'next/link';
import { FiBook, FiFileText, FiAward } from 'react-icons/fi';

interface Course {
    id: string;
    title: string;
    instructor: string;
    progress: number;
    thumbnail: string;
    lastAccessed: string;
    totalNotes: number;
    totalQuizzes: number;
}

export default function CourseCard({ course }: { course: Course }) {
    const initials = course.title
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                        {initials}
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.instructor}</p>
                    </div>
                </div>
            </div>
            <div className="px-4 py-4 sm:px-6">
                <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="text-gray-500">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                        ></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-500">
                        <FiFileText className="mr-2 h-4 w-4" />
                        <span>{course.totalNotes} notes</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <FiAward className="mr-2 h-4 w-4" />
                        <span>{course.totalQuizzes} quizzes</span>
                    </div>
                </div>
            </div>
            <div className="px-4 py-4 sm:px-6 bg-gray-50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Last accessed {course.lastAccessed}</span>
                    <Link
                        href={`/courses/${course.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        View course →
                    </Link>
                </div>
            </div>
        </div>
    );
}
