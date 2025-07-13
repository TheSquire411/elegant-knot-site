import { useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Download, Trash2, Users, MessageSquare, User, Mail, Calendar, Image as ImageIcon } from 'lucide-react';
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
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {uploads.map((upload: any) => (
            <Card key={upload.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={getPhotoUrl(upload.file_path)}
                  alt={upload.file_name || 'Guest photo'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate">
                    {upload.file_name || 'Unknown'}
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPhoto(upload.file_path, upload.file_name || undefined)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePhoto(upload.id, upload.file_path)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {upload.message && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "{upload.message}"
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground space-y-1.5">
                  {upload.uploaded_by_name && (
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{upload.uploaded_by_name}</span>
                    </div>
                  )}
                  {upload.uploaded_by_email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{upload.uploaded_by_email}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(upload.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                  {upload.file_size && (
                    <div className="flex items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>
                        {(upload.file_size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}