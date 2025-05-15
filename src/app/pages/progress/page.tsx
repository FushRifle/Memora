'use client';

import { FiBarChart2, FiAward, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';
import ProgressChart from '@/app/components/progress/ProgressChart';
import CourseProgress from '@/app/components/progress/CourseProgress';
import AchievementBadges from '@/app/components/progress/AchievementBadges';

export default function ProgressPage() {
    // Mock data - replace with actual API calls
    const stats = [
        { name: 'Study Hours', value: '24.5', change: '+3.2', changeType: 'increase' },
        { name: 'Sessions Completed', value: '18', change: '+5', changeType: 'increase' },
        { name: 'Current Streak', value: '7 days', change: '+2', changeType: 'increase' },
        { name: 'Quizzes Taken', value: '12', change: '0', changeType: 'neutral' },
    ];

    const courses = [
        {
            name: 'Biology 101',
            progress: 75,
            lastStudied: '2 days ago',
            weakAreas: ['Cell Division', 'Photosynthesis'],
        },
        {
            name: 'Calculus II',
            progress: 42,
            lastStudied: '1 day ago',
            weakAreas: ['Integration Techniques'],
        },
        {
            name: 'World History',
            progress: 88,
            lastStudied: '5 hours ago',
            weakAreas: ['Cold War Timeline'],
        },
    ];

    const achievements = [
        { name: 'Early Bird', earned: true, description: 'Studied before 8 AM 5 times' },
        { name: 'Weekend Warrior', earned: false, description: 'Study on both weekend days' },
        { name: 'Perfect Score', earned: true, description: 'Scored 100% on a quiz' },
        { name: 'Marathon', earned: false, description: 'Study for 4+ hours in one session' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    {stat.name.includes('Hours') && <FiClock className="h-6 w-6 text-white" />}
                                    {stat.name.includes('Sessions') && <FiCalendar className="h-6 w-6 text-white" />}
                                    {stat.name.includes('Streak') && <FiTrendingUp className="h-6 w-6 text-white" />}
                                    {stat.name.includes('Quizzes') && <FiAward className="h-6 w-6 text-white" />}
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
                            <div className="mt-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stat.changeType === 'increase'
                                    ? 'bg-green-100 text-green-800'
                                    : stat.changeType === 'decrease'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {stat.changeType === 'increase' ? '+' : ''}
                                    {stat.change} {stat.changeType !== 'neutral' && 'from last week'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Study Progress</h2>
                    <ProgressChart />
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Achievements</h2>
                    <AchievementBadges achievements={achievements} />
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Course Progress</h2>
                <div className="space-y-4">
                    {courses.map((course) => (
                        <CourseProgress key={course.name} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}