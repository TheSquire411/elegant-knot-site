import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRSVP, RSVPFormData } from '../../hooks/useRSVP';
import { Heart, Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function RSVPPage() {
  const { token } = useParams<{ token: string }>();
  const { data, loading, error, submitting, submitRSVP } = useRSVP(token || '');
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<RSVPFormData>({
    attending: true,
    meal_choice: '',
    additional_notes: '',
    plus_one_name: '',
    plus_one_attending: false
  });

  // Initialize form with existing response if available
  React.useEffect(() => {
    if (data?.existingResponse) {
      setFormData({
        attending: data.existingResponse.attending ?? true,
        meal_choice: data.existingResponse.meal_choice || '',
        additional_notes: data.existingResponse.additional_notes || '',
        plus_one_name: data.existingResponse.plus_one_name || '',
        plus_one_attending: data.existingResponse.plus_one_attending ?? false
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitRSVP(formData);
    if (result.success) {
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-red-600 mb-2">Invitation Not Found</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-xl font-semibold text-green-600 mb-2">RSVP Submitted!</h1>
            <p className="text-muted-foreground">
              Thank you for your response. We can't wait to celebrate with you!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="hero-heading text-primary">You're Invited!</h1>
          <p className="hero-subtext text-foreground mt-2">
            {data.weddingDetails.brideName} & {data.weddingDetails.groomName}
          </p>
        </div>

        {/* Wedding Details */}
        <div className="bg-background rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-center mb-6">Wedding Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              <span>{data.weddingDetails.weddingDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <span>{data.weddingDetails.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <div className="font-medium">{data.weddingDetails.venue}</div>
                <div className="text-sm text-muted-foreground">{data.weddingDetails.address}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form */}
        <div className="bg-background rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Dear {data.guest.first_name} {data.guest.last_name},
            </h2>
            <p className="text-muted-foreground">
              Please let us know if you'll be able to join us for our special day.
              {data.existingResponse && (
                <span className="block mt-2 text-primary font-medium">
                  You have already responded. You can update your response below.
                </span>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Attendance */}
            <div className="space-y-3">
              <label className="text-base font-medium block">Will you be attending?</label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attending"
                    value="true"
                    checked={formData.attending === true}
                    onChange={() => setFormData(prev => ({ ...prev, attending: true }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span>Yes, I'll be there!</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attending"
                    value="false"
                    checked={formData.attending === false}
                    onChange={() => setFormData(prev => ({ ...prev, attending: false }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span>Sorry, can't make it</span>
                </label>
              </div>
            </div>

            {formData.attending && (
              <>
                {/* Meal Choice */}
                <div className="space-y-3">
                  <label htmlFor="meal-choice" className="text-base font-medium block">Meal Preference</label>
                  <select
                    id="meal-choice"
                    value={formData.meal_choice}
                    onChange={(e) => setFormData(prev => ({ ...prev, meal_choice: e.target.value }))}
                    className="w-full p-3 border border-input rounded-md bg-background"
                  >
                    <option value="">Select your meal preference</option>
                    <option value="chicken">Chicken</option>
                    <option value="beef">Beef</option>
                    <option value="fish">Fish</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                {/* Plus One */}
                {data.guest.is_plus_one === false && (
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData.plus_one_name}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setFormData(prev => ({ ...prev, plus_one_name: '', plus_one_attending: false }));
                          } else {
                            setFormData(prev => ({ ...prev, plus_one_name: 'Guest' }));
                          }
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-base font-medium">I'll be bringing a plus one</span>
                    </label>
                    
                    {formData.plus_one_name && (
                      <div className="space-y-3 ml-6">
                        <div>
                          <label htmlFor="plus-one-name" className="block text-sm font-medium mb-1">Plus One Name</label>
                          <input
                            id="plus-one-name"
                            type="text"
                            value={formData.plus_one_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, plus_one_name: e.target.value }))}
                            placeholder="Enter your guest's name"
                            className="w-full p-3 border border-input rounded-md bg-background"
                          />
                        </div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.plus_one_attending}
                            onChange={(e) => setFormData(prev => ({ ...prev, plus_one_attending: e.target.checked }))}
                            className="w-4 h-4 text-primary"
                          />
                          <span>My plus one will be attending</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Additional Notes */}
            <div className="space-y-3">
              <label htmlFor="notes" className="text-base font-medium block">Additional Notes</label>
              <textarea
                id="notes"
                value={formData.additional_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                placeholder="Any dietary restrictions, accessibility needs, or special requests?"
                rows={3}
                className="w-full p-3 border border-input rounded-md bg-background resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : data.existingResponse ? 'Update RSVP' : 'Submit RSVP'}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}