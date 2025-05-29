import { useState } from 'react';
import type { Quiz } from '@/types/page';

interface QuizPlayerProps {
    quiz: Quiz;
}

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [score, setScore] = useState<number | null>(null);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion.id]: answerIndex
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const calculateScore = () => {
        let total = 0;
        quiz.questions.forEach(question => {
            if (selectedAnswers[question.id] === question.correct_answer) {
                total += question.points;
            }
        });
        setScore(total);
    };

    return (
        <div>
            {score !== null ? (
                <div className="text-center py-8">
                    <h2 className="text-xl font-semibold mb-2">Quiz Completed!</h2>
                    <p className="text-lg">
                        Your score: {score}/{quiz.total_points}
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">
                                Question {currentQuestionIndex + 1} of {quiz.questions.length}
                            </span>
                            <span className="text-sm text-gray-500">
                                {currentQuestion.points} points
                            </span>
                        </div>
                        <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`w-full text-left p-3 border rounded-lg ${selectedAnswers[currentQuestion.id] === index
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    onClick={() => handleAnswerSelect(index)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {currentQuestionIndex < quiz.questions.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={calculateScore}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Submit Quiz
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}