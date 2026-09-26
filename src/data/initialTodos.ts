import type { Todo } from '../types/todo';

export const initialTodos: Todo[] = [
  {
    id: 'task',
    title: 'Review wireframes for client onboarding redesign',
    description: 'Ensure Figma flows match the updated authentication spec and feedback.',
    completed: false,
    priority: 'high',
    category: 'Design',
    dueDate: '2026-09-26',
    isStarred: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
];
