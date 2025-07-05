import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { SeatingTable, SeatingAssignment, GuestGroup } from '../types/guests';
import { useApp } from '../context/AppContext';

export function useSeating() {
  const { state } = useApp();
  const user = state.user;
  const [seatingTables, setSeatingTables] = useState<SeatingTable[]>([]);
  const [seatingAssignments, setSeatingAssignments] = useState<SeatingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch seating data
  const fetchSeatingData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch seating tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('seating_tables')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (tablesError) throw tablesError;

      // Fetch seating assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('seating_assignments')
        .select('*')
        .eq('user_id', user.id);

      if (assignmentsError) throw assignmentsError;

      setSeatingTables(tablesData as SeatingTable[] || []);
      setSeatingAssignments(assignmentsData as SeatingAssignment[] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch seating data');
    } finally {
      setLoading(false);
    }
  };

  // Create a new seating table
  const createSeatingTable = async (tableData: Omit<SeatingTable, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('seating_tables')
        .insert([{ ...tableData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setSeatingTables(prev => [...prev, data as SeatingTable]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create seating table');
      return null;
    }
  };

  // Update seating table position
  const updateTablePosition = async (tableId: string, x: number, y: number) => {
    try {
      const { data, error } = await supabase
        .from('seating_tables')
        .update({ x_position: x, y_position: y })
        .eq('id', tableId)
        .select()
        .single();

      if (error) throw error;

      setSeatingTables(prev => prev.map(table => 
        table.id === tableId ? data as SeatingTable : table
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update table position');
      return null;
    }
  };

  // Update seating table details
  const updateSeatingTable = async (tableId: string, updates: Partial<SeatingTable>) => {
    try {
      const { data, error } = await supabase
        .from('seating_tables')
        .update(updates)
        .eq('id', tableId)
        .select()
        .single();

      if (error) throw error;

      setSeatingTables(prev => prev.map(table => 
        table.id === tableId ? data as SeatingTable : table
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update seating table');
      return null;
    }
  };

  // Delete seating table
  const deleteSeatingTable = async (tableId: string) => {
    try {
      const { error } = await supabase
        .from('seating_tables')
        .delete()
        .eq('id', tableId);

      if (error) throw error;

      setSeatingTables(prev => prev.filter(table => table.id !== tableId));
      setSeatingAssignments(prev => prev.filter(assignment => assignment.seating_table_id !== tableId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete seating table');
      return false;
    }
  };

  // Assign guest group to table
  const assignGuestGroupToTable = async (guestGroupId: string, tableId: string) => {
    if (!user) return null;

    try {
      // Remove existing assignment for this guest group
      await supabase
        .from('seating_assignments')
        .delete()
        .eq('guest_group_id', guestGroupId)
        .eq('user_id', user.id);

      // Create new assignment
      const { data, error } = await supabase
        .from('seating_assignments')
        .insert([{
          user_id: user.id,
          guest_group_id: guestGroupId,
          seating_table_id: tableId
        }])
        .select()
        .single();

      if (error) throw error;

      setSeatingAssignments(prev => [
        ...prev.filter(assignment => assignment.guest_group_id !== guestGroupId),
        data as SeatingAssignment
      ]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign guest group to table');
      return null;
    }
  };

  // Remove assignment
  const removeAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('seating_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      setSeatingAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove assignment');
      return false;
    }
  };

  // Get assignments for a specific table
  const getTableAssignments = (tableId: string) => {
    return seatingAssignments.filter(assignment => assignment.seating_table_id === tableId);
  };

  // Get table for a guest group
  const getGuestGroupTable = (guestGroupId: string) => {
    const assignment = seatingAssignments.find(assignment => assignment.guest_group_id === guestGroupId);
    if (!assignment) return null;
    return seatingTables.find(table => table.id === assignment.seating_table_id) || null;
  };

  // Check if table has space for more guests
  const getTableAvailability = (tableId: string, guestGroups: GuestGroup[]) => {
    const table = seatingTables.find(t => t.id === tableId);
    if (!table) return { available: 0, occupied: 0, capacity: 0 };

    const assignments = getTableAssignments(tableId);
    const occupiedSeats = assignments.reduce((total, assignment) => {
      const group = guestGroups.find(g => g.id === assignment.guest_group_id);
      return total + (group?.guests?.length || 0);
    }, 0);

    return {
      capacity: table.capacity,
      occupied: occupiedSeats,
      available: Math.max(0, table.capacity - occupiedSeats)
    };
  };

  useEffect(() => {
    fetchSeatingData();
  }, [user]);

  return {
    seatingTables,
    seatingAssignments,
    loading,
    error,
    createSeatingTable,
    updateTablePosition,
    updateSeatingTable,
    deleteSeatingTable,
    assignGuestGroupToTable,
    removeAssignment,
    getTableAssignments,
    getGuestGroupTable,
    getTableAvailability,
    refetch: fetchSeatingData
  };
}