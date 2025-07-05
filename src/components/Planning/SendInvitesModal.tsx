import { useState } from 'react';
import { Send, Users, Mail, Calendar, MapPin, Clock } from 'lucide-react';
import Modal from '../common/Modal';
import { Guest } from '../../types/guests';
import { useInvitations, WeddingDetails } from '../../hooks/useInvitations';

interface SendInvitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  selectedGuests?: Guest[];
}

export default function SendInvitesModal({ 
  isOpen, 
  onClose, 
  guests, 
  selectedGuests = [] 
}: SendInvitesModalProps) {
  const { sendInvitations, sending, getGuestInvitationStatus } = useInvitations();
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>(
    selectedGuests.map(g => g.id)
  );
  const [message, setMessage] = useState('');
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>({
    brideName: '',
    groomName: '',
    weddingDate: '',
    venue: '',
    address: '',
    time: ''
  });
  const [step, setStep] = useState<'select' | 'details' | 'preview'>('select');
  const [sendResults, setSendResults] = useState<any>(null);

  // Filter guests with email addresses
  const guestsWithEmail = guests.filter(guest => guest.email);
  const selectedGuestsData = guestsWithEmail.filter(guest => 
    selectedGuestIds.includes(guest.id)
  );

  const handleGuestToggle = (guestId: string) => {
    setSelectedGuestIds(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGuestIds.length === guestsWithEmail.length) {
      setSelectedGuestIds([]);
    } else {
      setSelectedGuestIds(guestsWithEmail.map(g => g.id));
    }
  };

  const handleSendInvitations = async () => {
    const result = await sendInvitations(selectedGuestIds, message, weddingDetails);
    setSendResults(result);
    
    if (result.success) {
      // Show results for a few seconds then close
      setTimeout(() => {
        onClose();
        resetModal();
      }, 3000);
    }
  };

  const resetModal = () => {
    setStep('select');
    setSelectedGuestIds(selectedGuests.map(g => g.id));
    setMessage('');
    setWeddingDetails({
      brideName: '',
      groomName: '',
      weddingDate: '',
      venue: '',
      address: '',
      time: ''
    });
    setSendResults(null);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  if (sendResults) {
    const { results } = sendResults;
    const successCount = results?.filter((r: any) => r.status === 'sent').length || 0;
    const failCount = results?.filter((r: any) => r.status === 'failed').length || 0;

    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Invitation Results">
        <div className="p-6 text-center">
          <div className="mb-6">
            <Send className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Invitations Sent!
            </h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-gray-600">Sent Successfully</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failCount}</div>
                <div className="text-gray-600">Failed</div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Your wedding invitations have been sent! Guests will receive them shortly.
          </p>
          
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Send Wedding Invitations">
      <div className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step === 'select' ? 'bg-primary-500 text-white' : 
              step === 'details' || step === 'preview' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className="text-sm font-medium text-gray-600">Select Guests</div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step === 'details' ? 'bg-primary-500 text-white' : 
              step === 'preview' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className="text-sm font-medium text-gray-600">Wedding Details</div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step === 'preview' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <div className="text-sm font-medium text-gray-600">Preview & Send</div>
          </div>
        </div>

        {/* Step 1: Select Guests */}
        {step === 'select' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Guests to Invite</h3>
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {selectedGuestIds.length === guestsWithEmail.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
              {guestsWithEmail.map(guest => {
                const invitation = getGuestInvitationStatus(guest.id);
                const alreadyInvited = invitation && invitation.status !== 'pending';
                
                return (
                  <div
                    key={guest.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      selectedGuestIds.includes(guest.id) ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedGuestIds.includes(guest.id)}
                        onChange={() => handleGuestToggle(guest.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={alreadyInvited}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {guest.first_name} {guest.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{guest.email}</div>
                      </div>
                    </div>
                    {alreadyInvited && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {invitation.status === 'sent' && 'Invited'}
                        {invitation.status === 'opened' && 'Opened'}
                        {invitation.status === 'rsvp_completed' && 'RSVP Complete'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {guestsWithEmail.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No guests with email addresses found.</p>
                <p className="text-sm">Add email addresses to your guests to send invitations.</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('details')}
                disabled={selectedGuestIds.length === 0}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next ({selectedGuestIds.length} selected)
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Wedding Details */}
        {step === 'details' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wedding Details</h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bride's Name
                  </label>
                  <input
                    type="text"
                    value={weddingDetails.brideName}
                    onChange={(e) => setWeddingDetails(prev => ({ ...prev, brideName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Groom's Name
                  </label>
                  <input
                    type="text"
                    value={weddingDetails.groomName}
                    onChange={(e) => setWeddingDetails(prev => ({ ...prev, groomName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    value={weddingDetails.weddingDate}
                    onChange={(e) => setWeddingDetails(prev => ({ ...prev, weddingDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={weddingDetails.time}
                    onChange={(e) => setWeddingDetails(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={weddingDetails.venue}
                  onChange={(e) => setWeddingDetails(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={weddingDetails.address}
                  onChange={(e) => setWeddingDetails(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message to your invitation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('select')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep('preview')}
                disabled={!weddingDetails.brideName || !weddingDetails.groomName || !weddingDetails.weddingDate || !weddingDetails.venue}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Send */}
        {step === 'preview' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview & Send</h3>
            
            {/* Preview Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  You're Invited to Our Wedding! 💍
                </h4>
                <div className="text-lg font-semibold text-gray-800 mb-4">
                  {weddingDetails.brideName} & {weddingDetails.groomName}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{weddingDetails.weddingDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{weddingDetails.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{weddingDetails.venue}</span>
                </div>
                {weddingDetails.address && (
                  <div className="pl-6 text-xs text-gray-600">
                    {weddingDetails.address}
                  </div>
                )}
              </div>

              {message && (
                <div className="bg-white bg-opacity-50 rounded p-3 text-sm text-gray-700 mb-4">
                  <em>"{message}"</em>
                </div>
              )}

              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded text-sm font-medium">
                  RSVP Now
                </div>
              </div>
            </div>

            {/* Selected Guests Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">
                  Sending to {selectedGuestsData.length} guests
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {selectedGuestsData.map(guest => `${guest.first_name} ${guest.last_name}`).join(', ')}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('details')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={sending}
              >
                Back
              </button>
              <button
                onClick={handleSendInvitations}
                disabled={sending}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Invitations</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}