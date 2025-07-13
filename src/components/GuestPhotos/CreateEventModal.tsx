import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGuestPhotos } from '@/hooks/useGuestPhotos';
import { useApp } from '@/context/AppContext';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const { showNotification } = useApp();
  const { createEvent } = useGuestPhotos();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.event_name.trim()) {
      showNotification('Event name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        event_name: formData.event_name.trim(),
        event_date: formData.event_date || undefined,
        description: formData.description.trim() || undefined,
      });
      
      showNotification('Photo event created successfully!', 'success');
      onClose();
      setFormData({ event_name: '', event_date: '', description: '' });
    } catch (error) {
      console.error('Error creating event:', error);
      showNotification('Failed to create event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Create Photo Event"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="event_name">Event Name *</Label>
            <Input
              id="event_name"
              value={formData.event_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('event_name', e.target.value)}
              placeholder="e.g., Wedding Ceremony, Reception"
              required
            />
          </div>

          <div>
            <Label htmlFor="event_date">Event Date</Label>
            <Input
              id="event_date"
              type="date"
              value={formData.event_date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('event_date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
              placeholder="Add any special instructions for your guests..."
              rows={3}
            />
          </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}