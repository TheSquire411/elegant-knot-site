import { format } from 'date-fns';
import { Clock, Check } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
}

interface TaskCardProps {
  date: Date;
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

export default function TaskCard({ date, tasks, onTaskToggle }: TaskCardProps) {
  const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
  const dayName = format(date, 'EEEE');
  const dateStr = format(date, 'M.d.yy');
  
  return (
    <div className={`flex-shrink-0 w-72 p-4 rounded-lg ${isToday ? 'bg-primary-100 border-2 border-primary-300' : 'bg-white border border-sage-200'} shadow-sm`}>
      <div className="mb-3">
        <h3 className="font-semibold text-primary-700">{dayName} {dateStr}</h3>
      </div>
      
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-sage-500 text-sm italic">No tasks scheduled</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-2 rounded bg-white/50">
              <button
                onClick={() => onTaskToggle(task.id)}
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
          ))
        )}
      </div>
    </div>
  );
}