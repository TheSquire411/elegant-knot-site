import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { RSVPResponse, Guest } from '../types/guests';
import { Invitation } from './useInvitations';

export interface RSVPData {
  invitation: Invitation;
  guest: Guest;
  weddingDetails: {
    brideName: string;
    groomName: string;
    weddingDate: string;
    venue: string;
    address: string;
    time: string;
  };
  existingResponse?: RSVPResponse;
}

export interface RSVPFormData {
  attending: boolean;
  meal_choice?: string;
  additional_notes?: string;
  plus_one_name?: string;
  plus_one_attending?: boolean;
}

export function useRSVP(token: string) {
  const [data, setData] = useState<RSVPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch RSVP data by token
  const fetchRSVPData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get invitation by token
      const { data: invitation, error: invitationError } = await supabase
        .from('invitations')
        .select('*')
        .eq('rsvp_token', token)
        .single();

      if (invitationError) throw new Error('Invalid or expired invitation link');

      // Get guest details
      const { data: guest, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('id', invitation.guest_id)
        .single();

      if (guestError) throw new Error('Guest not found');

      // Check for existing RSVP response
      const { data: existingResponse } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('guest_id', guest.id)
        .eq('user_id', invitation.user_id)
        .single();

      // Mark invitation as opened if not already
      if (invitation.status !== 'opened' && invitation.status !== 'rsvp_completed') {
        await supabase
          .from('invitations')
          .update({ 
            status: 'opened',
            opened_at: new Date().toISOString()
          })
          .eq('id', invitation.id);
      }

      // Mock wedding details (in a real app, you'd fetch this from the user's data)
      const weddingDetails = {
        brideName: 'Bride',
        groomName: 'Groom',
        weddingDate: 'June 15, 2024',
        venue: 'Beautiful Venue',
        address: '123 Wedding St, City, State',
        time: '4:00 PM'
      };

      setData({
        invitation: {
          ...invitation,
          status: invitation.status as 'pending' | 'sent' | 'opened' | 'bounced' | 'rsvp_completed'
        },
        guest,
        weddingDetails,
        existingResponse: existingResponse || undefined
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load RSVP data');
    } finally {
      setLoading(false);
    }
  };

  // Submit RSVP response
  const submitRSVP = async (formData: RSVPFormData) => {
    if (!data) return { success: false, error: 'No RSVP data available' };

    try {
      setSubmitting(true);
      setError(null);

      const rsvpData = {
        user_id: data.invitation.user_id,
        guest_id: data.guest.id,
        attending: formData.attending,
        meal_choice: formData.meal_choice,
        additional_notes: formData.additional_notes,
        plus_one_name: formData.plus_one_name,
        plus_one_attending: formData.plus_one_attending,
        response_date: new Date().toISOString()
      };

      // Insert or update RSVP response
      const { error: rsvpError } = data.existingResponse
        ? await supabase
            .from('rsvp_responses')
            .update(rsvpData)
            .eq('id', data.existingResponse.id)
        : await supabase
            .from('rsvp_responses')
            .insert(rsvpData);

      if (rsvpError) throw rsvpError;

      // Update invitation status
      await supabase
        .from('invitations')
        .update({ status: 'rsvp_completed' })
        .eq('id', data.invitation.id);

      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit RSVP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRSVPData();
    }
  }, [token]);

  return {
    data,
    loading,
    error,
    submitting,
    submitRSVP,
    refetch: fetchRSVPData
  };
}