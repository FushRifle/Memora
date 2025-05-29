'use client';

import { Quiz } from '@/types/page';
import { FiClock, FiCheck, FiX, FiAward } from 'react-icons/fi';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

export default function QuizList({ quizzes }: { quizzes: Quiz[] }) {
    if (quizzes.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No quizzes found</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Get started by creating a new quiz or importing from your courses.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Title
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Topic
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Due Date
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Score
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {quizzes.map((quiz) => (
                                    <tr key={quiz.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {quiz.title}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {quiz.topic}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                {format(new Date(quiz.due_date), 'MMM d, yyyy h:mm a')}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {quiz.completed ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FiCheck className="mr-1" /> Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <FiClock className="mr-1" /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {quiz.completed ? (
                                                <div className="flex items-center">
                                                    <FiAward className="mr-1.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                                                    {quiz.score}/{quiz.total_questions}
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <Link
                                                href={`/dashboard/quizzes/${quiz.id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                {quiz.completed ? 'View Results' : 'Take Quiz'}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}