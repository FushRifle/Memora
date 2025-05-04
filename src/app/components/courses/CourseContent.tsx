import { FiCheckCircle } from 'react-icons/fi';

interface SyllabusItem {
    week: number;
    topic: string;
    completed: boolean;
}

export default function CourseContent({ syllabus }: { syllabus: SyllabusItem[] }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Course Syllabus</h2>
            <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-4">
                    {syllabus.map((item) => (
                        <li key={item.week} className="flex items-start">
                            <div
                                className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                                    }`}
                            >
                                {item.completed && <FiCheckCircle className="h-4 w-4" />}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                    Week {item.week}: {item.topic}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {item.completed ? 'Completed' : 'Upcoming'}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pt-4">
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Download Full Syllabus
                </button>
            </div>
        </div>
    );
}