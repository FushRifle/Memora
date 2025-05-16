import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(15, '60 s'),
});

interface AnalysisRequest {
    notes: { content: string }[];
    task: string;
    options?: {
        format?: 'bullet' | 'paragraph' | 'table';
        complexity?: 'simple' | 'detailed';
        includeQuestions?: boolean;
    };
}

export async function POST(request: Request) {
    try {
        const identifier = request.headers.get('x-real-ip') || 'anonymous';
        const { success } = await ratelimit.limit(identifier);

        if (!success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        const { notes, task, options }: AnalysisRequest = await request.json();

        if (!notes || !Array.isArray(notes)) {
            return NextResponse.json(
                { error: 'Invalid notes format' },
                { status: 400 }
            );
        }

        const prompt = `
**Task:** ${task}
**Format:** ${options?.format || 'bullet'}
**Complexity:** ${options?.complexity || 'detailed'}
**Include Questions:** ${options?.includeQuestions ? 'Yes' : 'No'}

**Notes to Analyze:**
${notes.map(n => n.content).join('\n\n')}

Please provide:
1. A comprehensive analysis
2. Key takeaways
${options?.includeQuestions ? '3. 3-5 study questions with answers' : ''}
`;

        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 2000,
            })
        });

        if (!response.ok) {
            console.error('Groq API error:', await response.text());
            return NextResponse.json(
                {
                    analysis: "I'm currently experiencing high demand. Please try again later.",
                    isFallback: true,
                },
                { status: 200 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            analysis: data.choices[0]?.message?.content,
            usage: data.usage,
        });

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
