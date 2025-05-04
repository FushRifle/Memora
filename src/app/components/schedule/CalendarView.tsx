'use client';

import { FiCheck, FiX, FiEdit2 } from 'react-icons/fi';
import Link from 'next/link';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import { enUS } from 'date-fns/locale';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface StudySession {
    id: string;
    title: string;
    course: string;
    date: Date;
    duration: number;
    description: string;
    completed: boolean;
}

export default function CalendarView({ sessions }: { sessions: StudySession[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const events = sessions.map((session) => ({
        id: session.id,
        title: `${session.course}: ${session.title}`,
        start: session.date,
        end: new Date(session.date.getTime() + session.duration * 60000),
        completed: session.completed,
        session,
    }));

    const eventStyleGetter = (event: any) => {
        const backgroundColor = event.completed ? '#10B981' : '#3B82F6';
        const style = {
            backgroundColor,
            borderRadius: '4px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
        };
        return {
            style,
        };
    };

    const CustomToolbar = (toolbar: any) => {
        const goToBack = () => {
            toolbar.onNavigate('PREV');
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };

        const goToCurrent = () => {
            toolbar.onNavigate('TODAY');
        };

        const label = () => {
            const date = toolbar.date;
            return format(date, 'MMMM yyyy');
        };

        return (
            <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                    <button
                        onClick={goToBack}
                        className="px-3 py-1 border rounded-md text-sm"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={goToCurrent}
                        className="px-3 py-1 border rounded-md text-sm"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNext}
                        className="px-3 py-1 border rounded-md text-sm"
                    >
                        &gt;
                    </button>
                </div>
                <div className="text-lg font-medium">{label()}</div>
                <div></div> {/* Empty div for balance */}
            </div>
        );
    };

    const CustomEvent = ({ event }: { event: any }) => {
        return (
            <div className="p-1">
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-xs">
                    {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden p-4 h-[600px]">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                defaultView="week"
                views={['month', 'week', 'day', 'agenda']}
                toolbar={true}
                components={{
                    toolbar: CustomToolbar,
                    event: CustomEvent,
                }}
                eventPropGetter={eventStyleGetter}
                onNavigate={(date) => setCurrentDate(date)}
                onSelectEvent={(event) => {
                    // Handle event click (could open a modal)
                    console.log('Event selected:', event);
                }}
            />
        </div>
    );
}