import { Plus, Trash2 } from 'lucide-react';

interface DetailsSectionProps {
  websiteData: any;
  onUpdate: (updates: any) => void;
}

export default function DetailsSection({ websiteData, onUpdate }: DetailsSectionProps) {
  const updateContent = (section: string, updates: any) => {
    onUpdate({
      content: {
        ...websiteData.content,
        [section]: {
          ...websiteData.content[section],
          ...updates
        }
      }
    });
  };

  const addAccommodation = () => {
    const newAccommodation = {
      name: 'Hotel Name',
      address: 'Hotel Address',
      phone: '(555) 123-4567',
      website: 'https://hotel-website.com',
      rate: '$150/night'
    };

    updateContent('accommodations', [...websiteData.content.accommodations, newAccommodation]);
  };

  const removeAccommodation = (index: number) => {
    const updated = websiteData.content.accommodations.filter((_: any, i: number) => i !== index);
    updateContent('accommodations', updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Ceremony</h4>
            <div className="space-y-3">
              <input
                type="time"
                value={websiteData.content.schedule.ceremony.time}
                onChange={(e) => updateContent('schedule', {
                  ceremony: { ...websiteData.content.schedule.ceremony, time: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <input
                type="text"
                value={websiteData.content.schedule.ceremony.location}
                onChange={(e) => updateContent('schedule', {
                  ceremony: { ...websiteData.content.schedule.ceremony, location: e.target.value }
                })}
                placeholder="Ceremony location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Reception</h4>
            <div className="space-y-3">
              <input
                type="time"
                value={websiteData.content.schedule.reception.time}
                onChange={(e) => updateContent('schedule', {
                  reception: { ...websiteData.content.schedule.reception, time: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <input
                type="text"
                value={websiteData.content.schedule.reception.location}
                onChange={(e) => updateContent('schedule', {
                  reception: { ...websiteData.content.schedule.reception, location: e.target.value }
                })}
                placeholder="Reception location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Accommodations</h3>
        <div className="space-y-4">
          {websiteData.content.accommodations.map((accommodation: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  value={accommodation.name}
                  onChange={(e) => {
                    const updated = [...websiteData.content.accommodations];
                    updated[index] = { ...accommodation, name: e.target.value };
                    updateContent('accommodations', updated);
                  }}
                  placeholder="Hotel name"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={accommodation.rate}
                  onChange={(e) => {
                    const updated = [...websiteData.content.accommodations];
                    updated[index] = { ...accommodation, rate: e.target.value };
                    updateContent('accommodations', updated);
                  }}
                  placeholder="Rate per night"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={accommodation.address}
                  onChange={(e) => {
                    const updated = [...websiteData.content.accommodations];
                    updated[index] = { ...accommodation, address: e.target.value };
                    updateContent('accommodations', updated);
                  }}
                  placeholder="Address"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  value={accommodation.phone}
                  onChange={(e) => {
                    const updated = [...websiteData.content.accommodations];
                    updated[index] = { ...accommodation, phone: e.target.value };
                    updateContent('accommodations', updated);
                  }}
                  placeholder="Phone"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={accommodation.website}
                    onChange={(e) => {
                      const updated = [...websiteData.content.accommodations];
                      updated[index] = { ...accommodation, website: e.target.value };
                      updateContent('accommodations', updated);
                    }}
                    placeholder="Website"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeAccommodation(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addAccommodation}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Accommodation</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Travel Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Airport</label>
            <input
              type="text"
              value={websiteData.content.travel.airport}
              onChange={(e) => updateContent('travel', { airport: e.target.value })}
              placeholder="Airport name and code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Directions</label>
            <textarea
              value={websiteData.content.travel.directions}
              onChange={(e) => updateContent('travel', { directions: e.target.value })}
              placeholder="Driving directions and transportation options"
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parking Information</label>
            <textarea
              value={websiteData.content.travel.parking}
              onChange={(e) => updateContent('travel', { parking: e.target.value })}
              placeholder="Parking availability and instructions"
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}