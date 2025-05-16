import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(15, '60 s'), // 15 requests per minute
});

// Initialize OpenAI with fallback
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
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
        // Rate limiting
        const identifier = request.headers.get('x-real-ip') || 'anonymous';
        const { success } = await ratelimit.limit(identifier);

        if (!success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        const { notes, task, options }: AnalysisRequest = await request.json();

        // Validate input
        if (!notes || !Array.isArray(notes)) {
            return NextResponse.json(
                { error: 'Invalid notes format' },
                { status: 400 }
            );
        }

        // Construct the prompt
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

        // Call OpenAI with error fallback
        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 2000,
            });
        } catch (error) {
            console.error('OpenAI API error:', error);
            return NextResponse.json(
                {
                    analysis: "I'm currently experiencing high demand. Please try again later.",
                    isFallback: true
                },
                { status: 200 }
            );
        }

        return NextResponse.json({
            analysis: completion.choices[0]?.message?.content,
            usage: completion.usage,
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