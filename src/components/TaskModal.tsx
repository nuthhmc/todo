import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, Sparkles } from 'lucide-react';
import type { Todo, Priority, Category } from '../types/todo';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Todo, 'id' | 'createdAt'>, editId?: string) => void;
  initialData?: Todo | null;
}

const CATEGORIES: Category[] = ['Work', 'Personal', 'Design', 'Dev', 'Urgent'];
const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  { value: 'high', label: 'High', color: 'bg-rose-50 text-rose-700 border-rose-300' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Work');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setCategory(initialData.category);
      setDueDate(initialData.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Work');
      setDueDate('');
    }
    setError('');
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the task');
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate: dueDate || undefined,
        completed: initialData ? initialData.completed : false,
        isStarred: initialData ? initialData.isStarred : false,
      },
      initialData ? initialData.id : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                {initialData ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-xs text-slate-500">
                {initialData ? 'Update details of your task' : 'Add details and set priorities'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Design homepage hero section"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
            />
            {error && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add key notes, links, or criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white text-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? `${p.color} ring-2 ring-indigo-500/30 font-bold scale-[1.02]`
                        : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.value === 'high'
                          ? 'bg-rose-500'
                          : p.value === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
