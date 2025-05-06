'use client';
import {
    FiUpload,
    FiMessageSquare,
    FiBook,
    FiCalendar,
    FiTrendingUp,
    FiTarget,
} from 'react-icons/fi';

const actions = [
    {
        name: 'Upload Notes',
        description: 'Add new study materials',
        icon: FiUpload,
        href: '/notes/upload',
        iconColor: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
    },
    {
        name: 'Ask AI Tutor',
        description: 'Get instant help from EduPilot AI',
        icon: FiMessageSquare,
        href: '/tutor',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        name: 'Generate Quiz',
        description: 'Test your knowledge with custom questions',
        icon: FiBook,
        href: '/courses/quiz',
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        name: 'Study Scheduler',
        description: 'Plan your daily study sessions',
        icon: FiCalendar,
        href: '/schedule',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        name: 'Track Progress',
        description: 'Visualize your learning achievements',
        icon: FiTrendingUp,
        href: '/progress',
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
    },
    {
        name: 'Set Goals',
        description: 'Define targets and stay focused',
        icon: FiTarget,
        href: '/progress/goals',
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
    },
];

export default function QuickActions() {
    return (
        <section className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {actions.map((action) => (
                    <a
                        key={action.name}
                        href={action.href}
                        tabIndex={0}
                        className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:ring-2 hover:ring-indigo-100 transition duration-200"
                    >
                        <div className={`p-3 rounded-lg ${action.bgColor}`}>
                            <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-gray-900 group-hover:text-indigo-600">
                                {action.name}
                            </h3>
                            <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
