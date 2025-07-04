import { useState } from 'react';
import { X, Upload, Calendar, DollarSign } from 'lucide-react';
import { Expense } from '../../types';
import { supabase } from '../../integrations/supabase/client';
import { useApp } from '../../context/AppContext';
import { sanitizeInput, validateInputLength } from '../../utils/security';

interface EditExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
  onExpenseUpdated: (expense: Expense) => void;
}

const EXPENSE_CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Music/Entertainment',
  'Flowers/Decorations',
  'Attire',
  'Transportation',
  'Stationery',
  'Other'
];

export default function EditExpenseModal({
  expense,
  isOpen,
  onClose,
  onExpenseUpdated
}: EditExpenseModalProps) {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount.toString(),
    due_date: expense.due_date || '',
    notes: expense.notes || '',
    category: expense.category || '',
    is_recurring: expense.is_recurring
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const titleValidation = validateInputLength(formData.title, 100, 1);
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error!;
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (formData.notes) {
      const notesValidation = validateInputLength(formData.notes, 1000);
      if (!notesValidation.isValid) {
        newErrors.notes = notesValidation.error!;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadReceipt = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${state.user?.id}/${expense.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading receipt:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Sanitize inputs
      const sanitizedData = {
        title: sanitizeInput(formData.title),
        amount: Number(formData.amount),
        due_date: formData.due_date || null,
        notes: formData.notes ? sanitizeInput(formData.notes) : null,
        category: formData.category || null,
        is_recurring: formData.is_recurring
      };

      // Upload new receipt if provided
      let receiptUrl = expense.receipt_url;
      if (receiptFile) {
        const newReceiptUrl = await uploadReceipt(receiptFile);
        if (newReceiptUrl) {
          receiptUrl = newReceiptUrl;
        }
      }

      // Update expense
      const { data: updatedExpense, error } = await supabase
        .from('expenses')
        .update({ ...sanitizedData, receipt_url: receiptUrl })
        .eq('id', expense.id)
        .select()
        .single();

      if (error) throw error;
      
      onExpenseUpdated(updatedExpense);
      onClose();
    } catch (error) {
      console.error('Error updating expense:', error);
      setErrors({ submit: 'Failed to update expense. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">Edit Expense</h3>
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
              Expense Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter expense title"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a category</option>
              {EXPENSE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Receipt
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="hidden"
                id="receipt-upload"
              />
              <label
                htmlFor="receipt-upload"
                className="flex items-center justify-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                <Upload className="h-5 w-5" />
                {receiptFile 
                  ? receiptFile.name 
                  : expense.receipt_url 
                    ? 'Replace current receipt' 
                    : 'Upload receipt (optional)'
                }
              </label>
              {expense.receipt_url && !receiptFile && (
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Current receipt will be kept
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Add any additional notes..."
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.is_recurring}
              onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="recurring" className="text-sm text-foreground">
              This is a recurring expense
            </label>
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
              {loading ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}