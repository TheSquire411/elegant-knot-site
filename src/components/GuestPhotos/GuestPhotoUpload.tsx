import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Camera, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { GuestPhotoEvent } from '@/types/guestPhotos';

export function GuestPhotoUpload() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [event, setEvent] = useState<GuestPhotoEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderEmail, setUploaderEmail] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState<string[]>([]);

  const {
    isUploading,
    uploadProgress,
    dragActive,
    handleDrag,
    handleDrop,
    triggerFileInput,
    fileInputRef,
    handleFileSelect
  } = useFileUpload({
    onUploadComplete: async (photos: any[]) => {
      if (!event) return;
      
      const uploaded = [];
      for (const photo of photos) {
        try {
          const fileName = `${Date.now()}-${photo.filename}`;
          const filePath = `${event.share_code}/${fileName}`;
          
          // Convert blob URL to blob
          const response = await fetch(photo.url);
          const blob = await response.blob();
          
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('guest-photos')
            .upload(filePath, blob);

          if (uploadError) throw uploadError;

          // Create database record
          const { error: dbError } = await supabase
            .from('guest_photo_uploads')
            .insert({
              event_id: event.id,
              file_path: filePath,
              file_name: photo.filename,
              content_type: blob.type,
              file_size: blob.size,
              uploaded_by_name: uploaderName || null,
              uploaded_by_email: uploaderEmail || null,
            });

          if (dbError) throw dbError;
          uploaded.push(photo.filename);
        } catch (error) {
          console.error('Upload error:', error);
        }
      }
      
      setUploadSuccess(uploaded);
    },
    onError: (error: string) => {
      console.error('Upload error:', error);
    }
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!shareCode) return;
      
      try {
        const { data, error } = await supabase
          .from('guest_photo_events')
          .select('*')
          .eq('share_code', shareCode)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [shareCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Camera className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Event Not Found</h3>
            <p className="text-muted-foreground text-center">
              This photo sharing link is no longer active or doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (uploadSuccess.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground text-center mb-4">
              Your {uploadSuccess.length} photo{uploadSuccess.length !== 1 ? 's' : ''} 
              {uploadSuccess.length === 1 ? ' has' : ' have'} been uploaded successfully.
            </p>
            <Button onClick={() => {
              setUploadSuccess([]);
              setUploaderName('');
              setUploaderEmail('');
            }}>
              Upload More Photos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{event.event_name}</h1>
          {event.event_date && (
            <p className="text-muted-foreground">
              {new Date(event.event_date).toLocaleDateString()}
            </p>
          )}
          {event.description && (
            <p className="text-muted-foreground mt-2">{event.description}</p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Share Your Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name (Optional)</Label>
                <Input
                  id="name"
                  value={uploaderName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploaderName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Your Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={uploaderEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploaderEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Drop photos here or click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, GIF up to 10MB each
                    </p>
                  </div>
                  <Button onClick={triggerFileInput}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photos
                  </Button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}