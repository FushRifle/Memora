import { useEffect, useState } from 'react';
import { FiBook, FiX, FiCheck } from 'react-icons/fi';
import { supabase } from '@/lib/client';
import { useAuth } from '@/providers/AuthProvider'; // your auth context/hook

interface Course {
    id: string;
    title: string;
    color: string;
}

interface Note {
    id: string;
    user_id: string;
    content: string;
    processed_at: string | null;
    status: string;
    course_id: string;
    created_at?: string;
    title?: string;
    type?: string;
    course?: Course;
    selected?: boolean;
}

export default function NoteContextSelector({ noteType = 'lecture' }: { noteType?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const { user } = useAuth(); // replace with your auth hook

    useEffect(() => {
        const fetchNotes = async () => {
            if (!user?.id) return;

            const { data, error } = await supabase
                .from('notes')
                .select(`
          *,
          course:course_id (id, title, color)
        `)
                .eq('type', noteType)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching notes:', error.message);
            } else {
                const formattedNotes = data.map((note) => ({
                    ...note,
                    selected: false,
                }));
                setNotes(formattedNotes);
            }
        };

        fetchNotes();
    }, [noteType, user?.id]);

    const toggleNoteSelection = (id: string) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === id ? { ...note, selected: !note.selected } : note
            )
        );
    };

    const selectedNotesCount = notes.filter((note) => note.selected).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <FiBook className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                {selectedNotesCount > 0 ? (
                    <span className="mr-2">{selectedNotesCount} selected</span>
                ) : (
                    <span className="mr-2">Select notes</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Select notes for context</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                    onClick={() => toggleNoteSelection(note.id)}
                                >
                                    <div
                                        className={`flex-shrink-0 h-4 w-4 rounded border ${note.selected
                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                            : 'border-gray-300'
                                            } flex items-center justify-center`}
                                    >
                                        {note.selected && <FiCheck className="h-3 w-3" />}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{note.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                        >
                            Apply Selection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
