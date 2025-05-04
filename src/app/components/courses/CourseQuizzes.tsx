import { FiAward, FiClock, FiBarChart2 } from 'react-icons/fi';
import Link from 'next/link';

interface Quiz {
    id: string;
    title: string;
    topic: string;
    dueDate: string;
    completed: boolean;
    score?: number;
    totalQuestions: number;
}

export default function CourseQuizzes({ courseId }: { courseId: string }) {
    // Mock quizzes data - replace with actual API calls
    const quizzes: Quiz[] = [
        {
            id: '1',
            title: 'Cell Biology Quiz',
            topic: 'Cell Structure',
            dueDate: '2023-11-10',
            completed: true,
            score: 85,
            totalQuestions: 15,
        },
        {
            id: '2',
            title: 'Genetics Midterm',
            topic: 'Mendelian Genetics',
            dueDate: '2023-11-17',
            completed: false,
            totalQuestions: 20,
        },
        {
            id: '3',
            title: 'Evolution Quiz',
            topic: 'Natural Selection',
            dueDate: '2023-11-24',
            completed: false,
            totalQuestions: 10,
        },
        {
            id: '4',
            title: 'Ecosystems Quiz',
            topic: 'Biomes and Ecosystems',
            dueDate: '2023-12-01',
            completed: true,
            score: 92,
            totalQuestions: 12,
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Course Quizzes</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
                    >
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <FiAward className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {quiz.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{quiz.topic}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <FiClock className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                                    <span>Due {quiz.dueDate}</span>
                                </div>

                                {quiz.completed ? (
                                    <div className="mt-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FiBarChart2 className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                                            <span>
                                                Score: {quiz.score}% ({Math.round((quiz.score || 0) / 100 * quiz.totalQuestions)}/
                                                {quiz.totalQuestions} questions)
                                            </span>
                                        </div>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${quiz.score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2 text-sm text-gray-500">
                                        {quiz.totalQuestions} questions
                                    </div>
                                )}
                            </div>

                            <div className="mt-5">
                                <Link
                                    href={`/dashboard/courses/${courseId}/quizzes/${quiz.id}`}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${quiz.completed
                                        ? 'bg-indigo-600 hover:bg-indigo-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                    {quiz.completed ? 'View Results' : 'Start Quiz'}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Generate New Quiz
                </button>
            </div>
        </div>
    );
}