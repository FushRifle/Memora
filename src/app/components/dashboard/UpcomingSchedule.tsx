import { FiCalendar, FiClock } from 'react-icons/fi';

const UpcomingSchedule = () => {
    const scheduleItems = [
        {
            id: 1,
            title: 'Biology Study Session',
            time: 'Today, 3:00 PM - 4:30 PM',
            type: 'study',
        },
        {
            id: 2,
            title: 'Calculus Exam',
            time: 'Tomorrow, 10:00 AM - 11:30 AM',
            type: 'exam',
        },
        {
            id: 3,
            title: 'History Reading',
            time: 'Wed, 7:00 PM - 8:00 PM',
            type: 'reading',
        },
    ];

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Schedule</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-500">View all</button>
            </div>

            <div className="space-y-4">
                {scheduleItems.map((item) => (
                    <div key={item.id} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <FiCalendar className="h-4 w-4 text-indigo-600" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <span>{item.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingSchedule;