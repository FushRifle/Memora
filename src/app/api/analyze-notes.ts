// /pages/api/study-ai.ts
import { OpenAI } from 'openai';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

// Initialize Redis client for caching and rate limiting
let redisClient: any = null;
if (process.env.REDIS_URL) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.connect().catch(console.error);
}

// Rate limiting configuration
const rateLimiter = new RateLimiterMemory({
    points: 10, // 10 requests
    duration: 60, // per 60 seconds
});

// Types
interface Note {
    id?: string;
    content: string;
    metadata?: {
        source?: string;
        importance?: number;
        tags?: string[];
        created_at?: Date;
    };
}

interface AnalysisOptions {
    format?: 'bullet-points' | 'paragraph' | 'summary-table' | 'mind-map' | 'outline';
    complexity?: 'simple' | 'detailed' | 'technical' | 'expert';
    language?: string;
    includeExamples?: boolean;
    generateQuestions?: number; // Number of questions to generate
    createFlashcards?: boolean | number; // Number or boolean
    highlightKeyConcepts?: boolean;
    generateMnemonics?: boolean;
    createStudyPlan?: boolean;
    findConnections?: boolean;
    suggestResources?: boolean;
    extractDefinitions?: boolean;
    identifyGaps?: boolean;
    generateAnalogies?: boolean;
    createTimeline?: boolean; // For historical/sequential topics
    summarize?: boolean;
    targetAudience?: 'student' | 'professional' | 'researcher' | 'beginner';
}

interface AnalysisRequest {
    notes: Note[];
    task: string;
    options?: AnalysisOptions;
    context?: {
        subject?: string;
        course?: string;
        learningObjectives?: string[];
        previousKnowledge?: string;
    };
}

interface AnalysisResponse {
    analysis: string | any;
    questions?: { question: string; answer: string }[];
    flashcards?: { front: string; back: string }[];
    examples?: string[];
    mnemonics?: string[];
    studyPlan?: { topic: string; time: string; resources: string }[];
    connections?: { concept1: string; concept2: string; relationship: string }[];
    resources?: { type: string; title: string; url?: string }[];
    definitions?: { term: string; definition: string }[];
    gaps?: string[];
    analogies?: { concept: string; analogy: string }[];
    timeline?: { event: string; date?: string; description: string }[];
    metadata: {
        requestId: string;
        model: string;
        tokensUsed: number;
        processingTimeMs: number;
        cached?: boolean;
    };
}

