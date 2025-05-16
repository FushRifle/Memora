import { FiHelpCircle, FiMessageSquare, FiBookOpen, FiActivity, FiFileText } from 'react-icons/fi';

type ConversationMode = 'qa' | 'discussion' | 'explanation' | 'practice' | 'analyze';

export default function ModeSelector({
    mode,
    setMode,
    showAnalysisOption = false
}: {
    mode: ConversationMode;
    setMode: (mode: ConversationMode) => void;
    showAnalysisOption: boolean;
}) {
    const modes = [
        { id: 'qa', label: 'Q&A', icon: <FiHelpCircle className="mr-1" /> },
        { id: 'discussion', label: 'Discuss', icon: <FiMessageSquare className="mr-1" /> },
        { id: 'explanation', label: 'Explain', icon: <FiBookOpen className="mr-1" /> },
        { id: 'practice', label: 'Practice', icon: <FiActivity className="mr-1" /> },
    ];

    if (showAnalysisOption) {
        modes.push({ id: 'analyze', label: 'Analyze', icon: <FiFileText className="mr-1" /> });
    }

    return (
        <div className="flex space-x-3 mt-3">
            <span> Modes: </span>
            {modes.map((m) => (
                <button
                    key={m.id}
                    onClick={() => setMode(m.id as ConversationMode)}
                    className={`flex items-center text-sm px-2 py-1 rounded ${mode === m.id ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {m.icon}
                    {m.label}
                </button>
            ))}
        </div>
    );
}