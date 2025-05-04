'use client';

import { useState, useRef, useEffect } from 'react';
import {
    FiSend, FiUpload, FiBook, FiMessageSquare,
    FiMic, FiMicOff, FiVolume2, FiVolumeX,
    FiImage, FiFileText, FiX, FiDownload
} from 'react-icons/fi';
import NoteContextSelector from '@/app/components/tutor/NoteContextSelector';
import FilePreviewModal from '@/app/components/tutor/FilePreviewModal';
import ModeSelector from '@/app/components/tutor/ModeSelector';

type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    files?: {
        name: string;
        type: string;
        url: string;
    }[];

    status?: 'sent' | 'received' | 'read';
};

type ConversationMode = 'qa' | 'discussion' | 'explanation' | 'practice';

export default function TutorPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeakEnabled, setIsSpeakEnabled] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewFile, setPreviewFile] = useState<{ url: string, type: string } | null>(null);
    const [conversationMode, setConversationMode] = useState<ConversationMode>('qa');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize with welcome message
    useEffect(() => {
        setMessages([
            {
                id: '1',
                content: 'Hello! I\'m your Memora AI Tutor. How can I help you with your studies today?',
                role: 'assistant',
                timestamp: new Date(),
            },
        ]);

        // Initialize speech recognition if available
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + ' ' + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };
        }
    }, []);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle text-to-speech for AI responses
    const speak = (text: string) => {
        if (!isSpeakEnabled || !('speechSynthesis' in window)) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message with files
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

        // Simulate API call with mode-specific responses
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: generateAIResponse(input, conversationMode),
                role: 'assistant',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiResponse]);
            if (isSpeakEnabled) speak(aiResponse.content);
            setIsLoading(false);
        }, 1000);
    };

    // Enhanced response generator with modes
    const generateAIResponse = (userInput: string, mode: ConversationMode): string => {
        const inputLower = userInput.toLowerCase();

        if (mode === 'qa') {
            return `[Q&A Mode] Answer: ${getFactualResponse(inputLower)}`;
        } else if (mode === 'discussion') {
            return `[Discussion] Let's explore this topic together. ${getDiscussionResponse(inputLower)}`;
        } else if (mode === 'explanation') {
            return `[Explanation] Here's a detailed breakdown:\n\n${getExplanationResponse(inputLower)}`;
        } else if (mode === 'practice') {
            return `[Practice] Try solving these problems:\n\n${getPracticeProblems(inputLower)}`;
        }

        return getDefaultResponse(inputLower);
    };

    // Voice input handler
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

    // File upload handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    // Remove file from selection
    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow overflow-hidden">
            {/* Chat header with mode selector */}
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6 bg-indigo-50 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-600 rounded-md p-2">
                        <FiMessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">AI Tutor</h2>
                        <ModeSelector
                            mode={conversationMode}
                            setMode={setConversationMode}
                        />
                    </div>
                </div>
                <NoteContextSelector />
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-3/4 rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>

                            {/* Display attached files */}
                            {message.files && message.files.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {message.files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center p-2 bg-black bg-opacity-10 rounded cursor-pointer"
                                            onClick={() => setPreviewFile({ url: file.url, type: file.type })}
                                        >
                                            {file.type.startsWith('image/') ? (
                                                <FiImage className="mr-2" />
                                            ) : (
                                                <FiFileText className="mr-2" />
                                            )}
                                            <span className="truncate">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs mt-1 opacity-70">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-3/4">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area with enhanced features */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                {/* Selected files preview */}
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
                            placeholder="Ask a question about your notes..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="absolute right-2 inset-y-0 flex items-center space-x-1">
                            <button
                                type="button"
                                onClick={toggleVoiceInput}
                                className={`p-1 rounded-full ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-500'}`}
                                title={isListening ? 'Stop listening' : 'Voice input'}
                            >
                                {isListening ? <FiMicOff /> : <FiMic />}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSpeakEnabled(!isSpeakEnabled)}
                                className={`p-1 rounded-full ${isSpeakEnabled ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-500'}`}
                                title={isSpeakEnabled ? 'Disable speech' : 'Enable speech'}
                            >
                                {isSpeakEnabled ? <FiVolume2 /> : <FiVolumeX />}
                            </button>
                            <label className="p-1 rounded-full text-gray-400 hover:text-gray-500 cursor-pointer">
                                <FiUpload />
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    multiple
                                    accept="image/*,.pdf,.doc,.docx,.txt"
                                />
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSend className="-ml-1 mr-2 h-5 w-5" />
                        Send
                    </button>
                </form>

                {/* Suggested questions based on mode */}
                <div className="mt-3">
                    <h3 className="text-xs font-medium text-gray-500 mb-1">Try asking:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                        {getSuggestedQuestions(conversationMode).map((question, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(question)}
                                className="text-left text-xs p-1 rounded border border-gray-200 hover:bg-gray-100 truncate"
                                title={question}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* File preview modal */}
            <FilePreviewModal
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
        </div>
    );
}

// Helper functions for generating responses
function getFactualResponse(input: string): string {
    if (input.includes('biology') || input.includes('cell')) {
        return "Cells are the basic structural and functional units of all living organisms. There are two main types: prokaryotic (bacteria) and eukaryotic (plants, animals).";
    } else if (input.includes('math') || input.includes('calculus')) {
        return "The derivative of a function represents its instantaneous rate of change at any point. Basic rules include power rule (d/dx x^n = nx^(n-1)) and chain rule.";
    }
    return "I can provide factual answers to specific questions about your study materials.";
}

function getDiscussionResponse(input: string): string {
    if (input.includes('biology')) {
        return "What aspects of cell biology interest you most? We could discuss cellular processes like mitosis, or compare prokaryotic vs eukaryotic cells.";
    }
    return "Let's explore this topic together. What specific aspects would you like to discuss further?";
}

function getExplanationResponse(input: string): string {
    if (input.includes('derivative')) {
        return "1. Start with the function you want to differentiate\n2. Apply the power rule to each term\n3. For composite functions, use the chain rule\n4. Simplify the resulting expression\n\nExample: d/dx (3x^2 + 2x) = 6x + 2";
    }
    return "Here's a step-by-step explanation: [Detailed explanation would go here based on the question]";
}

function getPracticeProblems(input: string): string {
    if (input.includes('calculus')) {
        return "1. Find the derivative of f(x) = 3x^4 - 2x^2 + 5\n2. A ball is thrown upward with velocity v(t) = 20 - 9.8t. Find when it reaches maximum height.\n\nWould you like me to check your answers?";
    }
    return "Practice Problem 1: [Generated problem]\nPractice Problem 2: [Generated problem]";
}

function getDefaultResponse(input: string): string {
    return "I can help explain concepts, generate practice questions, or summarize material. Could you be more specific?";
}

function getSuggestedQuestions(mode: ConversationMode): string[] {
    if (mode === 'qa') {
        return [
            "What is the cell theory?",
            "Define photosynthesis",
            "What are the laws of thermodynamics?"
        ];
    } else if (mode === 'discussion') {
        return [
            "Let's debate the ethics of genetic engineering",
            "Discuss the impact of WWII on technology",
            "Compare classical and operant conditioning"
        ];
    } else if (mode === 'explanation') {
        return [
            "Explain cellular respiration step by step",
            "How does the Krebs cycle work?",
            "Walk me through protein synthesis"
        ];
    } else if (mode === 'practice') {
        return [
            "Give me 2 calculus problems about limits",
            "Create a biology quiz about cell structure",
            "Generate practice questions for my history exam"
        ];
    }
    return [];
}