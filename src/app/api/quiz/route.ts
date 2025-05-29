
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client'


export async function GET() {
    try {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .order('due_date', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch quizzes' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { quiz, questions } = await request.json();

        // Insert quiz
        const { data: quizData, error: quizError } = await supabase
            .from('quizzes')
            .insert({
                title: quiz.title,
                topic: quiz.topic,
                due_date: quiz.due_date,
                course_id: quiz.course_id,
                total_questions: questions.length,
            })
            .select()
            .single();

        if (quizError) throw quizError;

        // Insert questions
        const questionsToInsert = questions.map((q: any) => ({
            quiz_id: quizData.id,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            points: q.points,
        }));

        const { error: questionsError } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert);

        if (questionsError) throw questionsError;

        return NextResponse.json(quizData);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create quiz' },
            { status: 500 }
        );
    }
}