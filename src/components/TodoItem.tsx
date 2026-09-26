import React from 'react';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Star, 
  Calendar, 
  Clock 
} from 'lucide-react';
import type { Todo, Priority, Category } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onToggleStar: (id: string) => void;
}

const CATEGORY_STYLES: Record<Category, string> = {
  Work: 'bg-blue-50 text-blue-700 border-blue-200',
  Personal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Design: 'bg-purple-50 text-purple-700 border-purple-200',
  Dev: 'bg-sky-50 text-sky-700 border-sky-200',
  Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
};

const PRIORITY_DOTS: Record<Priority, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onToggleStar,
}) => {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate).setHours(23, 59, 59, 999) < Date.now();

  return (
    <div
      className={`group relative flex items-start sm:items-center justify-between gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-slate-50/60 border-slate-200/60 text-slate-400'
          : 'bg-white hover:bg-slate-50/50 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow text-slate-800'
      }`}
    >
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        {/* Custom Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark task incomplete' : 'Mark task complete'}
          className={`mt-0.5 sm:mt-0 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer ${
            todo.completed
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 bg-white hover:border-indigo-600 hover:bg-indigo-50/50'
          }`}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content details */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-sm sm:text-base font-medium break-words transition-all duration-200 ${
                todo.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-800 group-hover:text-slate-900'
              }`}
            >
              {todo.title}
            </span>

            {/* Priority dot indicator */}
            <span
              title={`Priority: ${todo.priority}`}
              className={`w-2 h-2 rounded-full inline-block ${PRIORITY_DOTS[todo.priority]}`}
            />
          </div>

          {todo.description && (
            <p
              className={`text-xs break-words line-clamp-2 mb-2 ${
                todo.completed ? 'text-slate-400 line-through' : 'text-slate-500'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Badges / Metadata */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Category tag */}
            <span
              className={`px-2 py-0.5 rounded-md border font-medium text-[11px] ${
                CATEGORY_STYLES[todo.category] || 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {todo.category}
            </span>

            {/* Due date badge */}
            {todo.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${
                  isOverdue
                    ? 'bg-rose-50 text-rose-600 border-rose-200 font-medium'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isOverdue ? (
                  <Clock className="w-3 h-3 text-rose-600 animate-pulse" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-400" />
                )}
                <span>
                  {isOverdue ? 'Overdue: ' : 'Due: '}
                  {new Date(todo.dueDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Star Button */}
        <button
          type="button"
          onClick={() => onToggleStar(todo.id)}
          aria-label={todo.isStarred ? 'Unstar task' : 'Star task'}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            todo.isStarred
              ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Star className={`w-4 h-4 ${todo.isStarred ? 'fill-amber-500' : ''}`} />
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(todo)}
          aria-label="Edit task"
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
