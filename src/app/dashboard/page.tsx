import OverviewCards from '@/app/components/dashboard/OverviewCards';
import RecentActivity from '@/app/components/dashboard/RecentActivity';
import StudyProgress from '@/app/components/dashboard/StudyProgress';
import UpcomingSchedule from '@/app/components/dashboard/UpcomingSchedule';
import QuickActions from '@/app/components/dashboard/QuickActions';

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50 shadow-xl p-6 space-y-8">

            {/* Welcome Banner */}
            <section className="bg-white shadow rounded-2xl p-6">
                <h1 className="text-3xl font-semibold text-gray-900">
                    Welcome back, <span className="text-indigo-600">Fush</span>!
                </h1>
                <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
            </section>

            {/* Overview Cards */}
            <section className='shadow-md rounded-2xl p-6'>
                <OverviewCards />
            </section>

            {/* Grid Layout */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left Column */}
                <div className="space-y-6 lg:col-span-2">
                    <QuickActions />
                    <StudyProgress />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <UpcomingSchedule />
                    <RecentActivity />
                </div>

            </section>
        </main>
    );
}
