import { useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import BackButton from '../common/BackButton';
import { Task } from '../../types';
import { motion } from 'framer-motion';

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
        {/* Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="subheading-accent text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Countdown to Forever
          </motion.div>
          <motion.h1 
            className="section-heading mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            Wedding Planning
          </motion.h1>
          <motion.div 
            className="elegant-text max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-xl font-medium mb-2">Welcome to Your Wedding Journey</p>
            <p className="text-base">You've completed {completionPercentage}% of your tasks</p>
          </motion.div>
        </motion.div>

        {/* Countdown Checklist */}
        <motion.div 
          className="bg-background rounded-xl shadow-lg p-8 mb-8 border border-border"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h2 
              className="section-heading"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
            >
              Countdown Checklist
            </motion.h2>
            <motion.button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-normal font-medium"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Add Task
            </motion.button>
          </div>

          {/* Scrollable Task Cards */}
          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-glass backdrop-blur-glass border border-white/20 shadow-glass rounded-full p-3 hover:bg-white/30 hover:shadow-glass-lg hover:scale-105 transition-all duration-normal"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide px-16 py-4 bg-gradient-to-r from-primary-50/50 via-secondary-50/30 to-accent-50/50 rounded-xl backdrop-blur-sm border border-white/20 shadow-glass"
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-glass backdrop-blur-glass border border-white/20 shadow-glass rounded-full p-3 hover:bg-white/30 hover:shadow-glass-lg hover:scale-105 transition-all duration-normal"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </div>
        </motion.div>

        {/* Planning Tools Grid */}
        <motion.div 
          className="bg-background rounded-xl shadow-lg p-8 mb-8 border border-border"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="section-heading mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Planning Tools
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Guest List</h3>
                  <p className="text-sm text-gray-600">Manage your guests</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Add guests, organize seating, and track RSVPs.</p>
              <Link 
                to="/planning/guests" 
                className="block w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-center font-medium"
              >
                Manage Guests
              </Link>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Seating Chart</h3>
                  <p className="text-sm text-gray-600">Arrange tables</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Create interactive seating arrangements with drag-and-drop.</p>
              <Link 
                to="/planning/seating" 
                className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center font-medium"
              >
                Plan Seating
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}