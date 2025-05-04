import { FiFileText, FiDownload, FiTrash2, FiSearch } from 'react-icons/fi';
import { useState } from 'react';

interface Note {
    id: string;
    title: string;
    type: 'lecture' | 'handwritten' | 'book' | 'other';
    date: string;
    size: string;
    processed: boolean;
}

export default function CourseNotes({ courseId }: { courseId: string }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock notes data - replace with actual API calls
    const notes: Note[] = [
        {
            id: '1',
            title: 'Lecture 1 - Introduction to Biology',
            type: 'lecture',
            date: '2023-10-15',
            size: '2.4 MB',
            processed: true,
        },
        {
            id: '2',
            title: 'Chapter 3 - Cell Structures',
            type: 'book',
            date: '2023-10-18',
            size: '1.8 MB',
            processed: true,
        },
        {
            id: '3',
            title: 'Handwritten Notes - Genetics',
            type: 'handwritten',
            date: '2023-10-22',
            size: '3.1 MB',
            processed: false,
        },
        {
            id: '4',
            title: 'Research Paper - Evolutionary Biology',
            type: 'other',
            date: '2023-10-25',
            size: '4.2 MB',
            processed: true,
        },
    ];

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'lecture':
                return 'bg-blue-100 text-blue-800';
            case 'handwritten':
                return 'bg-purple-100 text-purple-800';
            case 'book':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Course Notes</h2>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredNotes.map((note) => (
                        <li key={note.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiFileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-indigo-600 truncate">
                                                {note.title}
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                                                        note.type
                                                    )}`}
                                                >
                                                    {note.type}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {note.date} • {note.size}
                                                </span>
                                                {!note.processed && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Processing
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            disabled={!note.processed}
                                        >
                                            <FiDownload className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <FiTrash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Upload New Notes
                </button>
            </div>
        </div>
    );
}