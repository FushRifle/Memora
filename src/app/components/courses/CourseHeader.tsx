import { FiBook, FiClock, FiUser } from 'react-icons/fi';

interface Course {
    id: string;
    title: string;
    instructor: string;
    description: string;
    progress: number;
    thumbnail: string;
    lastAccessed: string;
}

export default function CourseHeader({ course }: { course: Course }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="relative h-48 bg-gray-200">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-75"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <h1 className="text-2xl font-bold text-white">{course.title}</h1>
                    <p className="text-gray-200">{course.description}</p>
                </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                    <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                        <p className="text-sm text-gray-500">Instructor</p>
                        <p className="font-medium">{course.instructor}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <FiBook className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                            <span className="text-sm">{course.progress}%</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <FiClock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                        <p className="text-sm text-gray-500">Last accessed</p>
                        <p className="font-medium">{course.lastAccessed}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}