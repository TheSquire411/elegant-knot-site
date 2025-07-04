import { useState } from 'react';
import { Camera, Music, Flower, ChefHat, Car, Gift, MapPin, Users, X } from 'lucide-react';
import { Vendor } from '../../types/planning';
import { sanitizeInput } from '../../utils/security';

interface VendorFormProps {
  onSubmit: (vendor: Omit<Vendor, 'id'>) => void;
  onClose: () => void;
}

const vendorTypes = [
  { value: 'photographer', label: 'Photographer', icon: Camera },
  { value: 'videographer', label: 'Videographer', icon: Camera },
  { value: 'florist', label: 'Florist', icon: Flower },
  { value: 'caterer', label: 'Caterer', icon: ChefHat },
  { value: 'dj', label: 'DJ', icon: Music },
  { value: 'band', label: 'Band', icon: Music },
  { value: 'venue', label: 'Venue', icon: MapPin },
  { value: 'planner', label: 'Wedding Planner', icon: Users },
  { value: 'transportation', label: 'Transportation', icon: Car },
  { value: 'other', label: 'Other', icon: Gift }
];

export default function VendorForm({ onSubmit, onClose }: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'photographer' as Vendor['type'],
    contact: '',
    setupTime: 2,
    arrivalTime: '08:00',
    requirements: '',
    isConfirmed: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact information is required';
    }

    if (formData.setupTime < 0 || formData.setupTime > 12) {
      newErrors.setupTime = 'Setup time must be between 0 and 12 hours';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const sanitizedVendor = {
      ...formData,
      name: sanitizeInput(formData.name),
      contact: sanitizeInput(formData.contact),
      requirements: formData.requirements ? formData.requirements.split(',').map(req => sanitizeInput(req.trim())).filter(Boolean) : []
    };

    onSubmit(sanitizedVendor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Add Vendor</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter vendor name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Vendor['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {vendorTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.contact ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Phone number or email"
            />
            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setup Time (hours)</label>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={formData.setupTime}
                onChange={(e) => setFormData(prev => ({ ...prev, setupTime: Number(e.target.value) }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.setupTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.setupTime && <p className="text-red-500 text-xs mt-1">{errors.setupTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
              <input
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => setFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Separate multiple requirements with commas"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isConfirmed"
              checked={formData.isConfirmed}
              onChange={(e) => setFormData(prev => ({ ...prev, isConfirmed: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="isConfirmed" className="text-sm text-gray-700">
              Contract confirmed
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}