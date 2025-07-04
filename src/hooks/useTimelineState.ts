import { useReducer, useEffect } from 'react';
import { TimelineTask, Vendor, TimelineConflict } from '../types/planning';
import { createEarlyPlanningTasks, createMidPlanningTasks, createFinalPlanningTasks, createWeddingDayTasks } from '../utils/timelineHelpers';

interface TimelineState {
  weddingDate: string;
  vendors: Vendor[];
  timeline: TimelineTask[];
  conflicts: TimelineConflict[];
  showVendorForm: boolean;
  showTaskForm: boolean;
  activeView: 'monthly' | 'weekly' | 'day-of';
  selectedMonth: number;
  isLoading: boolean;
  error: string | null;
}

type TimelineAction =
  | { type: 'SET_WEDDING_DATE'; payload: string }
  | { type: 'ADD_VENDOR'; payload: Vendor }
  | { type: 'ADD_TASK'; payload: TimelineTask }
  | { type: 'SET_TIMELINE'; payload: TimelineTask[] }
  | { type: 'SET_CONFLICTS'; payload: TimelineConflict[] }
  | { type: 'TOGGLE_VENDOR_FORM'; payload?: boolean }
  | { type: 'TOGGLE_TASK_FORM'; payload?: boolean }
  | { type: 'SET_ACTIVE_VIEW'; payload: 'monthly' | 'weekly' | 'day-of' }
  | { type: 'SET_SELECTED_MONTH'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: TimelineTask['status'] } };

const initialState: TimelineState = {
  weddingDate: '',
  vendors: [],
  timeline: [],
  conflicts: [],
  showVendorForm: false,
  showTaskForm: false,
  activeView: 'monthly',
  selectedMonth: 0,
  isLoading: false,
  error: null,
};

function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'SET_WEDDING_DATE':
      return { ...state, weddingDate: action.payload };
    
    case 'ADD_VENDOR':
      return { 
        ...state, 
        vendors: [...state.vendors, action.payload],
        showVendorForm: false 
      };
    
    case 'ADD_TASK':
      return { 
        ...state, 
        timeline: [...state.timeline, action.payload].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
        showTaskForm: false 
      };
    
    case 'SET_TIMELINE':
      return { ...state, timeline: action.payload };
    
    case 'SET_CONFLICTS':
      return { ...state, conflicts: action.payload };
    
    case 'TOGGLE_VENDOR_FORM':
      return { ...state, showVendorForm: action.payload ?? !state.showVendorForm };
    
    case 'TOGGLE_TASK_FORM':
      return { ...state, showTaskForm: action.payload ?? !state.showTaskForm };
    
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    
    case 'SET_SELECTED_MONTH':
      return { ...state, selectedMonth: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        timeline: state.timeline.map(task =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.status }
            : task
        )
      };
    
    default:
      return state;
  }
}

