import { useState } from 'react';
import { Users, Mail, Phone, Edit3, Trash2, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Guest, GuestGroup, RSVPResponse } from '../../types/guests';

interface GuestCardProps {
  guestGroup?: GuestGroup;
  guests: Guest[];
  rsvpResponses: RSVPResponse[];
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  onAddToGroup: (groupId: string) => void;
  draggable?: boolean;
}

export default function GuestCard({ 
  guestGroup, 
  guests, 
  rsvpResponses, 
  onEdit, 
  onDelete, 
  onAddToGroup,
  draggable = false 
}: GuestCardProps) {
  const [expanded, setExpanded] = useState(false);
  
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
  const primaryGuest = guests[0];
  const additionalGuests = guests.slice(1);

  const getStatusColor = () => {
    if (rsvpStatus.attending === rsvpStatus.total) return 'bg-green-50 border-green-200';
    if (rsvpStatus.notAttending === rsvpStatus.total) return 'bg-red-50 border-red-200';
    if (rsvpStatus.pending === rsvpStatus.total) return 'bg-yellow-50 border-yellow-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getStatusIcon = () => {
    if (rsvpStatus.attending === rsvpStatus.total) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (rsvpStatus.notAttending === rsvpStatus.total) return <XCircle className="h-4 w-4 text-red-500" />;
    if (rsvpStatus.pending === rsvpStatus.total) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <Users className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div 
      className={`${getStatusColor()} rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
        draggable ? 'cursor-move' : ''
      }`}
      draggable={draggable}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="font-medium text-gray-900">
            {guestGroup?.name || `${primaryGuest?.first_name} ${primaryGuest?.last_name || ''}`.trim()}
          </h3>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {guests.length} {guests.length === 1 ? 'guest' : 'guests'}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {guestGroup && (
            <button
              onClick={() => onAddToGroup(guestGroup.id)}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
              title="Add guest to group"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Primary Guest Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm text-gray-900">
              {primaryGuest?.first_name} {primaryGuest?.last_name}
            </p>
            {primaryGuest?.email && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Mail className="h-3 w-3" />
                <span>{primaryGuest.email}</span>
              </div>
            )}
            {primaryGuest?.phone && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Phone className="h-3 w-3" />
                <span>{primaryGuest.phone}</span>
              </div>
            )}
          </div>
          
          {/* RSVP Status Summary */}
          <div className="text-right">
            <div className="flex items-center space-x-1 text-xs">
              {rsvpStatus.attending > 0 && (
                <span className="text-green-600">{rsvpStatus.attending} ✓</span>
              )}
              {rsvpStatus.notAttending > 0 && (
                <span className="text-red-600">{rsvpStatus.notAttending} ✗</span>
              )}
              {rsvpStatus.pending > 0 && (
                <span className="text-yellow-600">{rsvpStatus.pending} ?</span>
              )}
            </div>
          </div>
        </div>

        {/* Additional Guests (when expanded or if multiple) */}
        {(expanded || additionalGuests.length > 0) && additionalGuests.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Additional Guests:</p>
            {additionalGuests.map((guest) => {
              const guestRSVP = rsvpResponses.find(rsvp => rsvp.guest_id === guest.id);
              return (
                <div key={guest.id} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm text-gray-700">
                      {guest.first_name} {guest.last_name}
                      {guest.is_plus_one && <span className="text-xs text-gray-500 ml-1">(+1)</span>}
                    </p>
                    {guest.email && (
                      <p className="text-xs text-gray-500">{guest.email}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {guestRSVP?.attending === true && <CheckCircle className="h-3 w-3 text-green-500" />}
                    {guestRSVP?.attending === false && <XCircle className="h-3 w-3 text-red-500" />}
                    {(guestRSVP?.attending === null || guestRSVP?.attending === undefined) && <Clock className="h-3 w-3 text-yellow-500" />}
                    <button
                      onClick={() => onEdit(guest)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onDelete(guest.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Group Info */}
        {guestGroup && expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Group: {guestGroup.type}</span>
              <span>Max: {guestGroup.max_size}</span>
            </div>
            {guestGroup.notes && (
              <p className="text-xs text-gray-500 mt-1">{guestGroup.notes}</p>
            )}
          </div>
        )}

        {/* Dietary Restrictions */}
        {expanded && guests.some(guest => guest.dietary_restrictions) && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Dietary Restrictions:</p>
            {guests
              .filter(guest => guest.dietary_restrictions)
              .map(guest => (
                <p key={guest.id} className="text-xs text-gray-600">
                  {guest.first_name}: {guest.dietary_restrictions}
                </p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}