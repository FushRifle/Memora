'use client';

import { FiBook, FiFileText, FiAward, FiClock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client';
import { useAuth } from '@/providers/AuthProvider';

const OverviewCards = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([
        { name: 'Active Courses', value: '0', icon: FiBook, change: '+0', changeType: 'neutral' },
        { name: 'Notes Processed', value: '0', icon: FiFileText, change: '+0', changeType: 'neutral' },
        { name: 'Current Streak', value: '0 days', icon: FiAward, change: '+0', changeType: 'neutral' },
        { name: 'Study Time', value: '0h', icon: FiClock, change: '+0h', changeType: 'neutral' },
    ]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            // Fetch active courses count
            const { count: activeCourses } = await supabase
                .from('courses')
                .select('*', { count: 'exact' })
                .eq('user_id', user.id)
                .eq('is_active', true);

            // Fetch processed notes count
            const { count: processedNotes } = await supabase
                .from('notes')
                .select('*', { count: 'exact' })
                .eq('user_id', user.id)
                .eq('status', 'processed');

            // Fetch study streak
            const { data: streakData } = await supabase
                .from('study_streaks')
                .select('current_streak_days')
                .eq('user_id', user.id)
                .single();

            // Fetch weekly study time
            const { data: studyTimeData } = await supabase
                .rpc('get_weekly_study_time', { user_id: user.id });

            setStats([
                {
                    name: 'Active Courses',
                    value: activeCourses?.toString() || '0',
                    icon: FiBook,
                    change: '+1',
                    changeType: 'positive'
                },
                {
                    name: 'Notes Processed',
                    value: processedNotes?.toString() || '0',
                    icon: FiFileText,
                    change: '+5',
                    changeType: 'positive'
                },
                {
                    name: 'Current Streak',
                    value: `${streakData?.current_streak_days || 0} days`,
                    icon: FiAward,
                    change: streakData?.current_streak_days ? '-2' : '+0',
                    changeType: streakData?.current_streak_days ? 'negative' : 'neutral'
                },
                {
                    name: 'Study Time',
                    value: `${(studyTimeData?.total_minutes || 0 / 60).toFixed(1)}h`,
                    icon: FiClock,
                    change: studyTimeData?.change ? `${studyTimeData.change}h` : '+0h',
                    changeType: studyTimeData?.change ? 'positive' : 'neutral'
                },
            ]);
        };

        fetchData();
    }, [user]);

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <stat.icon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                    <dd>
                                        <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <span className={`font-medium ${stat.changeType === 'positive' ? 'text-green-600' :
                                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                {stat.change}
                            </span>{' '}
                            <span className="text-gray-500">since last week</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OverviewCards;