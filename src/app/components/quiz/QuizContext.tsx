'use client';

import { useEffect, useState, useCallback } from 'react';
import { FiBook, FiX, FiCheck } from 'react-icons/fi';
import { supabase } from '@/lib/client';
import { useAuth } from '@/providers/AuthProvider';

interface Course {
    id: string;
    title: string;
    color: string;
}

export interface Note {
    id: string;
    user_id: string;
    content: string;
    processed_at: string | null;
    status: string;
    course_id: string;
    created_at: string;
    title: string;
    type: string;
    course?: Course;
}

interface NoteContextSelectorProps {
    noteType?: string;
    disabled?: boolean;
    isOpen: boolean;
    selectedNotes: Note[];
    onToggleOpen: () => void;
    onSelectionChange: (selectedNotes: Note[]) => void;
}

export default function NoteContextSelector({
    noteType = 'lecture',
    disabled = false,
    isOpen,
    selectedNotes = [],
    onToggleOpen,
    onSelectionChange,
}: NoteContextSelectorProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchNotes = async () => {
            if (!user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('notes')
                    .select(`
            id,
            user_id,
            content,
            processed_at,
            status,
            course_id,
            created_at,
            title,
            type,
            course:course_id (id, title, color)
          `)
                    .eq('type', noteType)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) {
                    // Map course from array to single object
                    setNotes(
                        data.map((note: any) => ({
                            ...note,
                            course: Array.isArray(note.course) ? note.course[0] : note.course,
                        }))
                    );
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, [noteType, user?.id]);

    const isNoteSelected = useCallback(
        (noteId: string) => selectedNotes.some(note => note.id === noteId),
        [selectedNotes]
    );

    const handleToggleSelection = useCallback(
        (note: Note) => {
            if (isNoteSelected(note.id)) {
                onSelectionChange(selectedNotes.filter(n => n.id !== note.id));
            } else {
                onSelectionChange([...selectedNotes, note]);
            }
        },
        [selectedNotes, onSelectionChange, isNoteSelected]
    );

    return (
        <div className="relative">
            <button
                onClick={onToggleOpen}
                disabled={disabled}
                className={`inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
            >
                <FiBook className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                {selectedNotes.length > 0 ? (
                    <span className="mr-2">{selectedNotes.length} selected</span>
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
                                onClick={onToggleOpen}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {notes.length === 0 ? (
                                <p className="text-sm text-gray-500 p-2">No notes available</p>
                            ) : (
                                notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        onClick={() => handleToggleSelection(note)}
                                    >
                                        <div
                                            className={`flex-shrink-0 h-4 w-4 rounded border ${isNoteSelected(note.id)
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : 'border-gray-300'
                                                } flex items-center justify-center`}
                                        >
                                            {isNoteSelected(note.id) && <FiCheck className="h-3 w-3" />}
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                                            {note.course && (
                                                <p className="text-xs text-gray-500 truncate">
                                                    {note.course.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            onClick={onToggleOpen}
                            className="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}