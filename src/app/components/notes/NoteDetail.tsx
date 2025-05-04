import { FiBook, FiCalendar, FiDownload, FiEdit2, FiLink, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import MarkdownPreview from '@/app/components/MarkdownPreview';

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

export default function NoteDetail({ note }: { note: Note }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{note.title}</h2>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <FiBook className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{note.course}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Link
                        href={`/dashboard/notes/${note.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiEdit2 className="-ml-1 mr-1.5 h-4 w-4" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiDownload className="-ml-1 mr-1.5 h-4 w-4" />
                        Download
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>Created {note.date} • Last edited {note.lastEdited}</span>
                        </div>
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {note.type}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <MarkdownPreview content={note.content} />
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