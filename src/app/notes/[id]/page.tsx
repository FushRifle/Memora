import NoteDetail from '@/app/components/notes/NoteDetail';

interface Note {
    id: string;
    title: string;
    course: string;
    type: 'lecture' | 'handwritten' | 'book' | 'other';
    content: string;
    date: string;
    lastEdited: string;
    relatedNotes: string[];
}

export default function NoteDetailPage({ params }: { params: { id: string } }) {
    // Mock note data - replace with actual API call
    const note: Note = {
        id: params.id,
        title: 'Lecture 1 - Introduction to Biology',
        course: 'Biology 101',
        type: 'lecture',
        content: `# Introduction to Biology

## What is Biology?
Biology is the scientific study of life. It encompasses all living organisms, from the smallest bacteria to the largest whales.

### Key Concepts:
- **Cells**: The basic unit of life
- **Genetics**: The study of heredity
- **Evolution**: How species change over time
- **Ecology**: Interactions between organisms and their environment

## The Scientific Method
1. Observation
2. Question
3. Hypothesis
4. Experiment
5. Analysis
6. Conclusion

## Branches of Biology
- Molecular Biology
- Microbiology
- Botany
- Zoology
- Ecology
- Genetics`,
        date: '2023-10-15',
        lastEdited: '2 days ago',
        relatedNotes: [
            'Cell Structure and Function',
            'Genetics Basics',
            'Evolutionary Theory',
        ],
    };

    return <NoteDetail note={note} />;
}