import { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Clock, Plus } from 'lucide-react';
import { sanitizeInput, validateInputLength } from '../../utils/security';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { title: string; date: string; time?: string; notes?: string }) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedNotes = sanitizeInput(notes);
    
    // Validate inputs
    const titleValidation = validateInputLength(sanitizedTitle, 100, 1);
    const notesValidation = validateInputLength(sanitizedNotes, 500, 0);
    
    const newErrors: { [key: string]: string } = {};
    
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error || 'Invalid title';
    }
    
    if (!notesValidation.isValid) {
      newErrors.notes = notesValidation.error || 'Invalid notes';
    }
    
    // Date validation
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      newErrors.date = 'Date cannot be in the past';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (sanitizedTitle.trim()) {
      onAddTask({
        title: sanitizedTitle.trim(),
        date,
        time: time || undefined,
        notes: sanitizedNotes.trim() || undefined
      });
      setTitle('');
      setTime('');
      setNotes('');
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-xl p-8 w-full max-w-md animate-scale-in border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading text-foreground">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Task Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Book florist, Dress fitting..."
              className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background text-foreground ${
                errors.title ? 'border-red-500' : 'border-border'
              }`}
              required
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background text-foreground ${
                  errors.date ? 'border-red-500' : 'border-border'
                }`}
                required
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Time (Optional)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-4 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or details..."
              className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background text-foreground resize-none ${
                errors.notes ? 'border-red-500' : 'border-border'
              }`}
              rows={3}
              maxLength={500}
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}