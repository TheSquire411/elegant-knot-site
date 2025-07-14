import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import { Plus, Grid, Layout, Save } from 'lucide-react';
import { useSeating } from '../../../hooks/useSeating';
import { useGuests } from '../../../hooks/useGuests';
import TableCard from './TableCard';
import DraggableGuestGroup from './DraggableGuestGroup';
import AddTableModal from './AddTableModal';
import { SeatingTable } from '../../../types/guests';

export default function SeatingChart() {
  const {
    seatingTables,
    seatingAssignments,
    loading: seatingLoading,
    error: seatingError,
    createSeatingTable,
    updateSeatingTable,
    deleteSeatingTable,
    assignGuestGroupToTable,
    getTableAssignments,
    getGuestGroupTable,
    getTableAvailability
  } = useSeating();

  const {
    guestGroups,
    guests,
    rsvpResponses,
    loading: guestsLoading,
    getGroupedGuests
  } = useGuests();

  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<SeatingTable | null>(null);
  const [viewMode, setViewMode] = useState<'layout' | 'list'>('layout');

  const { grouped, ungrouped } = getGroupedGuests();

  // Get all guest groups (grouped + individual guests as single groups)
  const allGuestGroups = [
    ...guestGroups,
    ...ungrouped.map(guest => ({
      id: guest.id,
      user_id: guest.user_id,
      name: `${guest.first_name} ${guest.last_name}`.trim(),
      type: guest.relationship || 'other',
      max_size: 1,
      notes: null,
      created_at: guest.created_at,
      updated_at: guest.updated_at,
      guests: [guest]
    }))
  ];

  const handleCreateTable = async (tableData: Omit<SeatingTable, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await createSeatingTable(tableData);
  };

  const handleEditTable = (table: SeatingTable) => {
    setEditingTable(table);
    setIsAddTableModalOpen(true);
  };

  const handleUpdateTable = async (tableData: Omit<SeatingTable, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingTable) {
      await updateSeatingTable(editingTable.id, tableData);
      setEditingTable(null);
    }
  };

  const handleAssignGroup = async (guestGroupId: string, tableId: string) => {
    await assignGuestGroupToTable(guestGroupId, tableId);
  };

  // Get unassigned guest groups
  const unassignedGroups = allGuestGroups.filter(group => 
    !seatingAssignments.some(assignment => assignment.guest_group_id === group.id)
  );

  // Get assigned guest groups with their table info
  const assignedGroups = allGuestGroups.filter(group => 
    seatingAssignments.some(assignment => assignment.guest_group_id === group.id)
  );

  const totalGuests = guests.length;
  const totalCapacity = seatingTables.reduce((sum, table) => sum + table.capacity, 0);
  const assignedGuests = assignedGroups.reduce((sum, group) => sum + (group.guests?.length || 0), 0);

  if (seatingLoading || guestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading seating chart...</p>
        </div>
      </div>
    );
  }

  if (seatingError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {seatingError}</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seating Chart</h2>
            <p className="text-gray-600 mt-1">
              {assignedGuests} of {totalGuests} guests assigned • {totalCapacity} seats available
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('layout')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'layout' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Layout className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setEditingTable(null);
                setIsAddTableModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Table</span>
            </button>
          </div>
        </div>

        {viewMode === 'layout' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 min-h-[600px] relative p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Reception Layout</h3>
                
                {seatingTables.length === 0 ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Grid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-700 mb-2">No tables yet</h4>
                      <p className="text-gray-500 mb-4">Add your first table to start planning your seating arrangement</p>
                      <button
                        onClick={() => {
                          setEditingTable(null);
                          setIsAddTableModalOpen(true);
                        }}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Add First Table
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {seatingTables.map((table, index) => {
                      const assignments = getTableAssignments(table.id);
                      const assignedGroupsForTable = assignments.map(assignment => 
                        allGuestGroups.find(group => group.id === assignment.guest_group_id)
                      ).filter(Boolean) as typeof allGuestGroups;
                      
                      const availability = getTableAvailability(table.id, guestGroups);

                      return (
                        <TableCard
                          key={table.id}
                          table={table}
                          assignedGroups={assignedGroupsForTable}
                          availability={availability}
                          onEdit={handleEditTable}
                          onDelete={deleteSeatingTable}
                          onGroupAssigned={handleAssignGroup}
                          isDraggable={true}
                          gridIndex={index}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Guest Groups Sidebar */}
            <div className="space-y-6">
              {/* Unassigned Groups */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Unassigned Guests ({unassignedGroups.length})
                </h3>
                
                {unassignedGroups.length === 0 ? (
                  <div className="text-center py-8">
                    <Save className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-green-700 font-medium">All guests assigned!</p>
                    <p className="text-green-600 text-sm">Your seating chart is complete</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {unassignedGroups.map(group => {
                      const groupGuests = group.guests || (grouped[group.id] || []);
                      return (
                        <DraggableGuestGroup
                          key={group.id}
                          guestGroup={group}
                          guests={groupGuests}
                          rsvpResponses={rsvpResponses}
                          isAssigned={false}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Assigned Groups */}
              {assignedGroups.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Assigned Guests ({assignedGroups.length})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {assignedGroups.map(group => {
                      const groupGuests = group.guests || (grouped[group.id] || []);
                      const table = getGuestGroupTable(group.id);
                      return (
                        <DraggableGuestGroup
                          key={group.id}
                          guestGroup={group}
                          guests={groupGuests}
                          rsvpResponses={rsvpResponses}
                          isAssigned={true}
                          assignedTableName={table?.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seatingTables.map(table => {
              const assignments = getTableAssignments(table.id);
              const assignedGroupsForTable = assignments.map(assignment => 
                allGuestGroups.find(group => group.id === assignment.guest_group_id)
              ).filter(Boolean) as typeof allGuestGroups;
              
              const availability = getTableAvailability(table.id, guestGroups);

              return (
                <div key={table.id} className="group">
                  <TableCard
                    table={table}
                    assignedGroups={assignedGroupsForTable}
                    availability={availability}
                    onEdit={handleEditTable}
                    onDelete={deleteSeatingTable}
                    onGroupAssigned={handleAssignGroup}
                    isDraggable={false}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Table Modal */}
        <AddTableModal
          isOpen={isAddTableModalOpen}
          onClose={() => {
            setIsAddTableModalOpen(false);
            setEditingTable(null);
          }}
          onSave={editingTable ? handleUpdateTable : handleCreateTable}
          editingTable={editingTable}
        />
      </div>
    </DndProvider>
  );
}