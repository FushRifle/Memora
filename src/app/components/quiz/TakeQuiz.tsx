// app/components/quizzes/TakeQuiz.tsx
'use client';

import { useState } from 'react';
import { Quiz, QuizQuestion } from '@/types/page';
import { FiCheck, FiClock, FiAward } from 'react-icons/fi';
import { format } from 'date-fns';

export default function TakeQuiz({
    quiz,
    questions
}: {
    quiz: Quiz;
    questions: QuizQuestion[]
}) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedOption(optionIndex);
        setAnswers({
            ...answers,
            [questions[currentQuestionIndex].id]: optionIndex,
        });
    };

    const handleNextQuestion = () => {
        setSelectedOption(null);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setSelectedOption(answers[questions[currentQuestionIndex - 1].id] ?? null);
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const handleSubmit = () => {
        let calculatedScore = 0;
        questions.forEach(question => {
            const answer = answers[question.id];
            if (answer !== undefined && answer === question.correct_answer) {
                calculatedScore += question.points;
            }
        });
        setScore(calculatedScore);
        setSubmitted(true);

        // In a real app, you would submit this to your API
        // await submitQuizResults(quiz.id, answers, calculatedScore);
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <FiCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="mt-3 text-lg font-medium text-gray-900">Quiz Submitted!</h2>
                    <div className="mt-4 flex justify-center items-center">
                        <FiAward className="h-5 w-5 text-indigo-500 mr-2" />
                        <p className="text-lg font-medium">
                            Your score: {score}/{questions.reduce((sum, q) => sum + q.points, 0)}
                        </p>
                    </div>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => window.location.href = '/dashboard/quizzes'}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">{quiz.title}</h2>
                <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1" />
                    {format(new Date(quiz.due_date), 'MMM d, yyyy')}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span>{currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {currentQuestion.question}
                </h3>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <div
                            key={index}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedOption === index
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            onClick={() => handleOptionSelect(index)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 ${currentQuestionIndex === 0
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50'
                        }`}
                >
                    Previous
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                    <button
                        type="button"
                        onClick={handleNextQuestion}
                        disabled={selectedOption === null}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedOption === null
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedOption === null
                            ? 'bg-green-300 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        Submit Quiz
                    </button>
                )}
            </div>
        </div>
    );
}