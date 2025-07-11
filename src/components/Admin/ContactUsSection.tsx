import { Mail } from 'lucide-react';

export default function ContactUsSection() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <Mail className="h-6 w-6 text-primary-500" />
        <h3 className="text-lg font-semibold text-sage-800">Contact Us</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-sage-600">Get in touch with our team</p>
        <div className="bg-sage-50 rounded-lg p-4 inline-block">
          <a 
            href="mailto:info@wedly.com.au" 
            className="text-primary-600 hover:text-primary-700 font-medium text-lg transition-colors"
          >
            info@wedly.com.au
          </a>
        </div>
        <p className="text-sm text-sage-500">We typically respond within 24 hours during business days.</p>
      </div>
    </div>
  );
}