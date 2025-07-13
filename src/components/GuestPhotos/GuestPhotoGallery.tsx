import { useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Download, Trash2, Users } from 'lucide-react';
import { useGuestPhotos } from '../../hooks/useGuestPhotos';
import { useApp } from '../../context/AppContext';

interface GuestPhotoGalleryProps {
  eventId: string;
  onBack: () => void;
}

export function GuestPhotoGallery({ eventId, onBack }: GuestPhotoGalleryProps) {
  const { showNotification } = useApp();
  const { events, uploads, fetchUploadsByEvent, getPhotoUrl, deletePhoto } = useGuestPhotos();

  const event = events.find((e: any) => e.id === eventId);

  useEffect(() => {
    fetchUploadsByEvent(eventId);
  }, [eventId]);

  const handleDeletePhoto = async (uploadId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await deletePhoto(uploadId, filePath);
      await fetchUploadsByEvent(eventId);
      showNotification('Photo deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete photo', 'error');
    }
  };

  const downloadPhoto = (filePath: string, fileName?: string) => {
    const url = getPhotoUrl(filePath);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!event) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{event.event_name}</h1>
            <p className="text-muted-foreground flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {uploads.length} photo{uploads.length !== 1 ? 's' : ''} shared
            </p>
          </div>
        </div>
      </div>

      {uploads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Photos Yet</h3>
            <p className="text-muted-foreground text-center">
              Share your event link with guests to start collecting photos!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {uploads.map((upload: any) => (
            <Card key={upload.id} className="overflow-hidden">
              <div className="relative group">
                <img
                  src={getPhotoUrl(upload.file_path)}
                  alt={upload.file_name || 'Guest photo'}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadPhoto(upload.file_path, upload.file_name || undefined)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePhoto(upload.id, upload.file_path)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">
                  {upload.file_name || 'Untitled'}
                </p>
                {upload.uploaded_by_name && (
                  <p className="text-xs text-muted-foreground">
                    by {upload.uploaded_by_name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(upload.uploaded_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}