'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client';
import { FiUpload, FiMessageSquare, FiCheckCircle, FiAward } from 'react-icons/fi';

export interface RecentActivityItem {
    id: string;
    user_id: string;
    type: 'upload' | 'quiz' | 'chat' | 'achievement';
    title: string;
    description: string;
    created_at: string; // ISO date string
}

const ICONS = {
    upload: { icon: FiUpload, color: 'text-blue-500' },
    quiz: { icon: FiCheckCircle, color: 'text-green-500' },
    chat: { icon: FiMessageSquare, color: 'text-indigo-500' },
    achievement: { icon: FiAward, color: 'text-yellow-500' },
};

const RecentActivity = () => {
    const [activities, setActivities] = useState<RecentActivityItem[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const { data, error } = await supabase
                .from('recent_activity')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error fetching activities:', error.message);
            } else {
                setActivities(data);
            }
        };

        fetchActivities();
    }, []);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="flow-root">
                <ul className="-mb-8">
                    {activities.map((activity, idx) => {
                        const Icon = ICONS[activity.type]?.icon || FiMessageSquare;
                        const iconColor = ICONS[activity.type]?.color || 'text-gray-400';

                        return (
                            <li key={activity.id}>
                                <div className="relative pb-8">
                                    {idx !== activities.length - 1 && (
                                        <span
                                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span
                                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${iconColor}`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-800">
                                                    {activity.title}{' '}
                                                    <span className="font-medium text-gray-900">
                                                        {activity.description}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                <time>{new Date(activity.created_at).toLocaleString()}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default RecentActivity;