export function useTimelineState() {
  const [state, dispatch] = useReducer(timelineReducer, initialState);

  const generateBaseTimeline = (weddingDate: string): TimelineTask[] => {
    if (!weddingDate) return [];

    const earlyTasks = createEarlyPlanningTasks(weddingDate);
    const midTasks = createMidPlanningTasks(weddingDate);
    const finalTasks = createFinalPlanningTasks(weddingDate);
    const weddingDayTasks = createWeddingDayTasks(weddingDate);

    return [...earlyTasks, ...midTasks, ...finalTasks, ...weddingDayTasks];
  };

  const detectConflicts = (): TimelineConflict[] => {
    const detectedConflicts: TimelineConflict[] = [];

    // Check for tight deadlines
    state.timeline.forEach(task => {
      const daysUntilDue = Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue < task.bufferDays && task.status === 'pending') {
        detectedConflicts.push({
          id: `tight-${task.id}`,
          type: 'tight-deadline',
          severity: daysUntilDue < 0 ? 'critical' : 'warning',
          description: `Task "${task.title}" has insufficient buffer time`,
          affectedTasks: [task.id],
          suggestions: [
            'Consider moving the deadline earlier',
            'Allocate more resources to complete faster',
            'Break down into smaller, manageable tasks'
          ]
        });
      }
    });

    // Check for vendor setup conflicts on wedding day
    if (state.weddingDate) {
      const vendorSetupTimes = state.vendors.map(vendor => ({
        vendor,
        startTime: vendor.arrivalTime,
        endTime: new Date(new Date(`2000-01-01 ${vendor.arrivalTime}`).getTime() + vendor.setupTime * 60 * 60 * 1000).toTimeString().slice(0, 5)
      }));

      for (let i = 0; i < vendorSetupTimes.length; i++) {
        for (let j = i + 1; j < vendorSetupTimes.length; j++) {
          const vendor1 = vendorSetupTimes[i];
          const vendor2 = vendorSetupTimes[j];
          
          if (vendor1.startTime < vendor2.endTime && vendor2.startTime < vendor1.endTime) {
            detectedConflicts.push({
              id: `vendor-overlap-${vendor1.vendor.id}-${vendor2.vendor.id}`,
              type: 'vendor-overlap',
              severity: 'warning',
              description: `${vendor1.vendor.name} and ${vendor2.vendor.name} have overlapping setup times`,
              affectedTasks: [],
              suggestions: [
                'Stagger vendor arrival times',
                'Designate separate setup areas',
                'Coordinate with venue for space allocation'
              ]
            });
          }
        }
      }
    }

    return detectedConflicts;
  };

  const generateTimeline = () => {
    if (!state.weddingDate) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const baseTimeline = generateBaseTimeline(state.weddingDate);
      
      // Add vendor-specific tasks
      const vendorTasks: TimelineTask[] = [];
      state.vendors.forEach(vendor => {
        if (!vendor.isConfirmed) {
          vendorTasks.push({
            id: `confirm-${vendor.id}`,
            title: `Confirm ${vendor.name}`,
            description: `Finalize contract and details with ${vendor.name}`,
            category: 'vendor',
            dueDate: new Date(new Date(state.weddingDate).getTime() - 60 * 24 * 60 * 60 * 1000),
            isFlexible: true,
            priority: 'high',
            estimatedHours: 2,
            dependencies: [],
            vendorId: vendor.id,
            status: 'pending',
            bufferDays: 14,
            notes: `Contact: ${vendor.contact}`
          });
        }
      });

      const fullTimeline = [...baseTimeline, ...vendorTasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
      dispatch({ type: 'SET_TIMELINE', payload: fullTimeline });
      
      // Detect conflicts after timeline is set
      setTimeout(() => {
        const newConflicts = detectConflicts();
        dispatch({ type: 'SET_CONFLICTS', payload: newConflicts });
      }, 100);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate timeline' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getTasksByTimeframe = (timeframe: 'monthly' | 'weekly' | 'day-of') => {
    if (!state.weddingDate) return [];
    
    const wedding = new Date(state.weddingDate);

    switch (timeframe) {
      case 'monthly':
        const monthStart = new Date(wedding.getTime() - (state.selectedMonth + 1) * 30 * 24 * 60 * 60 * 1000);
        const monthEnd = new Date(wedding.getTime() - state.selectedMonth * 30 * 24 * 60 * 60 * 1000);
        return state.timeline.filter(task => task.dueDate >= monthStart && task.dueDate <= monthEnd);
      
      case 'weekly':
        const weekStart = new Date(wedding.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekEnd = wedding;
        return state.timeline.filter(task => task.dueDate >= weekStart && task.dueDate <= weekEnd);
      
      case 'day-of':
        return state.timeline.filter(task => task.dueDate.toDateString() === wedding.toDateString());
      
      default:
        return state.timeline;
    }
  };

  // Auto-generate timeline when wedding date or vendors change
  useEffect(() => {
    if (state.weddingDate) {
      generateTimeline();
    }
  }, [state.weddingDate, state.vendors]);

  return {
    state,
    dispatch,
    generateTimeline,
    getTasksByTimeframe,
    detectConflicts,
  };
}