export default async function handler(
    req: { method: string; body: AnalysisRequest; ip?: string },
    res: {
        status: (code: number) => {
            json: (data: AnalysisResponse | { error: string; details?: any }) => void;
            end: () => void;
        };
    }
) {
    const startTime = Date.now();
    const requestId = uuidv4();

    // Rate limiting
    try {
        if (req.ip) {
            await rateLimiter.consume(req.ip);
        }
    } catch (rateLimiterRes) {
        return res.status(429).json({
            error: 'Too many requests',
            details: 'Please wait a minute before making another request',
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { notes, task, options, context } = req.body;

    // Input validation
    if (!notes || !Array.isArray(notes)) {
        return res.status(400).json({ error: 'Notes must be an array' });
    }

    if (notes.length === 0) {
        return res.status(400).json({ error: 'No notes provided' });
    }

    if (!task || typeof task !== 'string') {
        return res.status(400).json({ error: 'No task specified' });
    }

    // Check cache if Redis is available
    const cacheKey = redisClient ? `study-ai:${JSON.stringify({ notes, task, options, context })}` : null;
    let cachedResponse = null;

    if (redisClient && cacheKey) {
        try {
            cachedResponse = await redisClient.get(cacheKey);
            if (cachedResponse) {
                return res.status(200).json({
                    ...JSON.parse(cachedResponse),
                    metadata: {
                        ...JSON.parse(cachedResponse).metadata,
                        cached: true,
                        processingTimeMs: Date.now() - startTime,
                    },
                });
            }
        } catch (cacheError) {
            console.error('Cache read error:', cacheError);
        }
    }

    // Build the comprehensive prompt
    let prompt = `You are an advanced AI study assistant with expertise in multiple disciplines. 
  The user has requested help with: ${task}\n\n`;

    // Add context if provided
    if (context) {
        prompt += `Context:\n`;
        if (context.subject) prompt += `- Subject: ${context.subject}\n`;
        if (context.course) prompt += `- Course: ${context.course}\n`;
        if (context.learningObjectives) {
            prompt += `- Learning Objectives: ${context.learningObjectives.join(', ')}\n`;
        }
        if (context.previousKnowledge) {
            prompt += `- Previous Knowledge: ${context.previousKnowledge}\n`;
        }
        prompt += `\n`;
    }

    // Add processing instructions
    prompt += `Processing Instructions:\n`;
    if (options?.format) {
        prompt += `- Format: ${options.format}\n`;
        if (options.format === 'summary-table') {
            prompt += `  Include columns for Concept, Explanation, Importance, and Examples\n`;
        }
    }

    if (options?.complexity) {
        prompt += `- Complexity Level: ${options.complexity}\n`;
    }

    if (options?.targetAudience) {
        prompt += `- Target Audience: ${options.targetAudience}\n`;
    }

    // Add the notes content with metadata if available
    prompt += `\nNotes to analyze:\n\n`;
    notes.forEach((note, index) => {
        prompt += `Note ${index + 1}:\n`;
        if (note.metadata?.source) prompt += `Source: ${note.metadata.source}\n`;
        if (note.metadata?.importance) prompt += `Importance: ${note.metadata.importance}/5\n`;
        if (note.metadata?.tags) prompt += `Tags: ${note.metadata.tags.join(', ')}\n`;
        prompt += `${note.content}\n\n`;
    });

    // Add specific task instructions
    prompt += `\nPlease provide:\n`;
    prompt += `1. A comprehensive analysis of these notes\n`;

    if (options?.summarize !== false) {
        prompt += `2. A concise summary of key points\n`;
    }

    if (options?.highlightKeyConcepts) {
        prompt += `3. Identification and explanation of 3-5 key concepts\n`;
    }

    if (options?.generateQuestions) {
        const numQuestions = typeof options.generateQuestions === 'number'
            ? options.generateQuestions
            : 5;
        prompt += `4. ${numQuestions} study questions with answers to test understanding\n`;
    }

    if (options?.createFlashcards) {
        const numFlashcards = typeof options.createFlashcards === 'number'
            ? options.createFlashcards
            : 5;
        prompt += `5. ${numFlashcards} Anki-style flashcards (front/back format)\n`;
    }

    if (options?.includeExamples) {
        prompt += `6. Practical examples to illustrate key concepts\n`;
    }

    if (options?.generateMnemonics) {
        prompt += `7. Memory aids or mnemonics for difficult concepts\n`;
    }

    if (options?.createStudyPlan) {
        prompt += `8. A suggested study plan covering these topics\n`;
    }

    if (options?.findConnections) {
        prompt += `9. Connections between concepts in these notes\n`;
    }

    if (options?.suggestResources) {
        prompt += `10. Recommended resources for further learning\n`;
    }

    if (options?.extractDefinitions) {
        prompt += `11. Important definitions from the notes\n`;
    }

    if (options?.identifyGaps) {
        prompt += `12. Potential gaps in knowledge or areas needing clarification\n`;
    }

    if (options?.generateAnalogies) {
        prompt += `13. Helpful analogies for complex concepts\n`;
    }

    if (options?.createTimeline) {
        prompt += `14. A timeline of events or development of concepts if applicable\n`;
    }

    // Request structured output
    prompt += `\nStructure your response as a JSON object with the following fields:
  - analysis: string (main analysis content)
  - summary: string (if summarize is true)
  - keyConcepts: array (if highlightKeyConcepts is true)
  - questions: array of {question, answer} (if generateQuestions is true)
  - flashcards: array of {front, back} (if createFlashcards is true)
  - examples: array (if includeExamples is true)
  - mnemonics: array (if generateMnemonics is true)
  - studyPlan: array (if createStudyPlan is true)
  - connections: array (if findConnections is true)
  - resources: array (if suggestResources is true)
  - definitions: array (if extractDefinitions is true)
  - gaps: array (if identifyGaps is true)
  - analogies: array (if generateAnalogies is true)
  - timeline: array (if createTimeline is true)
  
  Return ONLY the JSON object with no additional text or explanation.`;

    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [{ role: 'user', content: prompt }],
            temperature: options?.complexity === 'technical' ? 0.3 : 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" },
        });

        // Parse and validate the response
        let response: AnalysisResponse;
        try {
            response = JSON.parse(completion.choices[0].message.content ?? '{}');
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            throw new Error('AI returned invalid JSON format');
        }

        // Add metadata
        response.metadata = {
            requestId,
            model: 'gpt-4-turbo-preview',
            tokensUsed: completion.usage?.total_tokens || 0,
            processingTimeMs: Date.now() - startTime,
        };

        // Cache the response if Redis is available
        if (redisClient && cacheKey) {
            try {
                await redisClient.set(
                    cacheKey,
                    JSON.stringify(response),
                    'EX',
                    3600
                ); // Cache for 1 hour
            } catch (cacheError) {
                console.error('Cache write error:', cacheError);
            }
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error('AI request failed:', err);
        return res.status(500).json({
            error: 'AI request failed',
            details: err instanceof Error ? err.message : 'Unknown error',
            metadata: {
                requestId,
                model: 'gpt-4-turbo-preview',
                tokensUsed: 0,
                processingTimeMs: Date.now() - startTime,
            },
        });
    }
}