import CourseHeader from '@/app/components/courses/CourseHeader';
import CourseTabs from '@/app/components/courses/CourseTabs';
import { notFound } from 'next/navigation';

const courses = [
    {
        id: '1',
        title: 'Biology 101',
        instructor: 'Dr. Sarah Johnson',
        description: 'Introduction to biological concepts including cell structure, genetics, evolution, and ecology.',
        progress: 75,
        thumbnail: '/images/biology.jpeg',
        lastAccessed: '2 days ago',
        totalNotes: 12,
        totalQuizzes: 5,
        syllabus: [
            { week: 1, topic: 'Introduction to Biology', completed: true },
            { week: 2, topic: 'Cell Structure and Function', completed: true },
            { week: 3, topic: 'Genetics and Heredity', completed: true },
            { week: 4, topic: 'Evolution and Natural Selection', completed: true },
            { week: 5, topic: 'Ecology and Ecosystems', completed: false },
            { week: 6, topic: 'Human Anatomy', completed: false },
        ],
    },
    // ... other courses
];

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    const course = courses.find((c) => c.id === params.id);

    if (!course) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            <CourseHeader course={course} />
            <CourseTabs course={course} />
        </div>
    );
}