// app/dashboard/quizzes/page.tsx
'use client';

import { useState } from 'react';
import { FiPlus, FiCalendar, FiCheckCircle, FiAward, FiZap } from 'react-icons/fi';
import Link from 'next/link';
import QuizList from '@/app/components/quiz/QuizList';
import QuizCalendarView from '@/app/components/quiz/QuizCalendarView';
import QuizCard from '@/app/components/quiz/QuizCard';
import AIQuizGenerator from '@/app/components/quiz/AIQuizGenerator';
import { Quiz } from '@/types/page';

type ViewMode = 'list' | 'calendar' | 'cards';

export default function QuizzesPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [showGenerator, setShowGenerator] = useState(false);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    // Add this function to handle the generated quiz
    const handleQuizGenerated = (quizData: any) => {
        // In a real app, you would save this to your database
        const newQuiz: Quiz = {
            id: `quiz-${Date.now()}`,
            user_id: 'current-user-id',
            title: quizData.title,
            topic: quizData.topic,
            total_questions: quizData.questions.length,
            completed: false,
            score: 0,
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            questions: [],
            estimated_time: 0,
            difficulty: '',
            total_points: 0,
            updated_at: ''
        };

        setQuizzes([...quizzes, newQuiz]);
        setShowGenerator(false);

        // In a real app, you would also save the questions to your database
        console.log('Generated quiz questions:', quizData.questions);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Study Quizzes</h2>
                    {/* ... existing stats ... */}
                    <div className="mt-2 text-sm text-gray-500">
                        {quizzes.length} quizzes available
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <button
                            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                            cursor-pointer"
                        >
                            {viewMode === 'list' ? (
                                <>
                                    <FiCalendar className="-ml-1 mr-1.5 h-4 w-4 text-gray-400" />
                                    Calendar View
                                </>
                            ) : (
                                <>
                                    <FiCalendar className="-ml-1 mr-1.5 h-4 w-4 text-gray-400" />
                                    List View
                                </>
                            )}
                        </button>
                    </div>
                    <button
                        onClick={() => setShowGenerator(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        cursor-pointer"
                    >
                        <FiZap className="-ml-1 mr-1.5 h-4 w-4" />
                        Generate Quiz
                    </button>
                </div>
            </div>

            {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzes.map(quiz => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>
            ) : viewMode === 'list' ? (
                <QuizList quizzes={quizzes} />
            ) : (
                <QuizCalendarView quizzes={quizzes} />
            )}

            {showGenerator && (
                <AIQuizGenerator
                    onGenerate={handleQuizGenerated}
                    onCancel={() => setShowGenerator(false)}
                />
            )}
        </div>
    );
}