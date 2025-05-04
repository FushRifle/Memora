import { FiUpload, FiMessageSquare, FiCheckCircle, FiAward } from 'react-icons/fi';

const RecentActivity = () => {
    const activities = [
        {
            id: 1,
            type: 'upload',
            title: 'Uploaded lecture notes',
            description: 'Biology - Photosynthesis',
            time: '2 hours ago',
            icon: FiUpload,
            iconColor: 'text-blue-500',
        },
        {
            id: 2,
            type: 'quiz',
            title: 'Completed quiz',
            description: 'Calculus - Derivatives',
            time: '5 hours ago',
            icon: FiCheckCircle,
            iconColor: 'text-green-500',
        },
        {
            id: 3,
            type: 'chat',
            title: 'AI Tutor session',
            description: 'Asked about World War II causes',
            time: '1 day ago',
            icon: FiMessageSquare,
            iconColor: 'text-indigo-500',
        },
        {
            id: 4,
            type: 'achievement',
            title: 'Earned badge',
            description: '3-day study streak',
            time: '2 days ago',
            icon: FiAward,
            iconColor: 'text-yellow-500',
        },
    ];

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="flow-root">
                <ul className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                        <li key={activity.id}>
                            <div className="relative pb-8">
                                {activityIdx !== activities.length - 1 ? (
                                    <span
                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                    />
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span
                                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconColor}`}
                                        >
                                            <activity.icon className="h-5 w-5" />
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
                                            <time dateTime="2020-09-20">{activity.time}</time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecentActivity;