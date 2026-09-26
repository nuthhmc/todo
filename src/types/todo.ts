export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Work' | 'Personal' | 'Design' | 'Dev' | 'Urgent';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string;
  isStarred?: boolean;
  createdAt: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';
