"use client";
import {
    FiBook, FiCalendar, FiDownload, FiEdit2,
    FiLink, FiTrash2, FiSave, FiX
} from 'react-icons/fi';
import Link from 'next/link';
import MarkdownPreview from '@/app/components/MarkdownPreview';
import { useState } from 'react';

interface Note {
    id: string;
    title: string;
    course: string;
    type: 'lecture' | 'handwritten' | 'book' | 'other';
    content: string;
    date: string;
    lastEdited: string;
    relatedNotes: string[];
}

export default function NoteDetail({ note: initialNote }: { note: Note }) {
    const [isEditing, setIsEditing] = useState(false);
    const [note, setNote] = useState<Note>(initialNote);
    const [editedNote, setEditedNote] = useState<Note>({ ...initialNote });

    const handleEdit = () => {
        setEditedNote({ ...note });
        setIsEditing(true);
    };

    const handleSave = () => {
        const updatedNote = {
            ...editedNote,
            lastEdited: 'Just now',
            date: new Date().toISOString().split('T')[0]
        };
        setNote(updatedNote);
        setIsEditing(false);
        // Add API call to save the note here
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedNote(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                {isEditing ? (
                    <div className="w-full">
                        <input
                            type="text"
                            name="title"
                            value={editedNote.title}
                            onChange={handleChange}
                            className="text-2xl font-bold text-gray-900 w-full p-2 border border-gray-300 rounded-md"
                        />
                        <div className="mt-2 flex items-center">
                            <FiBook className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                name="course"
                                value={editedNote.course}
                                onChange={handleChange}
                                className="text-sm text-gray-500 w-full p-1 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{note.title}</h2>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FiBook className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{note.course}</span>
                        </div>
                    </div>
                )}

                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                <FiX className="-ml-1 mr-1.5 h-4 w-4" />
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                <FiSave className="-ml-1 mr-1.5 h-4 w-4" />
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                <FiEdit2 className="-ml-1 mr-1.5 h-4 w-4" />
                                Edit
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                <FiDownload className="-ml-1 mr-1.5 h-4 w-4" />
                                Download
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {isEditing ? (
                            <div className="flex items-center">
                                <select
                                    name="type"
                                    value={editedNote.type}
                                    onChange={handleChange}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300"
                                >
                                    <option value="lecture">Lecture</option>
                                    <option value="handwritten">Handwritten</option>
                                    <option value="book">Book</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                    <span>Created {note.date} • Last edited {note.lastEdited}</span>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {note.type}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    {isEditing ? (
                        <textarea
                            name="content"
                            value={editedNote.content}
                            onChange={handleChange}
                            rows={15}
                            className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
                        />
                    ) : (
                        <MarkdownPreview content={note.content} />
                    )}
                </div>
            </div>

            {note.relatedNotes.length > 0 && (
                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Related Notes</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <ul className="space-y-2">
                            {note.relatedNotes.map((relatedNote) => (
                                <li key={relatedNote} className="flex items-center">
                                    <FiLink className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                                    <Link
                                        href="#"
                                        className="text-indigo-600 hover:text-indigo-500"
                                    >
                                        {relatedNote}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}