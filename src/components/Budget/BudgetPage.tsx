import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { Budget } from '../../types';
import BudgetTracker from './BudgetTracker';
import CreateBudgetModal from './CreateBudgetModal';
import BackButton from '../common/BackButton';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBudgets(data || []);
      
      // Auto-select the first budget if none selected
      if (!selectedBudget && data && data.length > 0) {
        setSelectedBudget(data[0]);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetCreated = (budget: Budget) => {
    setBudgets(prev => [budget, ...prev]);
    setSelectedBudget(budget);
  };

  const handleBudgetChange = (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    ));
    setSelectedBudget(updatedBudget);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary-100 p-4">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-48 mb-8"></div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="h-6 bg-secondary-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-secondary-200 rounded"></div>
                <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="subheading-accent text-primary mb-2">Financial Planning</div>
            <h1 className="section-heading text-primary-700">
              Budget Tracker
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {budgets.length > 0 && (
              <select
                value={selectedBudget?.id || ''}
                onChange={(e) => {
                  const budget = budgets.find(b => b.id === e.target.value);
                  setSelectedBudget(budget || null);
                }}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a budget</option>
                {budgets.map(budget => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
              </select>
            )}
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {budgets.length === 0 ? 'Create Budget' : 'New Budget'}
            </button>
          </div>
        </div>

        <BudgetTracker
          budget={selectedBudget}
          onBudgetChange={handleBudgetChange}
        />

        <CreateBudgetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onBudgetCreated={handleBudgetCreated}
        />
      </div>
    </div>
  );
}