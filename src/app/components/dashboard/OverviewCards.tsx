import { FiBook, FiFileText, FiAward, FiClock } from 'react-icons/fi';

const OverviewCards = () => {
    const stats = [
        { name: 'Active Courses', value: '4', icon: FiBook, change: '+1', changeType: 'positive' },
        { name: 'Notes Processed', value: '27', icon: FiFileText, change: '+5', changeType: 'positive' },
        { name: 'Current Streak', value: '12 days', icon: FiAward, change: '-2', changeType: 'negative' },
        { name: 'Study Time', value: '8.5h', icon: FiClock, change: '+2.3h', changeType: 'positive' },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <stat.icon className="h-6 w-6 text-gray-400" />
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
                            <span className={`font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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