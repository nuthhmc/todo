import React from 'react';
import { CheckCircle2, ListTodo, Flame } from 'lucide-react';

interface TodoStatsProps {
  total: number;
  completed: number;
  highPriorityCount: number;
}

export const TodoStats: React.FC<TodoStatsProps> = ({
  total,
  completed,
  highPriorityCount,
}) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-6">
      {/* Top summary row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <ListTodo className="w-4 h-4 text-indigo-600" />
            <span>Total:</span>
            <span className="font-semibold text-slate-900">{total}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Done:</span>
            <span className="font-semibold text-emerald-600">{completed}</span>
          </div>
          {highPriorityCount > 0 && (
            <div className="hidden xs:flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <Flame className="w-4 h-4" />
              <span>Urgent:</span>
              <span className="font-semibold">{highPriorityCount}</span>
            </div>
          )}
        </div>

        <div className="text-xs font-semibold text-indigo-600">
          {percentage}% Completed
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-slate-200/90 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
