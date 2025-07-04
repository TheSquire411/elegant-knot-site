import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Check, Edit3, Save, X } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  date: Date;
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export default function TaskCard({ date, tasks, onTaskToggle, onTaskUpdate }: TaskCardProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');

  const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
  const dayName = format(date, 'EEEE');
  const dateStr = format(date, 'M.d.yy');

  const handleTaskClick = (taskId: string, notes: string = '') => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskId);
      setNotesValue(notes);
    }
    setEditingNotes(null);
  };

  const handleNotesEdit = (taskId: string, currentNotes: string = '') => {
    setEditingNotes(taskId);
    setNotesValue(currentNotes);
  };

  const handleNotesSave = (taskId: string) => {
    onTaskUpdate(taskId, { notes: notesValue });
    setEditingNotes(null);
  };

  const handleNotesCancel = () => {
    setEditingNotes(null);
    setNotesValue('');
  };
  
  return (
    <div className={`flex-shrink-0 w-72 p-4 rounded-lg ${isToday ? 'bg-primary-100 border-2 border-primary-300' : 'bg-white border border-sage-200'} shadow-sm`}>
      <div className="mb-3">
        <h3 className="font-semibold text-primary-700">{dayName} {dateStr}</h3>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white/50 rounded overflow-hidden">
            <div 
              className="flex items-start gap-3 p-2 cursor-pointer hover:bg-white/70 transition-colors"
              onClick={() => handleTaskClick(task.id, task.notes)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskToggle(task.id);
                }}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'border-sage-300 hover:border-primary-400'
                }`}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.completed ? 'line-through text-sage-500' : 'text-primary-700'}`}>
                  {task.title}
                </p>
                {task.time && (
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-sage-400" />
                    <span className="text-xs text-sage-500">{task.time}</span>
                  </div>
                )}
              </div>
            </div>

            {expandedTask === task.id && (
              <div className="px-2 pb-2 border-t border-sage-100">
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-sage-600">Notes</span>
                    {editingNotes !== task.id && (
                      <button
                        onClick={() => handleNotesEdit(task.id, task.notes)}
                        className="text-sage-500 hover:text-primary-500 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  
                  {editingNotes === task.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        placeholder="Add notes for this task..."
                        className="w-full p-2 text-xs border border-sage-200 rounded resize-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleNotesSave(task.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={handleNotesCancel}
                          className="flex items-center gap-1 px-2 py-1 bg-sage-200 text-sage-700 text-xs rounded hover:bg-sage-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-sage-600 bg-sage-50 p-2 rounded min-h-[2rem]">
                      {task.notes || 'No notes added yet...'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}