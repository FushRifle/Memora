'use client';

import { useState, useEffect } from 'react';
import {
    FiFileText, FiDownload, FiTrash2,
    FiSearch, FiBook, FiEdit2,
    FiX
} from 'react-icons/fi';
import { BsSortAlphaDown, BsSortDown, BsSortUp } from 'react-icons/bs';
import Link from 'next/link';
import { supabase } from '@/lib/client';

interface Course {
    id: string;
    title: string;
    color?: string;
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
}

interface NoteListProps {
    courses: Course[];
    onNoteDeleted?: (noteId: string) => void;
}

export default function NoteList({ courses, onNoteDeleted }: NoteListProps) {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{
        key: 'processed_at' | 'course' | 'status';
        direction: 'ascending' | 'descending';
    }>({ key: 'processed_at', direction: 'descending' });

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                setError(null);
                let query = supabase
                    .from('notes')
                    .select(`
                        *,
                        courses!notes_course_id_fkey (
                          id,
                          title,
                          color
                        )
                      `);

                const sortField = sortConfig.key === 'course' ? 'courses.title' : sortConfig.key;
                query = query.order(sortField, {
                    ascending: sortConfig.direction === 'ascending'
                });

                const { data, error } = await query;

                if (error) throw error;

                setNotes(data || []);
            } catch (error) {
                console.error('Error fetching notes:', error);
                setError('Failed to load notes');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [sortConfig]);

    const handleSort = (key: 'processed_at' | 'course' | 'status') => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDelete = async (noteId: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', noteId);

            if (error) throw error;

            setNotes(notes.filter(note => note.id !== noteId));
            if (onNoteDeleted) {
                onNoteDeleted(noteId);
            }
            if (selectedNote?.id === noteId) {
                setSelectedNote(null);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            setError('Failed to delete note');
        }
    };

    const filteredNotes = notes
        .filter(note => note.content.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(note => selectedFilter === 'all' || note.course_id === selectedFilter);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'processed':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const SortIcon = ({ sortKey }: { sortKey: typeof sortConfig.key }) => {
        if (sortConfig.key !== sortKey) return <BsSortAlphaDown className="h-4 w-4" />;
        return sortConfig.direction === 'ascending'
            ? <BsSortUp className="h-4 w-4" />
            : <BsSortDown className="h-4 w-4" />;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search note..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="course-filter" className="text-sm text-gray-500">
                        Filter:
                    </label>
                    <select
                        id="course-filter"
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md cursor-pointer"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="all">All Courses</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 sm:px-6">
                    <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                            className="flex items-center px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => handleSort('processed_at')}
                        >
                            <span className="mr-1">Date</span>
                            <SortIcon sortKey="processed_at" />
                        </button>
                        <button
                            className="flex items-center px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => handleSort('course')}
                        >
                            <span className="mr-1">Course</span>
                            <SortIcon sortKey="course" />
                        </button>
                        <button
                            className="flex items-center px-3 py-2 hover:bg-gray-100 rounded ml-auto cursor-pointer"
                            onClick={() => handleSort('status')}
                        >
                            <span className="mr-1">Status</span>
                            <SortIcon sortKey="status" />
                        </button>
                    </div>
                </div>

                <ul className="divide-y divide-gray-200">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <li
                                key={note.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => setSelectedNote(note)}
                            >
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center min-w-0">
                                            <FiFileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                            <div className="ml-4 min-w-0">
                                                <div className="flex items-center">
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        {note.title || note.content.split('\n')[0].substring(0, 60)}...
                                                    </p>
                                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
                                                        {note.status}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <FiBook className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                        <span style={{ color: note.course?.color }}>
                                                            {note.course?.title || 'Unassigned'}
                                                        </span>
                                                    </div>
                                                    {note.created_at && (
                                                        <div className="mt-1 flex items-center text-sm text-gray-500 sm:mt-0">
                                                            <span>
                                                                Created: {new Date(note.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {note.processed_at && (
                                                        <div className="mt-1 flex items-center text-sm text-gray-500 sm:mt-0">
                                                            <span>
                                                                Processed: {new Date(note.processed_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {note.type && (
                                                        <div className="mt-1 flex items-center text-sm text-gray-500 sm:mt-0">
                                                            <span>
                                                                Type: {note.type}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-2 flex-shrink-0 flex space-x-2">
                                            <Link
                                                href={`/pages/notes/${note.id}`}
                                                className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FiEdit2 className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                                disabled={note.status !== 'processed'}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Add download functionality here
                                                }}
                                            >
                                                <FiDownload className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(note.id);
                                                }}
                                                className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
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
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                {notes.length === 0 ? 'No notes available' : 'No notes match your search criteria'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {notes.length === 0 ? 'Get started by creating a new note' : 'Try adjusting your search or filter'}
                            </p>
                        </li>
                    )}
                </ul>
            </div>

            {/* Note Details Modal */}
            {selectedNote && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {selectedNote.title || "Untitled Note"}
                                </h2>
                                <button
                                    onClick={() => setSelectedNote(null)}
                                    className="text-gray-400 hover:text-gray-500 cursor-pointer"
                                >
                                    <FiX className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Course</h3>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {selectedNote.course?.title || 'Unassigned'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                    <p className="mt-1 text-sm text-gray-900">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedNote.status)}`}>
                                            {selectedNote.status}
                                        </span>
                                    </p>
                                </div>

                                {selectedNote.created_at && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Created</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(selectedNote.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {selectedNote.processed_at && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Processed</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(selectedNote.processed_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Content</h3>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {selectedNote.content}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => handleDelete(selectedNote.id)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <FiTrash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </button>
                                <Link
                                    href={`/pages/notes/${selectedNote.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <FiEdit2 className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}