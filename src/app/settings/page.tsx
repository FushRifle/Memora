'use client';
import React, { useState } from 'react';
import { FiUser, FiBell, FiLock, FiMoon, FiGlobe } from 'react-icons/fi';
import SettingsSection from '@/app/components/settings/SettingsSection';
import ToggleSwitch from '@/app/components/settings/ToggleSwitch';

export default function SettingsPage() {
    // Mock user data - replace with actual user context
    const user = {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        avatar: '/images/avatar.png',
    };

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [weeklyReportEnabled, setWeeklyReportEnabled] = useState(true);

    return (
        <div className="space-y-6">
            <SettingsSection
                title="Profile"
                icon={<FiUser className="h-5 w-5 text-indigo-600" />}
            >
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">AJ</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                defaultValue={user.name}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                defaultValue={user.email}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                title="Notifications"
                icon={<FiBell className="h-5 w-5 text-indigo-600" />}
            >
                <div className="space-y-4">
                    <ToggleSwitch
                        label="Enable notifications"
                        enabled={notificationsEnabled}
                        setEnabled={setNotificationsEnabled}
                    />
                    <ToggleSwitch
                        label="Weekly progress report"
                        enabled={weeklyReportEnabled}
                        setEnabled={setWeeklyReportEnabled}
                    />
                    <ToggleSwitch
                        label="Study reminders"
                        enabled={true}
                        setEnabled={() => { }}
                    />
                </div>
            </SettingsSection>

            <SettingsSection
                title="Appearance"
                icon={<FiMoon className="h-5 w-5 text-indigo-600" />}
            >
                <div className="space-y-4">
                    <ToggleSwitch
                        label="Dark mode"
                        enabled={darkModeEnabled}
                        setEnabled={setDarkModeEnabled}
                    />
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Language
                        </label>
                        <select
                            id="language"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                        </select>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                title="Security"
                icon={<FiLock className="h-5 w-5 text-indigo-600" />}
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="current-password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}