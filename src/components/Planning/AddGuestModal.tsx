import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { GuestRelationship } from '../../types/guests';

interface GuestFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dietary_restrictions: string;
  notes: string;
  relationship: GuestRelationship;
  is_plus_one: boolean;
}

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupName: string, guests: GuestFormData[]) => void;
}

const relationshipOptions: { value: GuestRelationship; label: string }[] = [
  { value: 'family', label: 'Family' },
  { value: 'friends', label: 'Friends' },
  { value: 'colleagues', label: 'Colleagues' },
  { value: 'bride_family', label: 'Bride\'s Family' },
  { value: 'groom_family', label: 'Groom\'s Family' },
  { value: 'bride_friends', label: 'Bride\'s Friends' },
  { value: 'groom_friends', label: 'Groom\'s Friends' },
  { value: 'other', label: 'Other' },
];

export default function AddGuestModal({ isOpen, onClose, onSave }: AddGuestModalProps) {
  const [groupName, setGroupName] = useState('');
  const [guests, setGuests] = useState<GuestFormData[]>([
    {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      dietary_restrictions: '',
      notes: '',
      relationship: 'friends',
      is_plus_one: false
    }
  ]);

  const addGuest = () => {
    setGuests([
      ...guests,
      {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        dietary_restrictions: '',
        notes: '',
        relationship: 'friends',
        is_plus_one: true
      }
    ]);
  };

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const updateGuest = (index: number, field: keyof GuestFormData, value: string | boolean) => {
    const updatedGuests = guests.map((guest, i) => 
      i === index ? { ...guest, [field]: value } : guest
    );
    setGuests(updatedGuests);
  };

  const handleSave = () => {
    const validGuests = guests.filter(guest => guest.first_name.trim());
    if (validGuests.length === 0) return;

    const finalGroupName = groupName.trim() || 
      (validGuests.length === 1 
        ? `${validGuests[0].first_name} ${validGuests[0].last_name}`.trim()
        : `${validGuests[0].first_name}'s Group`);

    onSave(finalGroupName, validGuests);
    handleClose();
  };

  const handleClose = () => {
    setGroupName('');
    setGuests([{
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      dietary_restrictions: '',
      notes: '',
      relationship: 'friends',
      is_plus_one: false
    }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Guests</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name (optional)
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Smith Family, College Friends"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              If left blank, will be auto-generated from the first guest's name
            </p>
          </div>

          {/* Guests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Guests</h3>
              <button
                onClick={addGuest}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Guest</span>
              </button>
            </div>

            {guests.map((guest, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">
                    Guest {index + 1}
                    {guest.is_plus_one && <span className="text-sm text-gray-500 ml-2">(+1)</span>}
                  </h4>
                  {guests.length > 1 && (
                    <button
                      onClick={() => removeGuest(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={guest.first_name}
                      onChange={(e) => updateGuest(index, 'first_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={guest.last_name}
                      onChange={(e) => updateGuest(index, 'last_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={guest.email}
                      onChange={(e) => updateGuest(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => updateGuest(index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    <select
                      value={guest.relationship}
                      onChange={(e) => updateGuest(index, 'relationship', e.target.value as GuestRelationship)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {relationshipOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dietary Restrictions
                    </label>
                    <input
                      type="text"
                      value={guest.dietary_restrictions}
                      onChange={(e) => updateGuest(index, 'dietary_restrictions', e.target.value)}
                      placeholder="e.g., Vegetarian, Gluten-free"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={guest.notes}
                    onChange={(e) => updateGuest(index, 'notes', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            disabled={guests.every(guest => !guest.first_name.trim())}
          >
            Add Guests
          </button>
        </div>
      </div>
    </div>
  );
}