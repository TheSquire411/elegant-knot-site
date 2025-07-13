export interface GuestPhotoEvent {
  id: string;
  user_id: string;
  event_name: string;
  event_date: string | null;
  description: string | null;
  is_active: boolean;
  share_code: string;
  created_at: string;
  updated_at: string;
}

export interface GuestPhotoUpload {
  id: string;
  event_id: string;
  file_path: string;
  file_name: string | null;
  content_type: string | null;
  file_size: number | null;
  uploaded_by_name: string | null;
  uploaded_by_email: string | null;
  uploaded_at: string;
}

export interface CreateGuestPhotoEventData {
  event_name: string;
  event_date?: string;
  description?: string;
}

export interface UploadGuestPhotoData {
  event_id: string;
  file: File;
  uploaded_by_name?: string;
  uploaded_by_email?: string;
}