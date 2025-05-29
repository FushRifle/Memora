'use client';

import { Quiz } from '@/types/page';
import { FiClock, FiCheck, FiAward } from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';

interface QuizCardProps {
    quiz: Quiz;
    variant?: 'default' | 'compact';
}

export default function QuizCard({ quiz, variant = 'default' }: QuizCardProps) {
    const dueDate = new Date(quiz.due_date);
    const isPastDue = dueDate < new Date() && !quiz.completed;

    if (variant === 'compact') {
        return (
            <Link
                href={`/quiz/${quiz.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{quiz.topic}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1" />
                        {format(dueDate, 'MMM d')}
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/quiz/${quiz.id}`}
            className="block p-6 border rounded-lg hover:shadow-md transition-all"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{quiz.topic}</p>
                </div>
                {quiz.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheck className="mr-1" /> Completed
                    </span>
                ) : isPastDue ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Overdue
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FiClock className="mr-1" /> Pending
                    </span>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1.5" />
                    Due: {format(dueDate, 'MMM d, yyyy h:mm a')}
                </div>
                {quiz.completed && (
                    <div className="flex items-center text-sm font-medium text-indigo-600">
                        <FiAward className="mr-1.5" />
                        Score: {quiz.score}/{quiz.total_questions}
                    </div>
                )}
            </div>
        </Link>
    );
}