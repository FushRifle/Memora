import { FiBook, FiAlertTriangle } from 'react-icons/fi';

interface Course {
    name: string;
    progress: number;
    lastStudied: string;
    weakAreas: string[];
}

export default function CourseProgress({ course }: { course: Course }) {
    return (
        <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <FiBook className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-md font-medium">{course.name}</h3>
                </div>
                <span className="text-sm font-medium">{course.progress}%</span>
            </div>

            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                ></div>
            </div>

            <div className="mt-2 text-sm text-gray-500">
                Last studied: {course.lastStudied}
            </div>

            {course.weakAreas.length > 0 && (
                <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <FiAlertTriangle className="text-yellow-500 mr-1" />
                        Areas to Improve
                    </h4>
                    <ul className="mt-1 space-y-1">
                        {course.weakAreas.map((area) => (
                            <li key={area} className="text-sm text-gray-600">
                                • {area}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}