import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { sanitizeInput, validateEmail, validateInputLength } from '../../utils/security';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactUsSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: sanitizeInput(value)
    }));
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    const nameValidation = validateInputLength(formData.name, 100, 2);
    if (!nameValidation.isValid) {
      return { isValid: false, error: nameValidation.error };
    }

    if (!validateEmail(formData.email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    const messageValidation = validateInputLength(formData.message, 1000, 10);
    if (!messageValidation.isValid) {
      return { isValid: false, error: messageValidation.error };
    }

    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.error || 'Please check your input');
      return;
    }

    setLoading(true);

    try {
      const { error: functionError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      });

      if (functionError) {
        throw functionError;
      }

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Contact form error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Mail className="h-6 w-6 text-primary-500" />
        <h3 className="text-lg font-semibold text-sage-800">Contact Us</h3>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✓ Message sent successfully!</p>
          <p className="text-green-700 text-sm">We'll get back to you as soon as possible.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">⚠️ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Your full name"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your.email@example.com"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-sage-700 mb-2">
            <MessageSquare className="h-4 w-4 inline mr-1" />
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
            placeholder="Tell us how we can help you..."
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-sm text-sage-600">
        <p>Your message will be sent to <strong>info@wedly.com.au</strong></p>
        <p>We typically respond within 24 hours during business days.</p>
      </div>
    </div>
  );
}