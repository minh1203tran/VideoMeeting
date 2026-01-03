import React from 'react';
import { format } from 'date-fns';
import { MoreVertical, CheckCircle2, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { ACTION_ITEMS } from '../../../utils/mockData';
import { Card } from '../../common/Card';
import { cn } from '../../../utils/cn';

export const ActionItemsWidget: React.FC = () => (
  <Card className="h-full">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Action Items</h2>
        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">5 Pending</span>
      </div>
      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
    </div>
    
    <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
      {ACTION_ITEMS.slice(0, 4).map((item) => (
        <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="mt-1">
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors",
              item.status === 'Completed' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
            )}>
              {item.status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
          </div>
          <div className="flex-1">
            <p className={cn(
              "text-sm font-medium transition-all",
              item.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-200'
            )}>{item.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                item.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                item.priority === 'Medium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              )}>{item.priority}</span>
              <span className="text-xs text-gray-400 flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {new Date(item.dueDate) < new Date() && item.status !== 'Completed' ? <span className="text-red-500 font-bold">Overdue</span> : format(new Date(item.dueDate), 'MMM d')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <button className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <Plus className="w-4 h-4" /> Add Task
    </button>
  </Card>
);
