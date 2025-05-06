import { FiBarChart2, FiTrendingUp, FiCalendar, FiAward } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client';

interface AnalyticsData {
    progress: number;
    study_time: number;
    days_active: number;
    quiz_average: number;
    weekly_study: { day: string; hours: number }[];
    topic_mastery: { topic: string; mastery: number }[];
}

export default function CourseAnalytics({ courseId }: { courseId: string }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('study_sessions')
                    .select('*')
                    .eq('course_id', courseId)
                    .single();

                if (error) throw new Error(error.message);

                setAnalytics(data as AnalyticsData);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!analytics) return null;

    // Prepare stats data
    const stats = [
        {
            name: 'Overall Progress',
            value: `${Math.round(analytics.progress)}%`,
            icon: FiBarChart2,
            change: '+5%',
            changeType: 'positive'
        },
        {
            name: 'Study Time',
            value: `${analytics.study_time.toFixed(1)}h`,
            icon: FiTrendingUp,
            change: '+3.2h',
            changeType: 'positive'
        },
        {
            name: 'Days Active',
            value: `${analytics.days_active}/14`,
            icon: FiCalendar,
            change: '+4',
            changeType: 'positive'
        },
        {
            name: 'Quiz Average',
            value: `${Math.round(analytics.quiz_average)}%`,
            icon: FiAward,
            change: '-2%',
            changeType: analytics.quiz_average > 75 ? 'positive' : 'negative'
        },
    ];

    // Find the topic with lowest mastery for recommendations
    const weakestTopic = analytics.topic_mastery.reduce((prev, current) =>
        (prev.mastery < current.mastery) ? prev : current
    );

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Course Analytics</h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <stat.icon className={`h-6 w-6 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {stat.name}
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {stat.value}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <span className={`font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change}
                                </span>{' '}
                                <span className="text-gray-500">from last week</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Weekly Study Time</h3>
                    <div className="flex items-end space-x-2 h-48">
                        {analytics.weekly_study.map((day) => (
                            <div key={day.day} className="flex flex-col items-center flex-1">
                                <div
                                    className="w-full bg-indigo-100 rounded-t-md"
                                    style={{ height: `${(day.hours / 3.5) * 100}%` }}
                                >
                                    <div className="h-full bg-indigo-600 rounded-t-md"></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                                <span className="text-xs font-medium text-indigo-600 mt-1">
                                    {day.hours.toFixed(1)}h
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Topic Mastery</h3>
                    <div className="space-y-3">
                        {analytics.topic_mastery.map((item) => (
                            <div key={item.topic}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.topic}
                                    </span>
                                    <span className="text-xs font-medium text-gray-500">
                                        {item.mastery}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${item.mastery > 85
                                            ? 'bg-green-500'
                                            : item.mastery > 70
                                                ? 'bg-blue-500'
                                                : 'bg-yellow-500'
                                            } h-2 rounded-full`}
                                        style={{ width: `${item.mastery}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FiAward className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">
                                Focus on {weakestTopic.topic} topics
                            </h4>
                            <p className="text-sm text-gray-500">
                                Your mastery score for {weakestTopic.topic} is lower than other topics at {weakestTopic.mastery}%.
                                Try reviewing the related notes and taking a practice quiz.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <FiTrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">
                                Increase study time on weekends
                            </h4>
                            <p className="text-sm text-gray-500">
                                Your study time drops significantly on weekends. Even 1-2 hours can help
                                maintain consistency.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}