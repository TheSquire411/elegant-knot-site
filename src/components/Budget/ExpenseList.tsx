import { useState } from 'react';
import { Calendar, Receipt, Edit, Trash2, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Expense } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { supabase } from '../../integrations/supabase/client';
import EditExpenseModal from './EditExpenseModal';

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseUpdated: (expense: Expense) => void;
  onExpenseDeleted: (expenseId: string) => void;
  loading: boolean;
}

export default function ExpenseList({ 
  expenses, 
  onExpenseUpdated, 
  onExpenseDeleted, 
  loading 
}: ExpenseListProps) {
  const [expandedExpenses, setExpandedExpenses] = useState<Set<string>>(new Set());
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const toggleExpanded = (expenseId: string) => {
    const newExpanded = new Set(expandedExpenses);
    if (newExpanded.has(expenseId)) {
      newExpanded.delete(expenseId);
    } else {
      newExpanded.add(expenseId);
    }
    setExpandedExpenses(newExpanded);
  };

  const handleTogglePaid = async (expense: Expense) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({ is_paid: !expense.is_paid })
        .eq('id', expense.id)
        .select()
        .single();

      if (error) throw error;
      onExpenseUpdated(data);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      onExpenseDeleted(expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const getStatusColor = (expense: Expense) => {
    if (expense.is_paid) return 'text-accent';
    if (expense.due_date && new Date(expense.due_date) < new Date()) return 'text-red-500';
    if (expense.due_date && new Date(expense.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
      return 'text-orange-500';
    }
    return 'text-muted-foreground';
  };

  const getStatusText = (expense: Expense) => {
    if (expense.is_paid) return 'Paid';
    if (expense.due_date && new Date(expense.due_date) < new Date()) return 'Overdue';
    if (expense.due_date && new Date(expense.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
      return 'Due Soon';
    }
    return 'Pending';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-8 text-center">
        <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Expenses Yet</h3>
        <p className="text-muted-foreground">Add your first expense to start tracking your budget.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Expenses</h3>
      </div>
      
      <div className="divide-y divide-border">
        {expenses.map((expense) => {
          const isExpanded = expandedExpenses.has(expense.id);
          
          return (
            <div key={expense.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => toggleExpanded(expense.id)}
                    className="mt-1 p-1 hover:bg-secondary-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground truncate">{expense.title}</h4>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-foreground">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(expense)}`}>
                          {getStatusText(expense)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {expense.category && (
                        <span className="px-2 py-1 bg-secondary-100 rounded text-xs">
                          {expense.category}
                        </span>
                      )}
                      {expense.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(expense.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {expense.receipt_url && (
                        <div className="flex items-center gap-1">
                          <Receipt className="h-3 w-3" />
                          <span>Receipt attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expense.is_paid}
                      onChange={() => handleTogglePaid(expense)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">Paid</span>
                  </label>
                  
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary-100 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="mt-4 ml-9 space-y-3">
                  {expense.notes && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Notes</h5>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {expense.notes}
                      </p>
                    </div>
                  )}
                  
                  {expense.receipt_url && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2">Receipt</h5>
                      <a
                        href={expense.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Receipt className="h-4 w-4" />
                        View Receipt
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  {expense.task_id && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Linked Task</h5>
                      <p className="text-sm text-muted-foreground">
                        This expense is linked to a planning task
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          isOpen={true}
          onClose={() => setEditingExpense(null)}
          onExpenseUpdated={onExpenseUpdated}
        />
      )}
    </div>
  );
}