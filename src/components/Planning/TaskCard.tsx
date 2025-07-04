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
    <div className={`flex-shrink-0 w-80 p-6 rounded-xl border transition-all duration-normal hover:shadow-lg ${
      isToday ? 'bg-gradient-primary/10 border-primary shadow-lg' : 'bg-background border-border'
    }`}>
      <div className="mb-4">
        <h3 className="font-heading text-lg text-foreground">{dayName}</h3>
        <p className="text-sm text-muted-foreground">{dateStr}</p>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-muted/50 rounded-lg overflow-hidden border border-border/50">
            <div 
              className="flex items-start gap-4 p-4 cursor-pointer hover:bg-muted/80 transition-all duration-fast"
              onClick={() => handleTaskClick(task.id, task.notes)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskToggle(task.id);
                }}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-fast ${
                  task.completed 
                    ? 'bg-accent border-accent text-white shadow-md' 
                    : 'border-border hover:border-primary'
                }`}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </p>
                {task.time && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground font-medium">{task.time}</span>
                  </div>
                )}
              </div>
            </div>

            {expandedTask === task.id && (
              <div className="px-4 pb-4 border-t border-border/50 bg-background/50">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Notes</span>
                    {editingNotes !== task.id && (
                      <button
                        onClick={() => handleNotesEdit(task.id, task.notes)}
                        className="text-muted-foreground hover:text-primary transition-colors p-1 hover:bg-muted rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {editingNotes === task.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        placeholder="Add notes for this task..."
                        className="w-full p-3 text-sm border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleNotesSave(task.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-primary text-white text-sm rounded-lg hover:shadow-md transition-all hover:scale-105 font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleNotesCancel}
                          className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-secondary-200 hover:text-foreground transition-all font-medium"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-background border border-border rounded-lg p-3 min-h-[3rem] text-sm text-foreground">
                      {task.notes || <span className="text-muted-foreground italic">No notes added yet...</span>}
                    </div>
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