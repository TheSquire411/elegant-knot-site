import { useState } from 'react';
import { Users, Search, Plus, Download, Mail } from 'lucide-react';
import { useGuests } from '../../hooks/useGuests';
import GuestCard from './GuestCard';
import AddGuestModal from './AddGuestModal';
import BackButton from '../common/BackButton';

export default function GuestListPage() {
  const {
    guests,
    guestGroups,
    rsvpResponses,
    loading,
    error,
    createGuestGroup,
    addGuest,
    deleteGuest,
    getGroupedGuests
  } = useGuests();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'not-attending' | 'pending'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { grouped, ungrouped } = getGroupedGuests();

  // Filter groups based on search and status
  const filteredGroups = guestGroups.filter((group: any) => {
    const groupGuests = grouped[group.id] || [];
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         groupGuests.some((guest: any) => 
                           `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    
    const rsvpStatuses = groupGuests.map((guest: any) => 
      rsvpResponses.find((rsvp: any) => rsvp.guest_id === guest.id)?.attending
    );

    switch (filterStatus) {
      case 'attending':
        return rsvpStatuses.some((status: any) => status === true);
      case 'not-attending':
        return rsvpStatuses.some((status: any) => status === false);
      case 'pending':
        return rsvpStatuses.some((status: any) => status === null || status === undefined);
      default:
        return true;
    }
  });

  const handleAddGuests = async (groupName: string, guestData: any[]) => {
    try {
      // Create guest group
      const group = await createGuestGroup({
        name: groupName,
        type: guestData[0]?.relationship || 'friends',
        max_size: Math.max(8, guestData.length),
        notes: null
      });

      if (!group) return;

      // Add guests to the group
      for (const guest of guestData) {
        await addGuest({
          ...guest,
          guest_group_id: group.id
        });
      }
    } catch (err) {
      console.error('Failed to add guests:', err);
    }
  };

  const handleEditGuest = (_guest: any) => {
    // TODO: Open edit modal
  };

  const handleAddToGroup = (_groupId: string) => {
    // TODO: Open modal to add guest to existing group
  };

  const stats = {
    totalGuests: guests.length,
    totalGroups: guestGroups.length,
    attending: rsvpResponses.filter((rsvp: any) => rsvp.attending === true).length,
    notAttending: rsvpResponses.filter((rsvp: any) => rsvp.attending === false).length,
    pending: guests.length - rsvpResponses.length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading guests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guest List</h1>
          <p className="text-gray-600 mt-2">Manage your wedding guests and seating arrangements</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Guests</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Total Guests</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">{stats.totalGuests}</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">Groups</span>
          </div>
          <div className="text-2xl font-bold text-purple-800">{stats.totalGroups}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-700">Attending</span>
          </div>
          <div className="text-2xl font-bold text-green-800">{stats.attending}</div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-red-700">Not Attending</span>
          </div>
          <div className="text-2xl font-bold text-red-800">{stats.notAttending}</div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search guests or groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Guests</option>
            <option value="attending">Attending</option>
            <option value="not-attending">Not Attending</option>
            <option value="pending">Pending RSVP</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Mail className="h-4 w-4" />
            <span>Send Invites</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group: any) => {
          const groupGuests = grouped[group.id] || [];
          if (groupGuests.length === 0) return null;
          
          return (
            <GuestCard
              key={group.id}
              guestGroup={group}
              guests={groupGuests}
              rsvpResponses={rsvpResponses}
              onEdit={handleEditGuest}
              onDelete={deleteGuest}
              onAddToGroup={handleAddToGroup}
            />
          );
        })}

        {/* Ungrouped guests */}
        {ungrouped.map((guest: any) => (
          <GuestCard
            key={guest.id}
            guests={[guest]}
            rsvpResponses={rsvpResponses}
            onEdit={handleEditGuest}
            onDelete={deleteGuest}
            onAddToGroup={handleAddToGroup}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && ungrouped.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No guests found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first guests to your wedding'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Your First Guests
            </button>
          )}
        </div>
      )}

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddGuests}
      />
    </div>
  );
}