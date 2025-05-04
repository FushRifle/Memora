import { ReactNode } from 'react';

export default function SettingsSection({
    title,
    icon,
    children,
}: {
    title: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6 flex items-center">
                <div className="flex-shrink-0 mr-3">
                    {icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
                {children}
            </div>
        </div>
    );
}