import { ReactNode } from "react";

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
    points: number;
}

export interface Quiz {
    id: string;
    user_id: string;
    title: string;
    topic: string;
    questions: QuizQuestion[];
    estimated_time: number;
    difficulty: string;
    total_points: number;
    score: number;
    total_questions: number;
    completed: boolean;
    due_date: string;
    created_at: string;
    updated_at: string;
}

export interface Note {
    [x: string]: any;
    id: string;
    user_id: string;
    content: string;
    processed_at: string | null;
    status: string;
    course_id: string;
    created_at?: string;
    title?: string;
    type?: string;
    selected?: boolean;
}

export interface FullQuiz {
    id?: string;
    title: string;
    topic: string;
    description?: string;
    questions: QuizQuestion[];
    estimated_time: number;
    difficulty: 'easy' | 'medium' | 'hard';
    total_points: number;
    due_date?: string;
    completed?: boolean;
    score?: number;
    total_questions?: number;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
}