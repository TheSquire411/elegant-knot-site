import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SeatingTable } from '../../../types/guests';

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tableData: Omit<SeatingTable, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  editingTable?: SeatingTable | null;
}

export default function AddTableModal({ isOpen, onClose, onSave, editingTable }: AddTableModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 8,
    shape: 'round' as 'round' | 'rectangular' | 'square',
    notes: '',
    x_position: 0,
    y_position: 0
  });

  // Update form data when editingTable changes
  useEffect(() => {
    if (editingTable) {
      setFormData({
        name: editingTable.name || '',
        capacity: editingTable.capacity || 8,
        shape: editingTable.shape || 'round',
        notes: editingTable.notes || '',
        x_position: editingTable.x_position || 0,
        y_position: editingTable.y_position || 0
      });
    } else {
      setFormData({
        name: '',
        capacity: 8,
        shape: 'round',
        notes: '',
        x_position: 0,
        y_position: 0
      });
    }
  }, [editingTable]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name.trim(),
      capacity: formData.capacity,
      shape: formData.shape,
      notes: formData.notes.trim() || undefined,
      x_position: formData.x_position,
      y_position: formData.y_position
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      capacity: 8,
      shape: 'round',
      notes: '',
      x_position: 0,
      y_position: 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingTable ? 'Edit Table' : 'Add New Table'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Table Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Head Table, Table 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Table Shape */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Shape
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'round', label: 'Round', icon: '⭕' },
                { value: 'square', label: 'Square', icon: '⬜' },
                { value: 'rectangular', label: 'Rectangle', icon: '▬' }
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('shape', option.value)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    formData.shape === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-xs font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seating Capacity
            </label>
            <input
              type="number"
              min="2"
              max="20"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 8)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 6-8 guests for optimal conversation
            </p>
          </div>

          {/* Position (only show when editing) */}
          {editingTable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X Position
                </label>
                <input
                  type="number"
                  value={formData.x_position}
                  onChange={(e) => handleInputChange('x_position', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y Position
                </label>
                <input
                  type="number"
                  value={formData.y_position}
                  onChange={(e) => handleInputChange('y_position', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Any special requirements or notes about this table..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            disabled={!formData.name.trim()}
          >
            {editingTable ? 'Update Table' : 'Add Table'}
          </button>
        </div>
      </div>
    </div>
  );
}