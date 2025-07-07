import { WeddingWebsite } from '../types';

export const getDefaultWebsiteData = (): Omit<WeddingWebsite, 'id' | 'user_id' | 'created_at' | 'updated_at'> => ({
  title: 'Our Wedding',
  status: 'draft',
  content: {
    coupleNames: 'Sarah & Michael',
    weddingDate: '2024-09-15',
    venue: {
      name: 'Garden Venue',
      address: '123 Beautiful Street, City, State'
    },
    ourStory: {
      content: 'Our love story begins here...',
      style: 'romantic',
      photos: []
    },
    schedule: {
      ceremony: {
        time: '16:00',
        location: 'Garden Venue'
      },
      reception: {
        time: '18:00',
        location: 'Reception Hall'
      }
    },
    registry: {
      message: 'Your presence is the only present we need!',
      stores: []
    },
    accommodations: [],
    travel: {}
  },
  theme: {
    style: 'Classic & Elegant',
    colors: ['#F8BBD9', '#D4AF37'],
    fonts: {
      heading: 'Playfair Display',
      body: 'Montserrat'
    }
  },
  settings: {
    features: {
      rsvp: true,
      guestBook: true,
      photoSharing: true
    }
  }
});