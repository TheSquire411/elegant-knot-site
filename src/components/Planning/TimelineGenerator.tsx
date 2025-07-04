import { Download, Save, Plus } from 'lucide-react';
import { TimelineTask, Vendor } from '../../types/planning';
import { useTimelineState } from '../../hooks/useTimelineState';
import VendorForm from './VendorForm';
import TimelineView from './TimelineView';

interface TimelineGeneratorProps {
  onSaveTimeline?: (timeline: TimelineTask[]) => void;
}

export default function TimelineGenerator({ onSaveTimeline }: TimelineGeneratorProps) {
  const { state, dispatch, getTasksByTimeframe } = useTimelineState();

  const addVendor = (vendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: Date.now().toString()
    };
    dispatch({ type: 'ADD_VENDOR', payload: newVendor });
  };

  const handleTaskStatusChange = (taskId: string, status: TimelineTask['status']) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } });
  };

  const exportTimeline = () => {
    const csvContent = [
      ['Task', 'Category', 'Due Date', 'Priority', 'Flexible', 'Status', 'Estimated Hours', 'Notes'],
      ...state.timeline.map(task => [
        task.title,
        task.category,
        task.dueDate.toLocaleDateString(),
        task.priority,
        task.isFlexible ? 'Yes' : 'No',
        task.status,
        task.estimatedHours,
        task.notes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-timeline-${new Date(state.weddingDate).toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tasksForCurrentView = getTasksByTimeframe(state.activeView);

  if (state.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {state.error}</p>
        <button
          onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Wedding Planning Timeline</h2>
        <p className="text-xl text-gray-600">Personalized timeline with vendor coordination and conflict detection</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
            <input
              type="date"
              value={state.weddingDate}
              onChange={(e) => dispatch({ type: 'SET_WEDDING_DATE', payload: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_VENDOR_FORM', payload: true })}
              disabled={state.isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vendor</span>
            </button>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={exportTimeline}
              disabled={state.timeline.length === 0 || state.isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
          
          <div className="flex items-end">
            {onSaveTimeline && (
              <button
                onClick={() => onSaveTimeline(state.timeline)}
                disabled={state.timeline.length === 0 || state.isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Timeline</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {state.isLoading && (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Generating your timeline...</p>
        </div>
      )}

      {/* Vendors List */}
      {state.vendors.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmed Vendors ({state.vendors.length})</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {state.vendors.map(vendor => (
              <div key={vendor.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{vendor.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    vendor.isConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vendor.isConfirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Type: {vendor.type}</p>
                <p className="text-sm text-gray-600 mb-1">Contact: {vendor.contact}</p>
                <p className="text-sm text-gray-600">Setup: {vendor.setupTime}h from {vendor.arrivalTime}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {state.timeline.length > 0 && (
        <TimelineView
          tasks={tasksForCurrentView}
          conflicts={state.conflicts}
          activeView={state.activeView}
          selectedMonth={state.selectedMonth}
          onTaskStatusChange={handleTaskStatusChange}
          onViewChange={(view) => dispatch({ type: 'SET_ACTIVE_VIEW', payload: view })}
          onMonthChange={(month) => dispatch({ type: 'SET_SELECTED_MONTH', payload: month })}
        />
      )}

      {/* Vendor Form Modal */}
      {state.showVendorForm && (
        <VendorForm
          onSubmit={addVendor}
          onClose={() => dispatch({ type: 'TOGGLE_VENDOR_FORM', payload: false })}
        />
      )}
    </div>
  );
}