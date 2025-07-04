import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Budget } from '../../types';
import { supabase } from '../../integrations/supabase/client';
import { useApp } from '../../context/AppContext';
import { sanitizeInput, validateInputLength } from '../../utils/security';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBudgetCreated: (budget: Budget) => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
];

export default function CreateBudgetModal({
  isOpen,
  onClose,
  onBudgetCreated
}: CreateBudgetModalProps) {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    total_amount: '',
    currency: 'USD'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateInputLength(formData.name, 100, 1);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error!;
    }

    if (!formData.total_amount || isNaN(Number(formData.total_amount)) || Number(formData.total_amount) <= 0) {
      newErrors.total_amount = 'Please enter a valid budget amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        total_amount: Number(formData.total_amount),
        currency: formData.currency,
        user_id: state.user!.id
      };

      const { data: budget, error } = await supabase
        .from('budgets')
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;
      
      onBudgetCreated(budget);
      
      // Reset form
      setFormData({
        name: '',
        total_amount: '',
        currency: 'USD'
      });
      onClose();
    } catch (error) {
      console.error('Error creating budget:', error);
      setErrors({ submit: 'Failed to create budget. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">Create New Budget</h3>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.submit}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Budget Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Wedding Budget 2024"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Total Budget *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              {errors.total_amount && (
                <p className="text-red-500 text-xs mt-1">{errors.total_amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Budget Features</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Track individual expenses with categories</li>
              <li>• Upload receipts for each expense</li>
              <li>• Link expenses to your planning tasks</li>
              <li>• AI-powered budget analysis and insights</li>
              <li>• Automatic spending calculations</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-muted-foreground bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}