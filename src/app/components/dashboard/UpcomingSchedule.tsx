'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client'; // adjust path if needed
import { FiCalendar, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';

interface ScheduleItem {
    id: string;
    title: string;
    type: string;
    start_time: string;
    end_time: string;
}

const UpcomingSchedule = () => {
    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return;

            const { data, error } = await supabase
                .from('schedule_items')
                .select('id, title, type, start_time, end_time')
                .eq('user_id', user.id)
                .gte('start_time', new Date().toISOString())
                .order('start_time', { ascending: true })
                .limit(5);

            if (!error && data) {
                setScheduleItems(data);
            } else {
                console.error(error);
            }

            setLoading(false);
        };

        fetchSchedule();
    }, []);

    const formatTimeRange = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const sameDay = startDate.toDateString() === new Date().toDateString();
        const dayPrefix = sameDay
            ? 'Today'
            : format(startDate, 'EEE');

        return `${dayPrefix}, ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Schedule</h2>
                <Link href="/schedule">
                    <button className="text-sm text-indigo-600 hover:text-indigo-500">View all</button>
                </Link>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 border-b text-gray-700">
                            <tr>
                                <th className="px-4 py-2 font-medium">Event</th>
                                <th className="px-4 py-2 font-medium">Type</th>
                                <th className="px-4 py-2 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {scheduleItems.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 flex items-center gap-2 text-gray-900">
                                        <FiCalendar className="text-indigo-600" />
                                        {item.title}
                                    </td>
                                    <td className="px-4 py-2 capitalize">{item.type}</td>
                                    <td className="px-4 py-2 flex items-center gap-1">
                                        <FiClock className="text-gray-400" />
                                        {formatTimeRange(item.start_time, item.end_time)}
                                    </td>
                                </tr>
                            ))}
                            {scheduleItems.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                                        No upcoming events.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UpcomingSchedule;
