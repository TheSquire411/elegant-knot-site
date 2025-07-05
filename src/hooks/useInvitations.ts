import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useApp } from '../context/AppContext';

export interface Invitation {
  id: string;
  user_id: string;
  guest_id: string;
  email: string;
  invitation_type: string;
  sent_at?: string | null;
  opened_at?: string | null;
  rsvp_token: string;
  status: 'pending' | 'sent' | 'opened' | 'bounced' | 'rsvp_completed';
  created_at: string;
  updated_at: string;
}

export interface WeddingDetails {
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string;
  address: string;
  time: string;
}

export function useInvitations() {
  const { state } = useApp();
  const user = state.user;
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Fetch invitations
  const fetchInvitations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations((data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'sent' | 'opened' | 'bounced' | 'rsvp_completed'
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invitations');
    } finally {
      setLoading(false);
    }
  };

  // Send invitations
  const sendInvitations = async (guestIds: string[], message: string, weddingDetails: WeddingDetails) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      setSending(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('send-wedding-invitations', {
        body: {
          guestIds,
          message,
          weddingDetails
        }
      });

      if (error) throw error;

      // Refresh invitations after sending
      await fetchInvitations();

      return { success: true, results: data.results };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitations';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSending(false);
    }
  };

  // Get invitation status for a guest
  const getGuestInvitationStatus = (guestId: string) => {
    return invitations.find(inv => inv.guest_id === guestId);
  };

  // Get invitation statistics
  const getInvitationStats = () => {
    const stats = {
      total: invitations.length,
      sent: invitations.filter(inv => inv.status === 'sent').length,
      opened: invitations.filter(inv => inv.status === 'opened').length,
      rsvp_completed: invitations.filter(inv => inv.status === 'rsvp_completed').length,
      pending: invitations.filter(inv => inv.status === 'pending').length,
      bounced: invitations.filter(inv => inv.status === 'bounced').length
    };
    return stats;
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  return {
    invitations,
    loading,
    error,
    sending,
    sendInvitations,
    getGuestInvitationStatus,
    getInvitationStats,
    refetch: fetchInvitations
  };
}