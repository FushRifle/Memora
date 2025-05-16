import { Groq } from 'groq-sdk';

export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: string | null; error?: any; }): void; new(): any; }; }; }) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "user", content: "Hello from Vercel!" }
            ]
        });

        res.status(200).json({ message: response.choices[0].message.content });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
}