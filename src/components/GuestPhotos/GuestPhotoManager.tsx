import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Calendar, Share2, Eye, Trash2 } from 'lucide-react';
import { useGuestPhotos } from '../../hooks/useGuestPhotos';
import { CreateEventModal } from './CreateEventModal';
import { GuestPhotoGallery } from './GuestPhotoGallery';
import { ShareEventModal } from './ShareEventModal';
import { useApp } from '../../context/AppContext';

export function GuestPhotoManager() {
  const { showNotification } = useApp();
  const { events, loading, deleteEvent } = useGuestPhotos();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? All photos will be permanently removed.')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      showNotification('Event deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete event', 'error');
    }
  };

  if (selectedEvent) {
    return (
      <GuestPhotoGallery 
        eventId={selectedEvent} 
        onBack={() => setSelectedEvent(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Guest Photo Collection</h1>
          <p className="text-muted-foreground">
            Create events and let your guests share their photos
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Photo Events Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first photo event to start collecting memories from your guests
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{event.event_name}</CardTitle>
                    {event.event_date && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={event.is_active ? 'default' : 'secondary'}>
                    {event.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEvent(event.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShareModal(event.id)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateEventModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showShareModal && (
        <ShareEventModal
          eventId={showShareModal}
          isOpen={!!showShareModal}
          onClose={() => setShowShareModal(null)}
        />
      )}
    </div>
  );
}