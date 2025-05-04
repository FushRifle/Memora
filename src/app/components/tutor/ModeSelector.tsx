'use client';

import { useState } from 'react';

type ConversationMode = 'qa' | 'discussion' | 'explanation' | 'practice';

export default function ModeSelector({
    mode,
    setMode
}: {
    mode: ConversationMode;
    setMode: (mode: ConversationMode) => void;
}) {
    const modes = [
        { id: 'qa', label: 'Q&A', description: 'Factual answers' },
        { id: 'discussion', label: 'Discussion', description: 'Open dialogue' },
        { id: 'explanation', label: 'Explanation', description: 'Step-by-step' },
        { id: 'practice', label: 'Practice', description: 'Problems & quizzes' },
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center text-xs font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Mode: {modes.find(m => m.id === mode)?.label}
                    <svg
                        className="-mr-1 ml-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        {modes.map((m) => (
                            <button
                                key={m.id}
                                className={`block w-full text-left px-4 py-2 text-sm ${mode === m.id ? 'bg-indigo-100 text-indigo-900' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => {
                                    setMode(m.id as ConversationMode);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="font-medium">{m.label}</div>
                                <div className="text-xs text-gray-500">{m.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}