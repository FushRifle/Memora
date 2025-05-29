'use client';

import { notFound } from 'next/navigation';
import { useQuizStore } from '@/store/QuizStore';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';
import QuizPlayer from '@/app/components/quiz/QuizPlayer';
import type { Quiz } from '@/types/page';

interface Params {
    id: string;
}

export default function QuizPage({ params }: { params: Params }) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const { getQuizById } = useQuizStore();
    const { user } = useAuth();

    useEffect(() => {
        const loadQuiz = async () => {
            if (!user) return;
            try {
                const fetchedQuiz = await getQuizById(params.id);
                if (!fetchedQuiz || fetchedQuiz.user_id !== user.id) {
                    notFound();
                }
                setQuiz(fetchedQuiz);
            } catch (error) {
                console.error('Failed to load quiz:', error);
                notFound();
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [params.id, user, getQuizById]);

    if (loading) {
        return <div className="p-4 text-center">Loading quiz...</div>;
    }

    if (!quiz) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
            <p className="text-gray-600 mb-6">{quiz.topic}</p>

            <div className="bg-white rounded-lg shadow p-6">
                <QuizPlayer quiz={quiz} />
            </div>
        </div>
    );
}