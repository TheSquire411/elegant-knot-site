import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { TimelineTask, TimelineConflict } from '../../types/planning';

interface TimelineViewProps {
  tasks: TimelineTask[];
  conflicts: TimelineConflict[];
  activeView: 'monthly' | 'weekly' | 'day-of';
  selectedMonth: number;
  onTaskStatusChange: (taskId: string, status: TimelineTask['status']) => void;
  onViewChange: (view: 'monthly' | 'weekly' | 'day-of') => void;
  onMonthChange: (month: number) => void;
}

const taskCategories = [
  { value: 'planning', label: 'Planning & Coordination', color: 'bg-blue-100 text-blue-800' },
  { value: 'vendor', label: 'Vendor Management', color: 'bg-purple-100 text-purple-800' },
  { value: 'personal', label: 'Personal Preparation', color: 'bg-pink-100 text-pink-800' },
  { value: 'ceremony', label: 'Ceremony Setup', color: 'bg-green-100 text-green-800' },
  { value: 'reception', label: 'Reception Setup', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'logistics', label: 'Day-of Logistics', color: 'bg-gray-100 text-gray-800' }
];

export default function TimelineView({
  tasks,
  conflicts,
  activeView,
  selectedMonth,
  onTaskStatusChange,
  onViewChange,
  onMonthChange
}: TimelineViewProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryData = taskCategories.find(cat => cat.value === category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
  };

  const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
  const warningConflicts = conflicts.filter(c => c.severity === 'warning');

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Timeline View</h3>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {(['monthly', 'weekly', 'day-of'] as const).map((view) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeView === view
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {view === 'day-of' ? 'Day Of' : view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Month selector for monthly view */}
        {activeView === 'monthly' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Months before wedding
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? 'This month' : `${i} month${i > 1 ? 's' : ''} before`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Timeline Conflicts ({conflicts.length})
          </h4>
          
          {criticalConflicts.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium text-red-700 mb-2">Critical Issues</h5>
              {criticalConflicts.map(conflict => (
                <div key={conflict.id} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                  <p className="text-red-800 font-medium">{conflict.description}</p>
                  <ul className="text-red-700 text-sm mt-1 list-disc list-inside">
                    {conflict.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {warningConflicts.length > 0 && (
            <div>
              <h5 className="font-medium text-orange-700 mb-2">Warnings</h5>
              {warningConflicts.map(conflict => (
                <div key={conflict.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-2">
                  <p className="text-orange-800 font-medium">{conflict.description}</p>
                  <ul className="text-orange-700 text-sm mt-1 list-disc list-inside">
                    {conflict.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Tasks ({tasks.length})
        </h4>
        
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No tasks found for the selected timeframe.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(task.status)}
                      <h5 className="font-semibold text-gray-800">{task.title}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Due: {task.dueDate.toLocaleDateString()}</span>
                      <span>{task.estimatedHours}h estimated</span>
                      {task.isFlexible && <span className="text-green-600">Flexible</span>}
                    </div>
                    {task.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">{task.notes}</p>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => onTaskStatusChange(task.id, e.target.value as TimelineTask['status'])}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                {task.dependencies.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Dependencies:</span> {task.dependencies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}