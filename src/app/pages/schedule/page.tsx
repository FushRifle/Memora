'use client';

import { useState } from 'react';
import { FiPlus, FiCalendar, FiClock, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import CalendarView from '@/app/components/schedule/CalendarView';
import ListView from '@/app/components/schedule/ListView';
import ScheduleGenerator from '@/app/components/schedule/ScheduleGenerator';

type ViewMode = 'calendar' | 'list';

interface StudySession {
    id: string;
    user_id: string;
    title: string;
    start_time: Date;
    end_time: Date;
    type: string;
    created_at: Date;
}

export default function SchedulePage() {
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [showGenerator, setShowGenerator] = useState(false);
    const [studySessions, setStudySessions] = useState<StudySession[]>([]);

    const upcomingSessions = studySessions.filter(
        (session) => new Date(session.end_time) > new Date()
    );

    const handleGenerateSchedule = () => {
        setShowGenerator(true);
    };

    const handleScheduleGenerated = (newSessions: StudySession[]) => {
        setStudySessions([...studySessions, ...newSessions]);
        setShowGenerator(false);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Upcoming Study Sessions</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {upcomingSessions.length} sessions scheduled
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        {viewMode === 'calendar' ? (
                            <>
                                <FiCalendar className="-ml-1 mr-1.5 h-4 w-4 text-gray-900" />
                                List View
                            </>
                        ) : (
                            <>
                                <FiCalendar className="-ml-1 mr-1.5 h-4 w-4 text-gray-900" />
                                Calendar View
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleGenerateSchedule}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <FiRefreshCw className="-ml-1 mr-1.5 h-4 w-4" />
                        Generate Schedule
                    </button>
                    <Link
                        href="/dashboard/schedule/new"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                    >
                        <FiPlus className="-ml-1 mr-1.5 h-4 w-4" />
                        Add Session
                    </Link>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <CalendarView sessions={studySessions} />
            ) : (
                <ListView sessions={studySessions} />
            )}

            {showGenerator && (
                <ScheduleGenerator
                    onGenerate={handleScheduleGenerated}
                    onCancel={() => setShowGenerator(false)}
                />
            )}
        </div>
    );
}