import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useApp } from '../context/AppContext';
import type { GuestPhotoEvent, GuestPhotoUpload, CreateGuestPhotoEventData, UploadGuestPhotoData } from '../types/guestPhotos';

export function useGuestPhotos() {
  const { user } = useApp();
  const [events, setEvents] = useState<GuestPhotoEvent[]>([]);
  const [uploads, setUploads] = useState<GuestPhotoUpload[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guest_photo_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching photo events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadsByEvent = async (eventId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guest_photo_uploads')
        .select('*')
        .eq('event_id', eventId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateGuestPhotoEventData) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('guest_photo_events')
      .insert({
        ...eventData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    await fetchEvents();
    return data;
  };

  const updateEvent = async (eventId: string, updates: Partial<GuestPhotoEvent>) => {
    const { error } = await supabase
      .from('guest_photo_events')
      .update(updates)
      .eq('id', eventId);

    if (error) throw error;
    await fetchEvents();
  };

  const deleteEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('guest_photo_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    await fetchEvents();
  };

  const uploadPhoto = async ({ event_id, file, uploaded_by_name, uploaded_by_email }: UploadGuestPhotoData) => {
    // Get event details for folder path
    const { data: event, error: eventError } = await supabase
      .from('guest_photo_events')
      .select('share_code')
      .eq('id', event_id)
      .single();

    if (eventError) throw eventError;

    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${event.share_code}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('guest-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Create database record
    const { data, error } = await supabase
      .from('guest_photo_uploads')
      .insert({
        event_id,
        file_path: filePath,
        file_name: file.name,
        content_type: file.type,
        file_size: file.size,
        uploaded_by_name,
        uploaded_by_email,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('guest-photos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const deletePhoto = async (uploadId: string, filePath: string) => {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('guest-photos')
      .remove([filePath]);

    if (storageError) console.error('Error deleting from storage:', storageError);

    // Delete from database
    const { error } = await supabase
      .from('guest_photo_uploads')
      .delete()
      .eq('id', uploadId);

    if (error) throw error;
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return {
    events,
    uploads,
    loading,
    fetchEvents,
    fetchUploadsByEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadPhoto,
    getPhotoUrl,
    deletePhoto,
  };
}