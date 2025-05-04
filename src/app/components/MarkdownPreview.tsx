import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
    content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
    return (
        <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );
}