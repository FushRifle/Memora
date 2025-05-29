import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: Request) {
    try {
        const { notes, requirements } = await request.json();

        if (!notes?.length) {
            return NextResponse.json(
                { error: 'No notes provided' },
                { status: 400 }
            );
        }

        const prompt = `
      Generate ${requirements.number_of_options || 3} quiz options based on these notes.
      Each option should include:
      - id: unique string
      - title: descriptive title
      - topic: main topic
      - questions_count: between 5-15
      - estimated_time: in minutes
      - difficulty: easy/medium/hard
      - question_types: array of question types

      Notes content:
      ${notes.map((note: any) => `### ${note.title}\n${note.content.substring(0, 200)}...`).join('\n\n')}

      Return JSON format:
      {
        "options": [
          {
            "id": "quiz1",
            "title": "Basic Concepts Quiz",
            "topic": "Introduction",
            "questions_count": 10,
            "estimated_time": 15,
            "difficulty": "easy",
            "question_types": ["multiple_choice", "true_false"]
          }
        ]
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
            temperature: 0.7
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
        return NextResponse.json(result.options ? result : { options: [] });

    } catch (error: any) {
        console.error('Groq API error:', error.message);
        return NextResponse.json(
            { error: error.message || 'Failed to generate quiz options' },
            { status: 500 }
        );
    }
}