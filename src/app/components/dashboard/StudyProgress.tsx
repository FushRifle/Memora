import { FiBookOpen } from 'react-icons/fi';

const StudyProgress = () => {
    const courses = [
        { name: 'Biology 101', progress: 75, color: 'bg-indigo-600' },
        { name: 'Calculus II', progress: 42, color: 'bg-blue-500' },
        { name: 'World History', progress: 88, color: 'bg-green-500' },
        { name: 'Computer Science', progress: 35, color: 'bg-purple-500' },
    ];

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Study Progress</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-500">View all</button>
            </div>

            <div className="space-y-4">
                {courses.map((course) => (
                    <div key={course.name}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <FiBookOpen className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-700">{course.name}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-500">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`${course.color} h-2 rounded-full`}
                                style={{ width: `${course.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyProgress;