import { FiAward, FiLock } from 'react-icons/fi';

interface Achievement {
    name: string;
    earned: boolean;
    description: string;
}

export default function AchievementBadges({ achievements }: { achievements: Achievement[] }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
                <div
                    key={achievement.name}
                    className={`p-3 rounded-lg border ${achievement.earned ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}
                >
                    <div className="flex items-center">
                        <div className={`p-2 rounded-full ${achievement.earned ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                            {achievement.earned ? <FiAward className="h-5 w-5" /> : <FiLock className="h-5 w-5" />}
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${achievement.earned ? 'text-indigo-800' : 'text-gray-500'}`}>
                                {achievement.name}
                            </h3>
                            <p className="text-xs text-gray-500">{achievement.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}