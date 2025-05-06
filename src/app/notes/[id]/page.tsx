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

const mockNotes: Note[] = [
    {
        id: '1',
        title: 'Lecture 1 - Introduction to Biology',
        course: 'Biology 101',
        type: 'lecture',
        content: `# Introduction to Biology

## What is Biology?
Biology is the scientific study of life. It explores everything from microscopic organisms to entire ecosystems.

### Core Principles:
- **Cell Theory**: All living things are composed of cells
- **Homeostasis**: Maintaining stable internal conditions
- **Metabolism**: Chemical processes that sustain life
- **Heredity**: Passing traits to offspring
- **Evolution**: Species adaptation over generations

## Scientific Methodology
\`\`\`mermaid
graph TD;
    A[Observation] --> B[Question];
    B --> C[Hypothesis];
    C --> D[Experiment];
    D --> E[Data Analysis];
    E --> F[Conclusion];
\`\`\``,
        date: '2023-10-15',
        lastEdited: '2 days ago',
        relatedNotes: ['Cell Biology', 'Genetics Fundamentals', 'Ecosystem Dynamics']
    },
    {
        id: '2',
        title: 'Quantum Mechanics Basics',
        course: 'Physics 302',
        type: 'lecture',
        content: `# Quantum Theory Foundations

## Key Concepts
- Wave-particle duality
- Heisenberg Uncertainty Principle
- Schrödinger's Cat thought experiment
- Quantum superposition

## Mathematical Formulation
\`\`\`latex
\\hat{H}\\psi = E\\psi
\`\`\`

Where:
- $\\hat{H}$ is the Hamiltonian operator
- $\\psi$ is the wave function
- $E$ is the energy eigenvalue`,
        date: '2023-11-02',
        lastEdited: '1 week ago',
        relatedNotes: ['Classical Mechanics', 'Electromagnetism', 'Statistical Physics']
    },
    {
        id: '3',
        title: 'French Revolution Timeline',
        course: 'History 210',
        type: 'handwritten',
        content: `## Major Events (1789-1799)

| Year | Event                     | Significance                     |
|------|---------------------------|-----------------------------------|
| 1789 | Storming of the Bastille  | Symbolic start of revolution     |
| 1791 | Constitutional Monarchy   | Limited royal power              |
| 1793 | Reign of Terror           | Radical phase under Robespierre  |
| 1799 | Napoleon's Coup           | End of revolutionary period      |

### Key Figures:
- Maximilien Robespierre
- Louis XVI
- Marie Antoinette
- Georges Danton`,
        date: '2023-09-28',
        lastEdited: '3 days ago',
        relatedNotes: ['Enlightenment Philosophy', 'Napoleonic Wars', 'European Monarchies']
    },
    {
        id: '4',
        title: 'Data Structures Overview',
        course: 'Computer Science 101',
        type: 'book',
        content: `# Essential Data Structures

## Linear Structures
- Arrays (O(1) access)
- Linked Lists (O(n) access)
- Stacks (LIFO)
- Queues (FIFO)

## Non-Linear Structures
- Trees (Binary, AVL, Red-Black)
- Graphs (Directed/Undirected)

## Complexity Chart
\`\`\`
Structure | Access | Search | Insertion | Deletion
----------|--------|--------|-----------|---------
Array     | O(1)   | O(n)   | O(n)      | O(n)
Hash Table| O(1)   | O(1)   | O(1)      | O(1)
BST       | O(log n)| O(log n)| O(log n) | O(log n)
\`\`\``,
        date: '2023-10-10',
        lastEdited: '5 days ago',
        relatedNotes: ['Algorithms', 'Database Indexing', 'Memory Management']
    },
    {
        id: '5',
        title: 'Macroeconomics Principles',
        course: 'Economics 200',
        type: 'other',
        content: `# Fundamental Concepts

## Key Indicators
- **GDP**: Total economic output
- **Inflation**: Price level increases
- **Unemployment Rate**: Labor market health

## Policy Tools
\`\`\`mermaid
pie
    title Monetary Policy Instruments
    "Interest Rates" : 45
    "Reserve Requirements" : 25
    "Open Market Operations" : 30
\`\`\`

## Economic Theories
1. Keynesian (Demand-side focus)
2. Classical (Market self-correction)
3. Monetarist (Money supply control)`,
        date: '2023-11-15',
        lastEdited: 'yesterday',
        relatedNotes: ['Microeconomics', 'International Trade', 'Economic History']
    }
];

export default function NoteDetailPage({ params }: { params: { id: string } }) {
    const note = mockNotes.find(note => note.id === params.id) || mockNotes[0];


    console.log('Current Note:', note);

    return <NoteDetail note={note} />;
}