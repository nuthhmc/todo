import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle, 
  Sparkles, 
  ListFilter,
  CheckCheck
} from 'lucide-react';
import type { Todo, FilterStatus, Category } from './types/todo';
import { initialTodos } from './data/initialTodos';
import { TodoItem } from './components/TodoItem';
import { TodoStats } from './components/TodoStats';
import { TaskModal } from './components/TaskModal';

const STORAGE_KEY = 'taskflow_todos_v1';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      console.warn('Failed to parse localStorage tasks, loading initial sample');
    }
    return initialTodos;
  });

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      console.error('Error saving tasks to localStorage:', err);
    }
  }, [todos]);

  // Handlers
  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleStar = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isStarred: !t.isStarred } : t))
    );
  };

  const handleOpenAddModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Todo, 'id' | 'createdAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Editing existing task
      setTodos((prev) =>
        prev.map((t) => (t.id === editId ? { ...t, ...taskData } : t))
      );
    } else {
      // Creating new task
      const newTask: Todo = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: Date.now(),
      };
      setTodos((prev) => [newTask, ...prev]);
    }
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  // Filtered & sorted tasks
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // Status filter
        if (filter === 'active' && todo.completed) return false;
        if (filter === 'completed' && !todo.completed) return false;

        // Category filter
        if (selectedCategory !== 'all' && todo.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = todo.title.toLowerCase().includes(q);
          const matchDesc = todo.description?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned/Starred tasks on top
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        // Incomplete before completed
        if (!a.completed && b.completed) return -1;
        if (a.completed && !b.completed) return 1;
        // Recent creation
        return b.createdAt - a.createdAt;
      });
  }, [todos, filter, selectedCategory, searchQuery]);

  // Statistics
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const highPriorityTasks = todos.filter((t) => !t.completed && t.priority === 'high').length;

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative min-h-screen bg-white text-slate-800 flex flex-col justify-between overflow-x-hidden">
      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Card Container */}
        <div className="relative bg-white border border-slate-200/90 shadow-lg shadow-slate-100 rounded-3xl p-6 sm:p-8 transition-all">
          
          {/* Container Top Header with ADD TASK BUTTON AT RIGHT TOP */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <CheckCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Todo List
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {currentDateFormatted} • {activeTasks} pending {activeTasks === 1 ? 'task' : 'tasks'}
              </p>
            </div>

            {/* BUTTON ADD TASK AT RIGHT TOP OF CONTAINER */}
            <div className="flex items-center self-end sm:self-center">
              <button
                type="button"
                id="add-task-btn"
                onClick={handleOpenAddModal}
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3] transition-transform duration-200 group-hover:rotate-90" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <TodoStats
            total={totalTasks}
            completed={completedTasks}
            highPriorityCount={highPriorityTasks}
          />

          {/* Search & Filters Controls */}
          <div className="space-y-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter Tabs (All / Active / Completed) */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                {(['all', 'active', 'completed'] as FilterStatus[]).map((tab) => {
                  const isActive = filter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 flex items-center gap-1 pl-1 pr-1 font-medium">
                <ListFilter className="w-3.5 h-3.5" />
                Category:
              </span>
              {(['all', 'Work', 'Personal', 'Design', 'Dev', 'Urgent'] as const).map(
                (cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* List of Todo Items */}
          <div className="space-y-2.5 min-h-[220px]">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleOpenEditModal}
                  onToggleStar={handleToggleStar}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">
                  {searchQuery || selectedCategory !== 'all' || filter !== 'all'
                    ? 'No matching tasks found'
                    : 'All clear! No tasks on your list'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4">
                  {searchQuery || selectedCategory !== 'all' || filter !== 'all'
                    ? 'Try clearing the search or changing filter criteria to see your items.'
                    : 'Get started by creating a new task using the Add Task button above.'}
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Task
                </button>
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          {todos.length > 0 && (
            <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-200 text-xs text-slate-500">
              <span>
                Showing {filteredTodos.length} of {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
              </span>

              {completedTasks > 0 && (
                <button
                  type="button"
                  onClick={handleClearCompleted}
                  className="text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Clear Completed ({completedTasks})
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="text-center py-6 text-xs text-slate-500">
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>TaskFlow • Built with React & Tailwind CSS</span>
        </div>
      </footer>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTodo}
      />
    </div>
  );
}