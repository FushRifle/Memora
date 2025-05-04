import CourseCard from '@/app/components/courses/CourseCard';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

const courses = [
    {
        id: '1',
        title: 'Biology 101',
        instructor: 'Dr. Sarah Johnson',
        progress: 75,
        thumbnail: '/images/biology.jpg',
        lastAccessed: '2 days ago',
        totalNotes: 12,
        totalQuizzes: 5,
    },
    {
        id: '2',
        title: 'Calculus II',
        instructor: 'Prof. Michael Chen',
        progress: 42,
        thumbnail: '/images/math.jpg',
        lastAccessed: '1 day ago',
        totalNotes: 8,
        totalQuizzes: 3,
    },
    {
        id: '3',
        title: 'World History',
        instructor: 'Dr. Emily Rodriguez',
        progress: 88,
        thumbnail: '/images/history.jpg',
        lastAccessed: '5 hours ago',
        totalNotes: 15,
        totalQuizzes: 7,
    },
    {
        id: '4',
        title: 'Computer Science Fundamentals',
        instructor: 'Prof. David Wilson',
        progress: 35,
        thumbnail: '/images/cs.jpg',
        lastAccessed: '1 week ago',
        totalNotes: 5,
        totalQuizzes: 2,
    },
];

export default function CoursesPage() {
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
                    href="/dashboard/courses/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                    Add Course
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}