import { useState } from 'react';
import { X, MessageCircle, Send, Loader } from 'lucide-react';
import { Budget, Expense } from '../../types';
import { supabase } from '../../integrations/supabase/client';
import { formatCurrency } from '../../utils/formatters';

interface BudgetAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget;
  expenses: Expense[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function BudgetAnalysis({ isOpen, onClose, budget, expenses }: BudgetAnalysisProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateBudgetSummary = () => {
    const totalExpenses = expenses.length;
    const paidExpenses = expenses.filter(exp => exp.is_paid).length;
    const unpaidExpenses = totalExpenses - paidExpenses;
    const overdueExpenses = expenses.filter(exp => 
      !exp.is_paid && exp.due_date && new Date(exp.due_date) < new Date()
    ).length;
    
    const categoryBreakdown = expenses.reduce((acc, exp) => {
      const category = exp.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      budget: {
        name: budget.name,
        total: budget.total_amount,
        spent: budget.spent_amount,
        remaining: budget.total_amount - budget.spent_amount,
        currency: budget.currency
      },
      expenses: {
        total: totalExpenses,
        paid: paidExpenses,
        unpaid: unpaidExpenses,
        overdue: overdueExpenses
      },
      categories: categoryBreakdown
    };
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    try {
      const budgetSummary = generateBudgetSummary();
      
      const { data, error } = await supabase.functions.invoke('deepseek-analysis', {
        body: {
          type: 'analyzeBudget',
          question: message,
          budgetData: budgetSummary,
          expenses: expenses.map(exp => ({
            title: exp.title,
            amount: exp.amount,
            category: exp.category,
            due_date: exp.due_date,
            is_paid: exp.is_paid,
            is_recurring: exp.is_recurring
          }))
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error analyzing budget:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while analyzing your budget. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startAnalysis = () => {
    sendMessage("Please analyze my budget and provide insights on my spending patterns, areas where I might be overspending, and suggestions for better budget management.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">AI Budget Analysis</h3>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Budget Overview */}
        <div className="p-6 border-b border-border bg-secondary-50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {formatCurrency(budget.total_amount, budget.currency)}
              </div>
              <div className="text-xs text-muted-foreground">Total Budget</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-accent">
                {formatCurrency(budget.spent_amount, budget.currency)}
              </div>
              <div className="text-xs text-muted-foreground">Spent</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${
                budget.spent_amount > budget.total_amount ? 'text-red-500' : 'text-foreground'
              }`}>
                {formatCurrency(budget.total_amount - budget.spent_amount, budget.currency)}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">AI Budget Analysis</h4>
              <p className="text-muted-foreground mb-4">
                Ask me questions about your budget or get an automatic analysis.
              </p>
              <button
                onClick={startAnalysis}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start Analysis
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-secondary-100 text-foreground'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-primary-100' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="bg-secondary-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Analyzing your budget...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputMessage);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your budget..."
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isAnalyzing}
            />
            <button
              type="submit"
              disabled={isAnalyzing || !inputMessage.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}