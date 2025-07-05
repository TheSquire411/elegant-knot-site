import { useDrag } from 'react-dnd';
import { Users, UserPlus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { GuestGroup, Guest, RSVPResponse } from '../../../types/guests';

interface DraggableGuestGroupProps {
  guestGroup?: GuestGroup;
  guests: Guest[];
  rsvpResponses: RSVPResponse[];
  isAssigned: boolean;
  assignedTableName?: string;
}

const DRAG_TYPES = {
  GUEST_GROUP: 'guestGroup'
};

export default function DraggableGuestGroup({
  guestGroup,
  guests,
  rsvpResponses,
  isAssigned,
  assignedTableName
}: DraggableGuestGroupProps) {
  const guestCount = guests.length;
  const primaryGuest = guests[0];

  // Drag functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPES.GUEST_GROUP,
    item: { 
      id: guestGroup?.id || primaryGuest?.id || 'unknown',
      type: DRAG_TYPES.GUEST_GROUP,
      guestCount: guestCount
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Get RSVP status for the group
  const getRSVPStatus = () => {
    const responses = guests.map(guest => 
      rsvpResponses.find(rsvp => rsvp.guest_id === guest.id)
    );
    
    const attending = responses.filter(rsvp => rsvp?.attending === true).length;
    const notAttending = responses.filter(rsvp => rsvp?.attending === false).length;
    const pending = responses.filter(rsvp => rsvp?.attending === null || rsvp?.attending === undefined).length;
    
    return { attending, notAttending, pending, total: guests.length };
  };

  const rsvpStatus = getRSVPStatus();

  const getStatusColor = () => {
    if (isAssigned) return 'bg-blue-50 border-blue-200';
    if (rsvpStatus.attending === rsvpStatus.total) return 'bg-green-50 border-green-200';
    if (rsvpStatus.notAttending === rsvpStatus.total) return 'bg-red-50 border-red-200';
    if (rsvpStatus.pending === rsvpStatus.total) return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getStatusIcon = () => {
    if (isAssigned) return <UserPlus className="h-4 w-4 text-blue-500" />;
    if (rsvpStatus.attending === rsvpStatus.total) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (rsvpStatus.notAttending === rsvpStatus.total) return <XCircle className="h-4 w-4 text-red-500" />;
    if (rsvpStatus.pending === rsvpStatus.total) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <Users className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div
      ref={drag}
      className={`
        ${getStatusColor()} rounded-lg border-2 p-3 cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50 transform rotate-2 scale-95' : 'hover:shadow-md'}
        ${isAssigned ? 'ring-1 ring-blue-300' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h4 className="font-medium text-gray-900 text-sm">
            {guestGroup?.name || `${primaryGuest?.first_name} ${primaryGuest?.last_name || ''}`.trim()}
          </h4>
        </div>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
          {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
        </span>
      </div>

      {/* Primary Guest Info */}
      <div className="text-xs text-gray-600 mb-2">
        <p className="font-medium">{primaryGuest?.first_name} {primaryGuest?.last_name}</p>
        {guests.length > 1 && (
          <p>+{guests.length - 1} {guests.length === 2 ? 'other' : 'others'}</p>
        )}
      </div>

      {/* Assignment Status */}
      {isAssigned && assignedTableName && (
        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-2">
          Assigned to {assignedTableName}
        </div>
      )}

      {/* RSVP Status */}
      <div className="flex items-center space-x-2 text-xs mt-2">
        {rsvpStatus.attending > 0 && (
          <span className="text-green-600 flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>{rsvpStatus.attending}</span>
          </span>
        )}
        {rsvpStatus.notAttending > 0 && (
          <span className="text-red-600 flex items-center space-x-1">
            <XCircle className="h-3 w-3" />
            <span>{rsvpStatus.notAttending}</span>
          </span>
        )}
        {rsvpStatus.pending > 0 && (
          <span className="text-yellow-600 flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{rsvpStatus.pending}</span>
          </span>
        )}
      </div>

      {/* Drag Indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-200 bg-opacity-30 rounded-lg flex items-center justify-center">
          <span className="text-blue-700 text-xs font-medium">Dragging...</span>
        </div>
      )}
    </div>
  );
}