'use client';

import { useState } from 'react';
import { FiFileText, FiDownload, FiTrash2, FiSearch, FiBook, FiEdit2 } from 'react-icons/fi';
import Link from 'next/link';

interface Note {
    id: string;
    title: string;
    course: string;
    type: 'lecture' | 'handwritten' | 'book' | 'other';
    date: string;
    size: string;
    processed: boolean;
    lastEdited: string;
}

export default function NoteList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Mock notes data - replace with actual API calls
    const notes: Note[] = [
        {
            id: '1',
            title: 'Lecture 1 - Introduction to Biology',
            course: 'Biology 101',
            type: 'lecture',
            date: '2023-10-15',
            size: '2.4 MB',
            processed: true,
            lastEdited: '2 days ago',
        },
        {
            id: '2',
            title: 'Chapter 3 - Cell Structures',
            course: 'Biology 101',
            type: 'book',
            date: '2023-10-18',
            size: '1.8 MB',
            processed: true,
            lastEdited: '1 week ago',
        },
        {
            id: '3',
            title: 'Handwritten Notes - Genetics',
            course: 'Biology 101',
            type: 'handwritten',
            date: '2023-10-22',
            size: '3.1 MB',
            processed: false,
            lastEdited: '3 days ago',
        },
        {
            id: '4',
            title: 'Research Paper - Evolutionary Biology',
            course: 'Biology 101',
            type: 'other',
            date: '2023-10-25',
            size: '4.2 MB',
            processed: true,
            lastEdited: '1 day ago',
        },
        {
            id: '5',
            title: 'Derivatives Lecture Notes',
            course: 'Calculus II',
            type: 'lecture',
            date: '2023-10-16',
            size: '2.1 MB',
            processed: true,
            lastEdited: '5 days ago',
        },
    ];

    const filteredNotes = notes
        .filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(note => selectedFilter === 'all' || note.course === selectedFilter);

    const courses = Array.from(new Set(notes.map(note => note.course)));

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="block w-[50rem] pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="course-filter" className="text-sm text-gray-500">
                        Filter by:
                    </label>
                    <select
                        id="course-filter"
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="all">All Courses</option>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <li key={note.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center min-w-0">
                                            <FiFileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                            <div className="ml-4 min-w-0">
                                                <div className="flex items-center">
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        {note.title}
                                                    </p>
                                                    <span
                                                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                                                            note.type
                                                        )}`}
                                                    >
                                                        {note.type}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <FiBook className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                        <span>{note.course}</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <span>Uploaded {note.date}</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <span>{note.size}</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <span>Edited {note.lastEdited}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-2 flex-shrink-0 flex space-x-2">
                                            <Link
                                                href={`notes/${note.id}`}
                                                className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <FiEdit2 className="h-4 w-4" />
                                            </Link>
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
                        ))
                    ) : (
                        <li className="px-4 py-6 text-center">
                            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchQuery
                                    ? 'No notes match your search criteria'
                                    : 'Get started by uploading a new note'}
                            </p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}