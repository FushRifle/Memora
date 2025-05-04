'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiClock } from 'react-icons/fi';

export default function ScheduleGenerator({
    onGenerate,
    onCancel,
}: {
    onGenerate: (sessions: any) => void;
    onCancel: () => void;
}) {
    const [preferences, setPreferences] = useState({
        studyDays: ['Mon', 'Wed', 'Fri'],
        studyHours: {
            start: 16,
            end: 22,
        },
        sessionLength: 90,
        breaks: 15,
        courses: [
            { name: 'Biology 101', priority: 3, hoursPerWeek: 4 },
            { name: 'Calculus II', priority: 2, hoursPerWeek: 3 },
            { name: 'World History', priority: 1, hoursPerWeek: 2 },
        ],
    });

    const handleGenerate = () => {
        // In a real app, this would use AI to generate an optimal schedule
        const generatedSessions = [
            {
                id: 'gen-1',
                title: 'Biology Study',
                course: 'Biology 101',
                date: new Date(2023, 10, 20, 16, 0),
                duration: 90,
                description: 'AI-generated study session',
                completed: false,
            },
            {
                id: 'gen-2',
                title: 'Calculus Practice',
                course: 'Calculus II',
                date: new Date(2023, 10, 22, 16, 0),
                duration: 90,
                description: 'AI-generated study session',
                completed: false,
            },
        ];
        onGenerate(generatedSessions);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="flex justify-between items-center border-b px-4 py-3">
                    <h3 className="text-lg font-medium">Generate Study Schedule</h3>
                    <button
                        onClick={onCancel}
                        className="p-1 text-gray-400 hover:text-gray-500"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Available Days
                        </label>
                        <div className="flex space-x-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    className={`px-3 py-1 rounded-md text-sm ${preferences.studyDays.includes(day)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                    onClick={() => {
                                        setPreferences((prev) => ({
                                            ...prev,
                                            studyDays: prev.studyDays.includes(day)
                                                ? prev.studyDays.filter((d) => d !== day)
                                                : [...prev.studyDays, day],
                                        }));
                                    }}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Available Hours
                            </label>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={preferences.studyHours.start}
                                    onChange={(e) =>
                                        setPreferences({
                                            ...preferences,
                                            studyHours: {
                                                ...preferences.studyHours,
                                                start: parseInt(e.target.value),
                                            },
                                        })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>
                                            {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                                        </option>
                                    ))}
                                </select>
                                <span>to</span>
                                <select
                                    value={preferences.studyHours.end}
                                    onChange={(e) =>
                                        setPreferences({
                                            ...preferences,
                                            studyHours: {
                                                ...preferences.studyHours,
                                                end: parseInt(e.target.value),
                                            },
                                        })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>
                                            {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Session Length
                            </label>
                            <select
                                value={preferences.sessionLength}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        sessionLength: parseInt(e.target.value),
                                    })
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                                <option value="90">90 minutes</option>
                                <option value="120">2 hours</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Priorities
                        </label>
                        <div className="space-y-2">
                            {preferences.courses.map((course, index) => (
                                <div key={course.name} className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {course.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">Priority:</span>
                                        <select
                                            value={course.priority}
                                            onChange={(e) => {
                                                const newCourses = [...preferences.courses];
                                                newCourses[index].priority = parseInt(e.target.value);
                                                setPreferences({ ...preferences, courses: newCourses });
                                            }}
                                            className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="1">Low</option>
                                            <option value="2">Medium</option>
                                            <option value="3">High</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">Hours/week:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={course.hoursPerWeek}
                                            onChange={(e) => {
                                                const newCourses = [...preferences.courses];
                                                newCourses[index].hoursPerWeek = parseInt(e.target.value);
                                                setPreferences({ ...preferences, courses: newCourses });
                                            }}
                                            className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t px-4 py-3 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Generate Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}