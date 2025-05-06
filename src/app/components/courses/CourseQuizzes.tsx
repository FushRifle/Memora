import { FiAward, FiClock, FiBarChart2, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client';

interface Quiz {
    id: string;
    title: string;
    topic: string;
    due_date: string;
    completed: boolean;
    score?: number;
    total_questions: number;
    course_id: string;
}

interface SyllabusItem {
    week: number;
    topic: string;
    completed: boolean;
}

export default function CourseQuizzes({ courseId }: { courseId: string }) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch existing quizzes
                const { data: quizzesData, error: quizzesError } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('course_id', courseId)
                    .order('created_at', { ascending: false });

                if (quizzesError) throw quizzesError;
                setQuizzes(quizzesData || []);

                // Fetch syllabus to generate quiz options
                const { data: syllabusData, error: syllabusError } = await supabase
                    .from('course_view')
                    .select('syllabus')
                    .eq('course_id', courseId)
                    .single();

                if (syllabusError) throw syllabusError;
                setSyllabus(syllabusData?.syllabus || []);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const generateNewQuiz = async (topic: string) => {
        try {
            setLoading(true);

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Create new quiz
            const { data, error } = await supabase
                .from('quizzes')
                .insert({
                    title: `${topic} Quiz`,
                    topic,
                    course_id: courseId,
                    user_id: user.id,
                    total_questions: 10, // Default number of questions
                    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Due in 1 week
                })
                .select()
                .single();

            if (error) throw error;
            setQuizzes(prev => [data, ...prev]);

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Course Quizzes</h2>

            {quizzes.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No quizzes available yet. Generate one below.
                </div>
            ) : (
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
                                        <span>Due {new Date(quiz.due_date).toLocaleDateString()}</span>
                                    </div>

                                    {quiz.completed ? (
                                        <div className="mt-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FiBarChart2 className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                                                <span>
                                                    Score: {quiz.score}% ({Math.round((quiz.score || 0) / 100 * quiz.total_questions)}/
                                                    {quiz.total_questions} questions)
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
                                            {quiz.total_questions} questions
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5">
                                    <Link
                                        href={`/courses/${courseId}/quizzes/${quiz.id}`}
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
            )}

            <div className="pt-4">
                <h3 className="text-md font-medium text-gray-900 mb-2">Generate New Quiz</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {syllabus.map((item) => (
                        <button
                            key={item.topic}
                            onClick={() => generateNewQuiz(item.topic)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FiPlus className="mr-2 h-4 w-4" />
                            {item.topic}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
