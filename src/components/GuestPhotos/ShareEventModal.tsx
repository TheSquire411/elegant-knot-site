import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Copy, Share2 } from 'lucide-react';
import { useGuestPhotos } from '../../hooks/useGuestPhotos';
import { useApp } from '../../context/AppContext';

interface ShareEventModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareEventModal({ eventId, isOpen, onClose }: ShareEventModalProps) {
  const { showNotification } = useApp();
  const { events } = useGuestPhotos();
  const [shareUrl, setShareUrl] = useState('');

  const event = events.find((e: any) => e.id === eventId);

  useEffect(() => {
    if (event) {
      const url = `${window.location.origin}/photos/${event.share_code}`;
      setShareUrl(url);
    }
  }, [event]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showNotification('Link copied to clipboard!', 'success');
    } catch (error) {
      showNotification('Failed to copy link', 'error');
    }
  };

  const shareViaWebShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: `Share Photos - ${event.event_name}`,
          text: `Upload your photos to ${event.event_name}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (!event) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Share Photo Event"
    >
      <div className="space-y-4">
          <div>
            <Label>Event: {event.event_name}</Label>
            <p className="text-sm text-muted-foreground">
              Share this link with your guests so they can upload photos
            </p>
          </div>

          <div>
            <Label htmlFor="share-url">Share URL</Label>
            <div className="flex space-x-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyToClipboard} size="icon" variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            {typeof window !== 'undefined' && 'share' in navigator ? (
              <Button onClick={shareViaWebShare} className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            ) : null}
            <Button onClick={copyToClipboard} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Share Code: <code className="bg-muted px-2 py-1 rounded">{event.share_code}</code>
            </p>
          </div>
        </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Done</Button>
      </div>
    </Modal>
  );
}