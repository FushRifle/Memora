'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface StudySession {
    id: string;
    user_id: string;
    title: string;
    start_time: Date;
    end_time: Date;
    type: string;
    created_at: Date;
}

const locales = {
    'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface CalendarViewProps {
    sessions: StudySession[];
}

export default function CalendarView({ sessions }: CalendarViewProps) {
    const events = sessions.map(session => ({
        id: session.id,
        title: session.title,
        start: new Date(session.start_time),
        end: new Date(session.end_time),
        type: session.type,
    }));

    const eventStyleGetter = (event: any) => {
        let backgroundColor = '#3174ad';
        if (event.type === 'reading') backgroundColor = '#5cb85c';
        if (event.type === 'project') backgroundColor = '#d9534f';

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block',
            },
        };
    };

    return (
        <div className="h-[600px] mt-4">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                defaultView="week"
                popup
                onSelectEvent={(event) => alert(`Selected: ${event.title}`)}
            />
        </div>
    );
}