'use client';

import { useState } from 'react';
import { FiPlus, FiCalendar, FiClock, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import CalendarView from '@/app/components/schedule/CalendarView';
import ListView from '@/app/components/schedule/ListView';
import ScheduleGenerator from '@/app/components/schedule/ScheduleGenerator';

type ViewMode = 'calendar' | 'list';

export default function SchedulePage() {
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [showGenerator, setShowGenerator] = useState(false);

    // Mock study sessions data
    const studySessions = [
        {
            id: '1',
            title: 'Biology Review',
            course: 'Biology 101',
            date: new Date(2023, 10, 15, 16, 0),
            duration: 90,
            description: 'Review cell biology chapters 3-5',
            completed: false,
        },
        {
            id: '2',
            title: 'Calculus Practice',
            course: 'Calculus II',
            date: new Date(2023, 10, 16, 14, 0),
            duration: 120,
            description: 'Work on derivative problems',
            completed: true,
        },
        {
            id: '3',
            title: 'History Reading',
            course: 'World History',
            date: new Date(2023, 10, 17, 10, 0),
            duration: 60,
            description: 'Read WW2 chapter',
            completed: false,
        },
        {
            id: '4',
            title: 'CS Project',
            course: 'Computer Science',
            date: new Date(2023, 10, 18, 18, 0),
            duration: 180,
            description: 'Work on final project',
            completed: false,
        },
    ];

    const upcomingSessions = studySessions.filter(
        (session) => !session.completed
    );

    const handleGenerateSchedule = () => {
        setShowGenerator(true);
    };

    const handleScheduleGenerated = (newSessions: any) => {
        // In a real app, you would add these to your state/backend
        console.log('New sessions generated:', newSessions);
        setShowGenerator(false);
    };

    return (
        <div className="space-y-6">
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
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {viewMode === 'calendar' ? (
                            <>
                                <FiCalendar className="-ml-1 mr-1.5 h-4 w-4 text-gray-400" />
                                List View
                            </>
                        ) : (
                            <>
                                <FiCalendar className="-ml-1 mr-1.5 h-4 w-4 text-gray-400" />
                                Calendar View
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleGenerateSchedule}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiRefreshCw className="-ml-1 mr-1.5 h-4 w-4" />
                        Generate Schedule
                    </button>
                    <Link
                        href="/dashboard/schedule/new"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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