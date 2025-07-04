import { TimelineTask } from '../types/planning';

// Helper functions for timeline generation

export const createEarlyPlanningTasks = (weddingDate: string): TimelineTask[] => {
  const wedding = new Date(weddingDate);
  
  return [
    {
      id: 'set-date-venue',
      title: 'Set Wedding Date & Book Venue',
      description: 'Confirm your wedding date and secure your ceremony and reception venues',
      category: 'planning',
      dueDate: new Date(wedding.getTime() - 365 * 24 * 60 * 60 * 1000),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 20,
      dependencies: [],
      status: 'pending',
      bufferDays: 0,
      notes: 'This is the foundation of all other planning'
    },
    {
      id: 'book-photographer',
      title: 'Book Photographer & Videographer',
      description: 'Research and book your wedding photographer and videographer',
      category: 'vendor',
      dueDate: new Date(wedding.getTime() - 330 * 24 * 60 * 60 * 1000),
      isFlexible: true,
      priority: 'critical',
      estimatedHours: 15,
      dependencies: ['set-date-venue'],
      status: 'pending',
      bufferDays: 30,
      notes: 'Popular photographers book up quickly'
    }
  ];
};

export const createMidPlanningTasks = (weddingDate: string): TimelineTask[] => {
  const wedding = new Date(weddingDate);
  
  return [
    {
      id: 'choose-wedding-party',
      title: 'Choose Wedding Party',
      description: 'Select your bridesmaids, groomsmen, and other wedding party members',
      category: 'personal',
      dueDate: new Date(wedding.getTime() - 270 * 24 * 60 * 60 * 1000),
      isFlexible: true,
      priority: 'high',
      estimatedHours: 5,
      dependencies: [],
      status: 'pending',
      bufferDays: 14,
      notes: 'Consider their availability and commitment level'
    },
    {
      id: 'book-caterer-music',
      title: 'Book Caterer & Music',
      description: 'Secure your catering service and entertainment (DJ/band)',
      category: 'vendor',
      dueDate: new Date(wedding.getTime() - 210 * 24 * 60 * 60 * 1000),
      isFlexible: true,
      priority: 'critical',
      estimatedHours: 12,
      dependencies: ['set-date-venue'],
      status: 'pending',
      bufferDays: 21,
      notes: 'Coordinate with venue for setup requirements'
    },
    {
      id: 'order-invitations',
      title: 'Order Wedding Invitations',
      description: 'Design and order your wedding invitations and save the dates',
      category: 'planning',
      dueDate: new Date(wedding.getTime() - 150 * 24 * 60 * 60 * 1000),
      isFlexible: true,
      priority: 'high',
      estimatedHours: 8,
      dependencies: ['choose-wedding-party'],
      status: 'pending',
      bufferDays: 14,
      notes: 'Allow time for proofing and printing'
    }
  ];
};

export const createFinalPlanningTasks = (weddingDate: string): TimelineTask[] => {
  const wedding = new Date(weddingDate);
  
  return [
    {
      id: 'final-venue-walkthrough',
      title: 'Final Venue Walkthrough',
      description: 'Conduct final walkthrough with venue coordinator and key vendors',
      category: 'logistics',
      dueDate: new Date(wedding.getTime() - 75 * 24 * 60 * 60 * 1000),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 3,
      dependencies: ['book-caterer-music', 'book-photographer'],
      status: 'pending',
      bufferDays: 7,
      notes: 'Coordinate timing with all vendors'
    },
    {
      id: 'confirm-final-details',
      title: 'Confirm All Final Details',
      description: 'Confirm headcount, timeline, and special requirements with all vendors',
      category: 'vendor',
      dueDate: new Date(wedding.getTime() - 30 * 24 * 60 * 60 * 1000),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 6,
      dependencies: ['final-venue-walkthrough'],
      status: 'pending',
      bufferDays: 3,
      notes: 'Create detailed timeline for wedding day'
    },
    {
      id: 'rehearsal-dinner',
      title: 'Wedding Rehearsal & Dinner',
      description: 'Conduct ceremony rehearsal and host rehearsal dinner',
      category: 'ceremony',
      dueDate: new Date(wedding.getTime() - 1 * 24 * 60 * 60 * 1000),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 4,
      dependencies: ['confirm-final-details'],
      status: 'pending',
      bufferDays: 0,
      notes: 'Usually held the night before the wedding'
    }
  ];
};

export const createWeddingDayTasks = (weddingDate: string): TimelineTask[] => {
  const wedding = new Date(weddingDate);
  
  return [
    {
      id: 'vendor-setup-start',
      title: 'Vendor Setup Begins',
      description: 'Florist, caterer, and other vendors begin setup',
      category: 'logistics',
      dueDate: new Date(wedding.getTime()),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 4,
      dependencies: [],
      status: 'pending',
      bufferDays: 0,
      notes: 'Coordinate arrival times to avoid conflicts'
    },
    {
      id: 'bridal-prep',
      title: 'Bridal Party Preparation',
      description: 'Hair, makeup, and getting dressed',
      category: 'personal',
      dueDate: new Date(wedding.getTime()),
      isFlexible: false,
      priority: 'critical',
      estimatedHours: 4,
      dependencies: [],
      status: 'pending',
      bufferDays: 0,
      notes: 'Start early to allow buffer time'
    }
  ];
};