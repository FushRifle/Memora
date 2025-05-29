'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';

interface Course {
    name: string;
    priority: number;
    hoursPerWeek: number;
}

interface GeneratedSession {
    id: string;
    title: string;
    start_time: Date;
    end_time: Date;
    type: string;
}

export default function ScheduleGenerator({
    onGenerate,
    onCancel,
}: {
    onGenerate: (sessions: GeneratedSession[]) => void;
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
        ] as Course[],
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addNewCourse = () => {
        setPreferences(prev => ({
            ...prev,
            courses: [
                ...prev.courses,
                { name: '', priority: 2, hoursPerWeek: 2 }
            ]
        }));
    };

    const removeCourse = (index: number) => {
        const newCourses = [...preferences.courses];
        newCourses.splice(index, 1);
        setPreferences({ ...preferences, courses: newCourses });
    };

    const updateCourseName = (index: number, name: string) => {
        const newCourses = [...preferences.courses];
        newCourses[index].name = name;
        setPreferences({ ...preferences, courses: newCourses });
    };

    const generateAIStudyPlan = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Validate inputs
            if (preferences.studyHours.start >= preferences.studyHours.end) {
                throw new Error('End time must be after start time');
            }

            if (preferences.courses.some(c => !c.name.trim())) {
                throw new Error('All courses must have names');
            }

            // In a real app, you would call your AI API here
            // This is a mock implementation that simulates AI generation
            const generatedSessions = await simulateAIGeneration(preferences);

            onGenerate(generatedSessions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate schedule');
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    // Mock AI generation function
    const simulateAIGeneration = async (prefs: typeof preferences): Promise<GeneratedSession[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const sessions: GeneratedSession[] = [];
                const daysInWeek = 7;
                const startDate = new Date();
                startDate.setHours(0, 0, 0, 0);

                // Get the next occurrence of each selected day
                const dayMap: Record<string, number> = {
                    Mon: 1,
                    Tue: 2,
                    Wed: 3,
                    Thu: 4,
                    Fri: 5,
                    Sat: 6,
                    Sun: 0
                };

                // Sort courses by priority (highest first)
                const sortedCourses = [...prefs.courses].sort((a, b) => b.priority - a.priority);

                // Distribute study hours across selected days
                const daysToSchedule = prefs.studyDays.map(day => dayMap[day]);

                // Calculate total study minutes needed per week
                const totalMinutes = sortedCourses.reduce(
                    (sum, course) => sum + (course.hoursPerWeek * 60), 0
                );

                // Calculate minutes per session day
                const minutesPerDay = totalMinutes / daysToSchedule.length;

                // Generate sessions for each course
                let currentDayIndex = 0;
                let remainingMinutesPerCourse = sortedCourses.map(
                    course => course.hoursPerWeek * 60
                );

                while (remainingMinutesPerCourse.some(m => m > 0)) {
                    const currentDay = daysToSchedule[currentDayIndex % daysToSchedule.length];
                    const sessionDate = getNextDayOfWeek(startDate, currentDay);

                    // Calculate available time window
                    const startHour = prefs.studyHours.start;
                    const endHour = prefs.studyHours.end;
                    let currentHour = startHour;

                    // Create sessions until we've filled the day or completed all courses
                    while (currentHour < endHour && remainingMinutesPerCourse.some(m => m > 0)) {
                        // Find the next course that needs time
                        const courseIndex = remainingMinutesPerCourse.findIndex(m => m > 0);
                        if (courseIndex === -1) break;

                        const course = sortedCourses[courseIndex];
                        const sessionDuration = Math.min(
                            prefs.sessionLength,
                            remainingMinutesPerCourse[courseIndex],
                            (endHour - currentHour) * 60
                        );

                        if (sessionDuration <= 0) break;

                        // Create session
                        const sessionStart = new Date(sessionDate);
                        sessionStart.setHours(currentHour, 0, 0, 0);

                        const sessionEnd = new Date(sessionStart);
                        sessionEnd.setMinutes(sessionEnd.getMinutes() + sessionDuration);

                        sessions.push({
                            id: `gen-${sessions.length + 1}`,
                            title: `${course.name} Study`,
                            start_time: sessionStart,
                            end_time: sessionEnd,
                            type: 'study',
                        });

                        // Update tracking variables
                        remainingMinutesPerCourse[courseIndex] -= sessionDuration;
                        currentHour += sessionDuration / 60;
                        currentHour += prefs.breaks / 60; // Add break time
                    }

                    currentDayIndex++;
                }

                resolve(sessions);
            }, 1500); // Simulate API delay
        });
    };

    // Helper function to get next day of week
    const getNextDayOfWeek = (date: Date, dayOfWeek: number) => {
        const result = new Date(date);
        result.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7));
        return result;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b px-4 py-3 sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-medium">AI Study Schedule Generator</h3>
                    <button
                        onClick={onCancel}
                        className="p-1 text-gray-400 hover:text-gray-500"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Available Days
                        </label>
                        <div className="flex flex-wrap gap-2">
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

                        <div className="grid grid-cols-2 gap-4">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Break Between
                                </label>
                                <select
                                    value={preferences.breaks}
                                    onChange={(e) =>
                                        setPreferences({
                                            ...preferences,
                                            breaks: parseInt(e.target.value),
                                        })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="5">5 minutes</option>
                                    <option value="10">10 minutes</option>
                                    <option value="15">15 minutes</option>
                                    <option value="20">20 minutes</option>
                                    <option value="30">30 minutes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Course Priorities
                            </label>
                            <button
                                type="button"
                                onClick={addNewCourse}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <FiPlus className="mr-1 h-3 w-3" />
                                Add Course
                            </button>
                        </div>
                        <div className="space-y-3">
                            {preferences.courses.map((course, index) => (
                                <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <input
                                            type="text"
                                            value={course.name}
                                            onChange={(e) => updateCourseName(index, e.target.value)}
                                            placeholder="Course name"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500">Priority:</span>
                                                <select
                                                    value={course.priority}
                                                    onChange={(e) => {
                                                        const newCourses = [...preferences.courses];
                                                        newCourses[index].priority = parseInt(e.target.value);
                                                        setPreferences({ ...preferences, courses: newCourses });
                                                    }}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                                                        newCourses[index].hoursPerWeek = parseInt(e.target.value) || 0;
                                                        setPreferences({ ...preferences, courses: newCourses });
                                                    }}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeCourse(index)}
                                        className="p-1 text-gray-400 hover:text-red-500"
                                        title="Remove course"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t px-4 py-3 flex justify-end space-x-3 sticky bottom-0 bg-white">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isGenerating}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={generateAIStudyPlan}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isGenerating || preferences.courses.length === 0}
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            'Generate Schedule'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}