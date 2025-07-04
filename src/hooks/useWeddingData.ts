import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useApp } from '../context/AppContext';
import { Budget, Expense } from '../types';

export interface WeddingContext {
  budgets: Budget[];
  expenses: Expense[];
  websites: any[];
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  upcomingExpenses: Expense[];
  expensesByCategory: Record<string, number>;
}

export function useWeddingData() {
  const { state } = useApp();
  const user = state.user;
  const [weddingData, setWeddingData] = useState<WeddingContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWeddingData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWeddingData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch budgets
      const { data: budgets, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      if (budgetsError) throw budgetsError;

      // Fetch expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);

      if (expensesError) throw expensesError;

      // Fetch wedding websites
      const { data: websites, error: websitesError } = await supabase
        .from('wedding_websites')
        .select('*')
        .eq('user_id', user.id);

      if (websitesError) throw websitesError;

      // Process data
      const totalBudget = budgets?.reduce((sum, budget) => sum + budget.total_amount, 0) || 0;
      const totalSpent = budgets?.reduce((sum, budget) => sum + budget.spent_amount, 0) || 0;
      const remainingBudget = totalBudget - totalSpent;

      // Get upcoming expenses (unpaid)
      const upcomingExpenses = expenses?.filter(expense => !expense.is_paid) || [];

      // Group expenses by category
      const expensesByCategory = expenses?.reduce((acc, expense) => {
        const category = expense.category || 'Other';
        acc[category] = (acc[category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>) || {};

      setWeddingData({
        budgets: budgets || [],
        expenses: expenses || [],
        websites: websites || [],
        totalBudget,
        totalSpent,
        remainingBudget,
        upcomingExpenses,
        expensesByCategory,
      });
    } catch (err) {
      console.error('Error fetching wedding data:', err);
      setError('Failed to load wedding data');
    } finally {
      setLoading(false);
    }
  };

  return {
    weddingData,
    loading,
    error,
    refetch: fetchWeddingData,
  };
}