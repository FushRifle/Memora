'use client';

import { format, isToday, isTomorrow } from 'date-fns';
import { FiCheck, FiClock, FiEdit2 } from 'react-icons/fi';
import Link from 'next/link';

interface StudySession {
    id: string;
    title: string;
    course: string;
    date: Date;
    duration: number;
    description: string;
    completed: boolean;
}

export default function ListView({ sessions }: { sessions: StudySession[] }) {
    const getDateLabel = (date: Date) => {
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'EEEE, MMMM do');
    };

    const upcomingSessions = sessions
        .filter((session) => !session.completed)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const pastSessions = sessions
        .filter((session) => session.completed)
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Upcoming Sessions</h3>
                {upcomingSessions.length > 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {upcomingSessions.map((session) => (
                                <li key={session.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center">
                                                        <p className="text-sm font-medium text-indigo-600 truncate">
                                                            {session.course}: {session.title}
                                                        </p>
                                                    </div>
                                                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            <span>
                                                                {getDateLabel(session.date)} •{' '}
                                                                {format(session.date, 'h:mm a')} (
                                                                {session.duration} mins)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        {session.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                                                <Link
                                                    href={`/dashboard/schedule/${session.id}/edit`}
                                                    className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <FiEdit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <FiCheck className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                        <p className="text-gray-500">No upcoming study sessions</p>
                    </div>
                )}
            </div>

            {pastSessions.length > 0 && (
                <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">Completed Sessions</h3>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {pastSessions.map((session) => (
                                <li key={session.id} className="bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center">
                                                        <p className="text-sm font-medium text-gray-600 truncate line-through">
                                                            {session.course}: {session.title}
                                                        </p>
                                                    </div>
                                                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            <span>
                                                                {format(session.date, 'MMM d, yyyy h:mm a')} (
                                                                {session.duration} mins)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}