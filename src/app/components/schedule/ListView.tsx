'use client';

import { FiClock, FiPlus } from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
interface ListViewProps {
    sessions: StudySession[];
}

interface StudySession {
    id: string;
    user_id: string;
    title: string;
    start_time: Date;
    end_time: Date;
    type: string;
    created_at: Date;
}

export default function ListView({ sessions }: ListViewProps) {
    const formatDuration = (start: Date, end: Date) => {
        const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = Math.floor(diffInMinutes % 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const getTypeBadge = (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
            study: { color: 'bg-blue-100 text-blue-800', text: 'Study' },
            reading: { color: 'bg-green-100 text-green-800', text: 'Reading' },
            project: { color: 'bg-red-100 text-red-800', text: 'Project' },
            default: { color: 'bg-gray-100 text-gray-800', text: 'Other' },
        };

        const selected = typeMap[type] || typeMap.default;
        return (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${selected.color}`}>
                {selected.text}
            </span>
        );
    };

    if (sessions.length === 0) {
        return (
            <div className="mt-6 text-center">
                <div className="p-8 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900">No scheduled sessions</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Get started by adding a new session or generating a schedule.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Link
                            href="/dashboard/schedule/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <FiPlus className="-ml-1 mr-1.5 h-4 w-4" />
                            Add Session
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Title
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Type
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Date
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Time
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Duration
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {sessions.map((session) => (
                                    <tr key={session.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {session.title}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {getTypeBadge(session.type)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {format(new Date(session.start_time), 'MMM d, yyyy')}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {format(new Date(session.start_time), 'h:mm a')} - {format(new Date(session.end_time), 'h:mm a')}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                {formatDuration(new Date(session.start_time), new Date(session.end_time))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}