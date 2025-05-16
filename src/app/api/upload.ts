// /pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { extractTextFromPdf } from './lib/pdf-extractor';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = new formidable.IncomingForm();
        const [_, files] = await form.parse(req);

        if (!files || !files.files) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const fileArray = Array.isArray(files.files) ? files.files : [files.files];
        let combinedText = '';

        for (const file of fileArray) {
            const filePath = file.filepath;
            const fileContent = fs.readFileSync(filePath);

            if (file.mimetype === 'application/pdf') {
                combinedText += await extractTextFromPdf(fileContent);
            } else {
                combinedText += fileContent.toString();
            }
        }

        return res.status(200).json({ textContent: combinedText });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'File processing failed' });
    }
}