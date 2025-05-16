'use client';
import { useState, useRef, useEffect } from 'react';
import {
    FiSend, FiUpload, FiBook, FiMessageSquare,
    FiMic, FiMicOff, FiVolume2, FiVolumeX,
    FiImage, FiFileText, FiX, FiLoader
} from 'react-icons/fi';
import NoteContextSelector from '@/app/components/tutor/NoteContextSelector';
import FilePreviewModal from '@/app/components/tutor/FilePreviewModal';
import ModeSelector from '@/app/components/tutor/ModeSelector';
import LimitModal from '@/app/components/tutor/LimitsModal';

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface SpeechRecognition extends EventTarget {
    new(): SpeechRecognition;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

interface AnalysisOptions {
    format?: 'bullet-points' | 'paragraph' | 'summary-table';
    complexity?: 'simple' | 'detailed' | 'technical';
    includeExamples?: boolean;
    generateQuestions?: number;
    highlightKeyConcepts?: boolean;
}

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    files?: {
        name: string;
        type: string;
        url: string;
    }[];
    analysisData?: any;
}

type ConversationMode = 'qa' | 'discussion' | 'explanation' | 'practice' | 'analyze';

export default function TutorPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeakEnabled, setIsSpeakEnabled] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewFile, setPreviewFile] = useState<{ url: string, type: string, name: string } | null>(null);
    const [conversationMode, setConversationMode] = useState<ConversationMode>('qa');
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions>({
        format: 'bullet-points',
        complexity: 'detailed',
        generateQuestions: 3,
        highlightKeyConcepts: true
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        setShowLimitModal(true);
        setMessages([{
            id: '1',
            content: 'Hello! I\'m Memora, your AI study assistant. Upload notes or ask questions to get started!',
            role: 'assistant',
            timestamp: new Date(),
        }]);

        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            if (recognitionRef.current) {
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(prev => prev ? `${prev} ${transcript}` : transcript);
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speak = (text: string) => {
        if (!isSpeakEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const extractTextFromFile = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            if (file.type.startsWith('text/')) {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result?.toString() || '');
                reader.readAsText(file);
            } else {
                resolve(`[File content for ${file.name} would be extracted here]`);
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && selectedFiles.length === 0) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            timestamp: new Date(),
            files: selectedFiles.map(file => ({
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file)
            }))
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setSelectedFiles([]);
        setIsLoading(true);

        try {
            let responseContent = '';
            let analysisData = null;

            if (conversationMode === 'analyze' && selectedFiles.length > 0) {
                const fileContents = await Promise.all(selectedFiles.map(extractTextFromFile));
                const notes = fileContents.map((content, index) => ({
                    content,
                    metadata: { source: selectedFiles[index].name }
                }));

                const response = await fetch('/api/assistant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notes,
                        task: input || 'Analyze these notes',
                        options: analysisOptions
                    }),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || result.details || 'API request failed');
                }

                responseContent = result.analysis;
                analysisData = result;
            } else {
                const response = await fetch('/api/study-ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notes: [],
                        task: input,
                        options: { ...analysisOptions, format: 'paragraph' }
                    }),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || result.details || 'API request failed');
                }

                responseContent = result.analysis;
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: responseContent,
                role: 'assistant',
                timestamp: new Date(),
                analysisData
            };

            setMessages(prev => [...prev, aiResponse]);
            if (isSpeakEnabled) speak(aiResponse.content);
        } catch (error) {
            console.error('API Error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                content: error instanceof Error ? error.message : 'Service unavailable',
                role: 'assistant',
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition not supported in your browser');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);

            if (files.length > 0 && conversationMode !== 'analyze') {
                setMessages(prev => [...prev, {
                    id: `suggestion-${Date.now()}`,
                    content: 'I see you uploaded files. Switch to "Analyze" mode for detailed analysis.',
                    role: 'assistant',
                    timestamp: new Date(),
                }]);
            }
        }
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleFilePreview = (file: { url: string, type: string, name: string }) => {
        setPreviewFile(file);
    };

    const renderAnalysisResults = (analysisData: any) => {
        if (!analysisData) return null;

        return (
            <div className="mt-4 border-t pt-3">
                {analysisData.summary && (
                    <div className="mb-3">
                        <h4 className="font-semibold text-sm mb-1">Summary</h4>
                        <p className="text-sm whitespace-pre-wrap">{analysisData.summary}</p>
                    </div>
                )}

                {analysisData.keyConcepts && analysisData.keyConcepts.length > 0 && (
                    <div className="mb-3">
                        <h4 className="font-semibold text-sm mb-1">Key Concepts</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {analysisData.keyConcepts.map((concept: string, i: number) => (
                                <li key={i}>{concept}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {analysisData.questions && analysisData.questions.length > 0 && (
                    <div className="mb-3">
                        <h4 className="font-semibold text-sm mb-1">Study Questions</h4>
                        <div className="space-y-2">
                            {analysisData.questions.map((q: any, i: number) => (
                                <div key={i} className="bg-blue-50 p-2 rounded">
                                    <p className="font-medium text-sm">Q: {q.question}</p>
                                    <p className="text-sm mt-1">A: {q.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-[40rem] overflow-hidden flex flex-col bg-white rounded-lg shadow overflow-hidden">
            <LimitModal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
            />

            <div className="border-b border-gray-200 px-4 py-5 sm:px-6 bg-indigo-50 flex justify-between items-center">
                <div className="flex items-center">
                    <img src={'/images/memora.png'}
                        className='w-12 h-12 mx-auto' />
                    <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">AI Study Assistant</h2>
                        <ModeSelector
                            mode={conversationMode}
                            setMode={setConversationMode}
                            showAnalysisOption={selectedFiles.length > 0}
                        />
                    </div>
                </div>
                <NoteContextSelector />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-3/4 rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            {message.files && message.files.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {message.files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center p-2 bg-black bg-opacity-10 rounded cursor-pointer hover:bg-opacity-20"
                                            onClick={() => handleFilePreview(file)}
                                        >
                                            {file.type.startsWith('image/') ? <FiImage className="mr-2" /> : <FiFileText className="mr-2" />}
                                            <span className="truncate max-w-xs">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {message.analysisData && renderAnalysisResults(message.analysisData)}
                            <p className="text-xs mt-1 opacity-70">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-3/4 flex items-center">
                            <FiLoader className="animate-spin mr-2" />
                            Processing your request...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
                {selectedFiles.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center bg-white px-2 py-1 rounded text-xs border">
                                <span className="truncate max-w-xs">{file.name}</span>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="ml-1 text-gray-500 hover:text-red-500"
                                >
                                    <FiX className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 pr-20"
                            placeholder={
                                conversationMode === 'analyze' ?
                                    "What would you like me to analyze?" :
                                    "Ask a question or upload notes"
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <div className="absolute right-2 inset-y-0 flex items-center space-x-1">
                            <button
                                type="button"
                                onClick={toggleVoiceInput}
                                className={`p-1 rounded-full ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-500'}`}
                                disabled={isLoading}
                            >
                                {isListening ? <FiMicOff /> : <FiMic />}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSpeakEnabled(!isSpeakEnabled)}
                                className={`p-1 rounded-full ${isSpeakEnabled ? 'text-indigo-600' : 'text-gray-400'}`}
                            >
                                {isSpeakEnabled ? <FiVolume2 /> : <FiVolumeX />}
                            </button>
                        </div>
                    </div>
                    <label className="flex items-center px-3 rounded bg-white border border-gray-300 cursor-pointer hover:bg-gray-100">
                        <FiUpload />
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isLoading}
                            accept=".pdf,.doc,.docx,.txt,.md,.jpg,.png"
                        />
                    </label>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                        disabled={isLoading || (!input.trim() && selectedFiles.length === 0)}
                    >
                        <FiSend />
                    </button>
                </form>
            </div>

            {previewFile && (
                <FilePreviewModal
                    file={{ url: previewFile.url, type: previewFile.type }}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </div>
    );
}