import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: Request) {
    try {
        const { notes, quizOption, requirements } = await request.json();

        if (!notes || !quizOption) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const prompt = `
      Generate a complete quiz with these specifications:
      Title: ${quizOption.title}
      Topic: ${quizOption.topic}
      Questions: ${quizOption.questions_count}
      Difficulty: ${quizOption.difficulty || 'medium'}
      Time: ${quizOption.estimated_time} minutes

      Based on these notes:
      ${notes.map((note: any) => `### ${note.title}\n${note.content.substring(0, 200)}...`).join('\n\n')}

      Requirements:
      - Format: JSON
      - Include explanations
      - ${requirements.points_per_question} points per question
      - Shuffle answer options

      Return JSON format:
      {
        "title": "Quiz Title",
        "topic": "Main Topic",
        "questions": [
          {
            "id": "q1",
            "question": "What is...?",
            "options": ["Option 1", "Option 2"],
            "correct_answer": 0,
            "explanation": "...",
            "points": 10
          }
        ],
        "estimated_time": 15,
        "difficulty": "medium",
        "total_points": 100
      }
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a quiz generation assistant. Return only valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.5
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Groq API error:', error.message);
        return NextResponse.json(
            { error: error.message || 'Failed to generate full quiz' },
            { status: 500 }
        );
    }
}