import NoteList from '@/app/components/notes/NoteList';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function NotesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">All Notes</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage all your study notes
                    </p>
                </div>
                <Link
                    href="/dashboard/notes/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                    Add Note
                </Link>
            </div>

            <NoteList />
        </div>
    );
}