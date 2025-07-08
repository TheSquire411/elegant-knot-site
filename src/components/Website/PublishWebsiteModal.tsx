import { useState, useEffect } from 'react';
import { Globe, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { WeddingWebsite } from '../../types';
import Modal from '../common/Modal';
import { errorHandler } from '../../utils/errorHandling';

interface PublishWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: WeddingWebsite;
  onPublished: (updatedWebsite: WeddingWebsite) => void;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export default function PublishWebsiteModal({ 
  isOpen, 
  onClose, 
  website, 
  onPublished 
}: PublishWebsiteModalProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const validateWebsite = async () => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.rpc('validate_website_for_publishing', {
        website_id: website.id
      });

      if (error) throw error;
      setValidation(data as unknown as ValidationResult);
    } catch (error) {
      console.error('Validation error:', error);
      errorHandler.handle(error, {
        context: 'Website Publishing - Validation',
        showToUser: true,
        severity: 'medium'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const publishWebsite = async () => {
    setIsPublishing(true);
    try {
      const { data, error } = await supabase
        .from('wedding_websites')
        .update({ 
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', website.id)
        .select()
        .single();

      if (error) throw error;

      const updatedWebsite = {
        ...data,
        slug: data.slug || undefined,
        domain: data.domain || undefined,
        published_at: data.published_at || undefined,
        status: data.status as 'draft' | 'published' | 'archived',
        content: website.content,
        theme: website.theme,
        settings: website.settings
      };

      const url = `${window.location.origin}/wedding/${updatedWebsite.slug}`;
      setPublicUrl(url);
      onPublished(updatedWebsite);
    } catch (error) {
      console.error('Publishing error:', error);
      errorHandler.handle(error, {
        context: 'Website Publishing - Publish',
        showToUser: true,
        severity: 'medium'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const unpublishWebsite = async () => {
    setIsPublishing(true);
    try {
      const { data, error } = await supabase
        .from('wedding_websites')
        .update({ 
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', website.id)
        .select()
        .single();

      if (error) throw error;

      const updatedWebsite = {
        ...data,
        slug: data.slug || undefined,
        domain: data.domain || undefined,
        published_at: data.published_at || undefined,
        status: data.status as 'draft' | 'published' | 'archived',
        content: website.content,
        theme: website.theme,
        settings: website.settings
      };

      setPublicUrl(null);
      onPublished(updatedWebsite);
    } catch (error) {
      console.error('Unpublishing error:', error);
      errorHandler.handle(error, {
        context: 'Website Publishing - Unpublish',
        showToUser: true,
        severity: 'medium'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = async () => {
    if (publicUrl) {
      await navigator.clipboard.writeText(publicUrl);
    }
  };

  const openWebsite = () => {
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    }
  };

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      if (website.status === 'published' && website.slug) {
        setPublicUrl(`${window.location.origin}/wedding/${website.slug}`);
      } else {
        setPublicUrl(null);
        validateWebsite();
      }
    } else {
      // Reset state when modal closes
      setValidation(null);
      setPublicUrl(null);
    }
  }, [isOpen, website.status, website.slug]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={website.status === 'published' ? 'Website Published' : 'Publish Website'}
    >
      <div className="space-y-6">
        {website.status === 'published' ? (
          // Published state
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Your website is live!
            </h3>
            <p className="text-muted-foreground mb-6">
              Your wedding website is now published and accessible to your guests.
            </p>
            
            {publicUrl && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Website URL:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-background px-3 py-2 rounded text-sm">
                    {publicUrl}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-background rounded transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={openWebsite}
                    className="p-2 hover:bg-background rounded transition-colors"
                    title="Open website"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={unpublishWebsite}
                disabled={isPublishing}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                {isPublishing ? 'Unpublishing...' : 'Unpublish'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          // Publishing workflow
          <div>
            <div className="text-center mb-6">
              <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to publish your website?
              </h3>
              <p className="text-muted-foreground">
                Your wedding website will be made public and accessible to your guests.
              </p>
            </div>

            {/* Validation Results */}
            {isValidating ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Validating website...</p>
              </div>
            ) : validation ? (
              <div className="space-y-4">
                {validation.errors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <h4 className="font-medium text-destructive">Required Fields Missing</h4>
                    </div>
                    <ul className="text-sm text-destructive space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validation.warnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Recommendations</h4>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validation.valid && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 font-medium">Ready to publish!</p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={publishWebsite}
                disabled={isPublishing || (validation?.valid === false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isPublishing ? 'Publishing...' : 'Publish Website'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}