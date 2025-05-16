// pages/api/assistant.ts

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { message } = req.body;

        // 1. Create a thread (or persist it per user if you want memory)
        const thread = await openai.beta.threads.create();

        // 2. Add a user message to the thread
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: message,
        });

        // 3. Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: 'asst_BtHovIg7U3qK61ciLuWvot8o',
        });

        // 4. Poll until complete (in production, use webhooks or background tasks)
        let runStatus;
        do {
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            if (runStatus.status === 'completed') break;
            await new Promise((r) => setTimeout(r, 1000)); // wait 1s
        } while (runStatus.status === 'queued' || runStatus.status === 'in_progress');

        // 5. Get the assistant's reply
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantReply = messages.data.find((m) => m.role === 'assistant');
        let replyText = 'No reply';
        if (assistantReply && Array.isArray(assistantReply.content)) {
            const textBlock = assistantReply.content.find(
                (block: any) => block.type === 'text' && typeof block.text === 'object' && block.text !== null && typeof block.text.value === 'string'
            );
            if (textBlock && textBlock.type === 'text' && typeof textBlock.text === 'object' && textBlock.text !== null) {
                replyText = textBlock.text.value;
            }
        }

        return res.status(200).json({ reply: replyText });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
}
