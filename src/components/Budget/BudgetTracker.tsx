import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { Budget, Expense } from '../../types';
import ExpenseList from './ExpenseList';
import AddExpenseModal from './AddExpenseModal';
import BudgetAnalysis from './BudgetAnalysis';
import { formatCurrency } from '../../utils/formatters';

interface BudgetTrackerProps {
  budget: Budget | null;
  onBudgetChange: (budget: Budget) => void;
}

export default function BudgetTracker({ budget, onBudgetChange }: BudgetTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (budget) {
      fetchExpenses();
    }
  }, [budget]);

  const fetchExpenses = async () => {
    if (!budget) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('budget_id', budget.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
    // Refresh budget to get updated spent amount
    refreshBudget();
  };

  const handleExpenseUpdated = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    ));
    refreshBudget();
  };

  const handleExpenseDeleted = (expenseId: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    refreshBudget();
  };

  const refreshBudget = async () => {
    if (!budget) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', budget.id)
        .single();

      if (error) throw error;
      if (data) {
        onBudgetChange(data);
      }
    } catch (error) {
      console.error('Error refreshing budget:', error);
    }
  };

  if (!budget) {
    return (
      <div className="text-center py-12">
        <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Budget Selected</h3>
        <p className="text-muted-foreground">Create a budget to start tracking your expenses.</p>
      </div>
    );
  }

  const remainingAmount = budget.total_amount - budget.spent_amount;
  const spentPercentage = (budget.spent_amount / budget.total_amount) * 100;
  const isOverBudget = budget.spent_amount > budget.total_amount;

  const upcomingExpenses = expenses.filter(exp => 
    !exp.is_paid && exp.due_date && new Date(exp.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">{budget.name}</h2>
          <button
            onClick={() => setIsAnalysisOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PieChart className="h-4 w-4" />
            AI Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(budget.total_amount, budget.currency || 'USD')}
            </div>
            <div className="text-sm text-muted-foreground">Total Budget</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-accent'}`}>
              {formatCurrency(budget.spent_amount, budget.currency || 'USD')}
            </div>
            <div className="text-sm text-muted-foreground">Spent</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-foreground'}`}>
              {formatCurrency(remainingAmount, budget.currency || 'USD')}
            </div>
            <div className="text-sm text-muted-foreground">
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Budget Progress</span>
            <span>{spentPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                isOverBudget 
                  ? 'bg-red-500' 
                  : spentPercentage > 80 
                    ? 'bg-orange-500' 
                    : 'bg-accent'
              }`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <div>
              <div className="font-medium text-foreground">Unpaid Expenses</div>
              <div className="text-sm text-muted-foreground">
                {expenses.filter(exp => !exp.is_paid).length} items
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <div>
              <div className="font-medium text-foreground">Due This Week</div>
              <div className="text-sm text-muted-foreground">
                {upcomingExpenses.length} items
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        onExpenseUpdated={handleExpenseUpdated}
        onExpenseDeleted={handleExpenseDeleted}
        loading={loading}
      />

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        budget={budget}
        onExpenseAdded={handleExpenseAdded}
      />

      <BudgetAnalysis
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        budget={budget}
        expenses={expenses}
      />
    </div>
  );
}