import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Guest, GuestGroup, RSVPResponse } from '../types/guests';
import { useApp } from '../context/AppContext';

export function useGuests() {
  const { state } = useApp();
  const user = state.user;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestGroups, setGuestGroups] = useState<GuestGroup[]>([]);
  const [rsvpResponses, setRSVPResponses] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all guest data
  const fetchGuests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch guests
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (guestsError) throw guestsError;

      // Fetch guest groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('guest_groups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (groupsError) throw groupsError;

      // Fetch RSVP responses
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('user_id', user.id);

      if (rsvpError) throw rsvpError;

      setGuests(guestsData || []);
      setGuestGroups(groupsData || []);
      setRSVPResponses(rsvpData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };

  // Create a new guest group
  const createGuestGroup = async (groupData: Omit<GuestGroup, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('guest_groups')
        .insert([{ ...groupData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setGuestGroups(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create guest group');
      return null;
    }
  };

  // Add a guest to a group
  const addGuest = async (guestData: Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([{ ...guestData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setGuests(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add guest');
      return null;
    }
  };

  // Update guest
  const updateGuest = async (guestId: string, updates: Partial<Guest>) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', guestId)
        .select()
        .single();

      if (error) throw error;

      setGuests(prev => prev.map(guest => 
        guest.id === guestId ? data : guest
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guest');
      return null;
    }
  };

  // Delete guest
  const deleteGuest = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      setGuests(prev => prev.filter(guest => guest.id !== guestId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guest');
      return false;
    }
  };

  // Delete guest group
  const deleteGuestGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('guest_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setGuestGroups(prev => prev.filter(group => group.id !== groupId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guest group');
      return false;
    }
  };

  // Get RSVP status for a guest
  const getGuestRSVP = (guestId: string) => {
    return rsvpResponses.find(rsvp => rsvp.guest_id === guestId);
  };

  // Get guests grouped by their group assignment
  const getGroupedGuests = () => {
    const grouped: { [key: string]: Guest[] } = {};
    const ungrouped: Guest[] = [];

    guests.forEach(guest => {
      if (guest.guest_group_id) {
        if (!grouped[guest.guest_group_id]) {
          grouped[guest.guest_group_id] = [];
        }
        grouped[guest.guest_group_id].push(guest);
      } else {
        ungrouped.push(guest);
      }
    });

    return { grouped, ungrouped };
  };

  useEffect(() => {
    fetchGuests();
  }, [user]);

  return {
    guests,
    guestGroups,
    rsvpResponses,
    loading,
    error,
    createGuestGroup,
    addGuest,
    updateGuest,
    deleteGuest,
    deleteGuestGroup,
    getGuestRSVP,
    getGroupedGuests,
    refetch: fetchGuests
  };
}