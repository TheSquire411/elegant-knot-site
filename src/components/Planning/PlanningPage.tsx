import { useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import { Task } from '../../types';

export default function PlanningPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Confirm all vendor details', date: '2025-07-07', time: '10:00', completed: false, notes: 'Call caterer and photographer to confirm final details' },
    { id: '2', title: 'Pick wedding day survival kit', date: '2025-07-08', completed: false },
    { id: '3', title: 'Send details to wedding party', date: '2025-07-09', time: '14:30', completed: false, notes: 'Include timeline, addresses, and contact numbers' },
    { id: '4', title: 'Pick up tux', date: '2025-07-10', completed: true },
    { id: '5', title: 'Finish visiting venues', date: '2025-07-09', completed: false },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get unique dates from tasks and sort them chronologically
  const getTaskDates = () => {
    const taskDates = [...new Set(tasks.map(task => task.date))];
    return taskDates.sort().map(dateStr => parseISO(dateStr));
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateStr);
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = (newTask: { title: string; date: string; time?: string; notes?: string }) => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false
    };
    setTasks([...tasks, task]);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-secondary-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-heading text-foreground mb-6">
            Wedding Planning
          </h1>
          <div className="text-muted-foreground max-w-2xl mx-auto">
            <p className="text-xl font-medium mb-2">Welcome to Your Wedding Journey</p>
            <p className="text-base">You've completed {completionPercentage}% of your tasks</p>
          </div>
        </div>

        {/* Countdown Checklist */}
        <div className="bg-background rounded-xl shadow-lg p-8 mb-8 animate-slide-up border border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading text-foreground">Countdown Checklist</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-normal hover:scale-105 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>

          {/* Scrollable Task Cards */}
          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-sage-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-sage-600" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {getTaskDates().map((day) => (
                <TaskCard
                  key={format(day, 'yyyy-MM-dd')}
                  date={day}
                  tasks={getTasksForDate(day)}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                />
              ))}
            </div>

            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-sage-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-sage-600" />
            </button>
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}