// Planning-related types

export interface TimelineTask {
  id: string;
  title: string;
  description: string;
  category: 'planning' | 'vendor' | 'personal' | 'ceremony' | 'reception' | 'logistics';
  dueDate: Date;
  isFlexible: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours: number;
  dependencies: string[];
  vendorId?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  bufferDays: number;
  notes: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'photographer' | 'videographer' | 'florist' | 'caterer' | 'dj' | 'band' | 'venue' | 'planner' | 'transportation' | 'other';
  contact: string;
  setupTime: number; // hours needed for setup
  arrivalTime: string; // when they need to arrive
  requirements: string[];
  isConfirmed: boolean;
}

export interface TimelineConflict {
  id: string;
  type: 'vendor-overlap' | 'tight-deadline' | 'dependency-issue' | 'resource-conflict';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  affectedTasks: string[];
  suggestions: string[];
}