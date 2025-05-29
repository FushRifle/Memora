// app/components/quizzes/QuizCalendarView.tsx
'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Quiz } from '@/types/page';

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

export default function QuizCalendarView({ quizzes }: { quizzes: Quiz[] }) {
    const events = quizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        start: new Date(quiz.due_date),
        end: new Date(new Date(quiz.due_date).getTime() + 60 * 60 * 1000), // 1 hour duration
        allDay: false,
        resource: {
            completed: quiz.completed,
            score: quiz.score,
            totalQuestions: quiz.total_questions,
        },
    }));

    const eventStyleGetter = (event: any) => {
        let backgroundColor = event.resource.completed ? '#10B981' : '#F59E0B';
        let borderColor = event.resource.completed ? '#059669' : '#D97706';

        return {
            style: {
                backgroundColor,
                borderColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '1px solid',
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
                onSelectEvent={(event) => {
                    window.location.href = `/dashboard/quizzes/${event.id}`;
                }}
                components={{
                    event: ({ event }) => (
                        <div className="p-1">
                            <div className="font-medium">{event.title}</div>
                            {event.resource.completed && (
                                <div className="text-xs">
                                    Score: {event.resource.score}/{event.resource.totalQuestions}
                                </div>
                            )}
                        </div>
                    ),
                }}
            />
        </div>
    );
}