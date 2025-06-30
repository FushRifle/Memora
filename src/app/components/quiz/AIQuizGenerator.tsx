'use client';

import { useState, useCallback } from 'react';
import { FiX, FiBookOpen, FiZap, FiClock, FiAlertCircle } from 'react-icons/fi';
import type { Note, Quiz } from '@/types/page';
import NoteContextSelector from './QuizContext';
import { useAuth } from '@/providers/AuthProvider';
import { useQuizStore } from '@/store/QuizStore';
import { useRouter } from 'next/navigation';

interface AIGeneratedQuizOption {
    id: string;
    title: string;
    topic: string;
    questions_count: number;
    estimated_time: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    question_types?: string[];
}

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
    points: number;
}

interface FullQuizData {
    title: string;
    topic: string;
    description?: string;
    questions: QuizQuestion[];
    estimated_time: number;
    difficulty: string;
    total_points: number;
    due_date?: string;
    completed?: boolean;
    score?: number;
    total_questions?: number;
    user_id?: string;
    updated_at?: string;
}

export default function AIQuizGenerator({
    onGenerate,
    onCancel,
}: {
    onGenerate: (quizData: FullQuizData) => void;
    onCancel: () => void;
}) {
    const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedOptions, setGeneratedOptions] = useState<AIGeneratedQuizOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<AIGeneratedQuizOption | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [generationStep, setGenerationStep] = useState<'options' | 'full-quiz'>('options');
    const { addQuiz } = useQuizStore();
    const { user } = useAuth();
    const router = useRouter();

    const handleNoteSelection = useCallback((newSelectedNotes: Note[]) => {
        setSelectedNotes(newSelectedNotes);
    }, []);

    const toggleSelector = useCallback(() => {
        setIsSelectorOpen(prev => !prev);
    }, []);

    const generateQuizOptions = async () => {
        if (selectedNotes.length === 0) {
            setError('Please select at least one note');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const notesContext = selectedNotes.map(note => ({
                title: note.title,
                content: note.content,
                course: note.course?.title || 'General',
            }));

            const response = await fetch('/api/quiz/quiz-options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes: notesContext,
                    requirements: {
                        number_of_options: 3,
                        include_difficulty: true,
                        include_question_types: true
                    }
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Request failed');

            setGeneratedOptions(data.options || []);
            setSelectedOption(data.options?.[0] || null);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Generation failed');
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateFullQuiz = async () => {
        if (!selectedOption) {
            setError('Please select a quiz option first');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGenerationStep('full-quiz');

        try {
            const notesContext = selectedNotes.map(note => ({
                title: note.title,
                content: note.content,
                keyConcepts: note.course?.title || '',
                tags: note.course ? [note.course.title] : [],
            }));

            const response = await fetch('/api/quiz/all-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes: notesContext,
                    quizOption: selectedOption,
                    requirements: {
                        format: 'json',
                        include_explanations: true,
                        points_per_question: 10,
                        shuffle_answers: true
                    }
                }),
            });

            if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);

            const quizData = await response.json();
            if (!quizData.questions?.length) throw new Error('Invalid quiz format received');

            const completeQuizData: FullQuizData = {
                ...quizData,
                title: selectedOption.title,
                topic: selectedOption.topic,
                estimated_time: selectedOption.estimated_time,
                difficulty: selectedOption.difficulty || 'medium',
                total_points: quizData.questions.reduce((sum: number, q: QuizQuestion) => sum + q.points, 0),
            };

            onGenerate(completeQuizData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate full quiz');
            console.error('Full quiz generation error:', err);
            setGenerationStep('options');
        } finally {
            setIsGenerating(false);
        }
    };

    const resetGeneration = () => {
        setGeneratedOptions([]);
        setSelectedOption(null);
        setError(null);
        setGenerationStep('options');
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white shadow-3xl rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b px-4 py-3 sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-medium">Generate Quiz</h3>
                    <button
                        onClick={onCancel}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Close"
                        disabled={isGenerating}
                    >
                        <FiX className="h-8 w-8 text-red-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <div className="flex items-center">
                                <FiAlertCircle className="h-5 w-5 text-red-500 mr-3" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className='flex flex-row mb-4'>
                        <div className='ml-auto flex flex-col items-end'>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Notes to Generate Quiz From
                            </label>
                            <NoteContextSelector
                                selectedNotes={
                                    selectedNotes
                                        .filter((n): n is Note & { created_at: string } => typeof n.created_at === 'string' && typeof n.title === 'string')
                                        .map(n => n as import('./QuizContext').Note)
                                }
                                onSelectionChange={handleNoteSelection}
                                disabled={isGenerating}
                                isOpen={isSelectorOpen}
                                onToggleOpen={toggleSelector}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Selected {selectedNotes.length} note(s)
                            </p>
                        </div>
                    </div>

                    {generationStep === 'options' ? (
                        <div className="space-y-6">
                            {generatedOptions.length > 0 ? (
                                <div>
                                    <h4 className="text-md font-medium text-gray-900 mb-4">
                                        Choose a Quiz Style
                                    </h4>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {generatedOptions.map((option) => (
                                            <div
                                                key={option.id}
                                                onClick={() => !isGenerating && setSelectedOption(option)}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all h-full flex flex-col ${selectedOption?.id === option.id
                                                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                                                    : 'border-gray-200 hover:border-indigo-300'
                                                    } ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                <h5 className="font-medium text-gray-900">{option.title}</h5>
                                                <p className="text-sm text-gray-500 mt-1">{option.topic}</p>
                                                <div className="mt-4 pt-4 border-t border-gray-100 flex-grow">
                                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                        <span className="flex items-center">
                                                            <FiBookOpen className="mr-1.5" />
                                                            {option.questions_count} questions
                                                        </span>
                                                        <span className="flex items-center">
                                                            <FiClock className="mr-1.5" />
                                                            {option.estimated_time} min
                                                        </span>
                                                    </div>
                                                    {option.difficulty && (
                                                        <div className="text-xs mt-2">
                                                            <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                                {option.difficulty}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {(option.question_types?.length ?? 0) > 0 && (
                                                        <div className="mt-3">
                                                            <p className="text-xs font-medium text-gray-500 mb-1">Question types:</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(option.question_types ?? []).map((type, i) => (
                                                                    <span key={i} className="text-xs px-2 py-1 bg-gray-50 rounded">
                                                                        {type}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                                        <FiZap className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h3 className="mt-3 text-lg font-medium text-gray-900">
                                        {isGenerating ? 'Generating quiz options...' : 'No quiz options yet'}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {isGenerating
                                            ? 'Analyzing your notes to create optimal quiz options'
                                            : 'Select notes and click "Generate Options" to get started'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                                {isGenerating ? (
                                    <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
                                ) : (
                                    <FiBookOpen className="h-8 w-8 text-indigo-600" />
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {isGenerating ? 'Generating your quiz...' : 'Quiz ready!'}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {isGenerating
                                    ? `Creating "${selectedOption?.title}" with questions based on your notes`
                                    : 'The quiz has been generated and will be displayed shortly'}
                            </p>
                            {!isGenerating && (
                                <div className="mt-4 animate-pulse text-sm text-indigo-600">
                                    Redirecting...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t px-4 py-3 flex justify-between sticky bottom-0 bg-white">
                    {generationStep === 'options' && generatedOptions.length > 0 && (
                        <button
                            type="button"
                            onClick={resetGeneration}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-400
                            rounded-lg hover:text-gray-900"
                            disabled={isGenerating}
                        >
                            Start Over
                        </button>
                    )}

                    <div className="flex space-x-3 ml-auto">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            disabled={isGenerating}
                        >
                            Cancel
                        </button>

                        {generationStep === 'options' ? (
                            generatedOptions.length > 0 ? (
                                <button
                                    type="button"
                                    onClick={generateFullQuiz}
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isGenerating || !selectedOption}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="inline-block animate-spin mr-2">↻</span>
                                            Finalizing...
                                        </>
                                    ) : (
                                        `Create "${selectedOption?.title}" Quiz`
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={generateQuizOptions}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isGenerating || selectedNotes.length === 0}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="inline-block animate-spin mr-2">↻</span>
                                            Generating Options...
                                        </>
                                    ) : (
                                        'Generate Quiz Options'
                                    )}
                                </button>
                            )
                        ) : (
                            <button
                                type="button"
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md opacity-50 cursor-not-allowed"
                                disabled
                            >
                                Generating Quiz...
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function setGeneratedQuizzes(arg0: (prev: any) => any[]) {
    throw new Error('Function not implemented.');
}

function setSelectedQuiz(savedQuiz: Quiz) {
    throw new Error('Function not implemented.');
}
