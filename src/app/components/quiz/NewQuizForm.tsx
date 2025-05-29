'use client';

import { useState } from 'react';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function NewQuizForm() {
    const router = useRouter();
    const [quiz, setQuiz] = useState({
        title: '',
        topic: '',
        due_date: '',
        course_id: '',
    });
    const [questions, setQuestions] = useState([{
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        points: 1,
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddQuestion = () => {
        setQuestions([...questions, {
            question: '',
            options: ['', '', '', ''],
            correct_answer: 0,
            points: 1,
        }]);
    };

    const handleRemoveQuestion = (index: number) => {
        if (questions.length > 1) {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // In a real app, you would submit this to your API
            // const response = await fetch('/api/quizzes', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ quiz, questions }),
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.push('/dashboard/quizzes');
        } catch (error) {
            console.error('Error creating quiz:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Quiz Details</h2>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Quiz Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={quiz.title}
                            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                            Topic
                        </label>
                        <input
                            type="text"
                            id="topic"
                            value={quiz.topic}
                            onChange={(e) => setQuiz({ ...quiz, topic: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            id="due_date"
                            value={quiz.due_date}
                            onChange={(e) => setQuiz({ ...quiz, due_date: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Questions</h2>
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiPlus className="mr-1 h-3 w-3" />
                        Add Question
                    </button>
                </div>

                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="mb-8 p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-md font-medium text-gray-900">
                                Question {qIndex + 1}
                            </h3>
                            {questions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveQuestion(qIndex)}
                                    className="text-gray-400 hover:text-red-500"
                                    title="Remove question"
                                >
                                    <FiTrash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor={`question-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Question Text
                            </label>
                            <input
                                type="text"
                                id={`question-${qIndex}`}
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options
                            </label>
                            <div className="space-y-2">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center">
                                        <input
                                            type="radio"
                                            name={`correct-answer-${qIndex}`}
                                            checked={q.correct_answer === oIndex}
                                            onChange={() => handleQuestionChange(qIndex, 'correct_answer', oIndex)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-32">
                            <label htmlFor={`points-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Points
                            </label>
                            <input
                                type="number"
                                id={`points-${qIndex}`}
                                min="1"
                                value={q.points}
                                onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value) || 1)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <FiSave className="-ml-1 mr-2 h-4 w-4" />
                            Save Quiz
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}