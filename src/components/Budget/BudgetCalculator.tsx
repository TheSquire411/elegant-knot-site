import { useState } from 'react';
import { Calculator, DollarSign, Users, MapPin, Sparkles, TrendingUp, AlertCircle, Download, Save } from 'lucide-react';
import { WEDDING_STYLES, LOCATION_MULTIPLIERS, LOCATION_OPTIONS, STYLE_MULTIPLIERS, BUDGET_CATEGORIES } from '../../constants/weddingData';

interface BudgetBreakdown {
  category: string;
  percentage: number;
  averageAmount: number;
  premiumAmount: number;
  description: string;
  costSavingTips: string[];
}

interface BudgetCalculatorProps {
  onSaveBudget?: (breakdown: BudgetBreakdown[]) => void;
}

export default function BudgetCalculator({ onSaveBudget }: BudgetCalculatorProps) {
  const [formData, setFormData] = useState({
    style: '',
    guestCount: 100,
    location: '',
    totalBudget: 25000,
    mustHaves: '',
    constraints: ''
  });
  const [breakdown, setBreakdown] = useState<BudgetBreakdown[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'average' | 'premium'>('average');

  const getStyleMultiplier = (style: string): number => {
    return STYLE_MULTIPLIERS[style] || 1.0;
  };

  const getLocationName = (code: string): string => {
    const location = LOCATION_OPTIONS.find(loc => loc.value === code);
    return location ? location.label : code;
  };

  const generateBudgetBreakdown = (): BudgetBreakdown[] => {
    const locationMultiplier = LOCATION_MULTIPLIERS[formData.location] || 1.0;
    const styleMultiplier = getStyleMultiplier(formData.style);
    const guestMultiplier = formData.guestCount > 150 ? 1.1 : formData.guestCount < 75 ? 0.9 : 1.0;

    return BUDGET_CATEGORIES.map(item => {
      const baseAmount = (formData.totalBudget * item.percentage) / 100;
      const adjustedAmount = baseAmount * locationMultiplier * styleMultiplier * guestMultiplier;
      
      return {
        ...item,
        averageAmount: Math.round(adjustedAmount),
        premiumAmount: Math.round(adjustedAmount * 1.4)
      };
    });
  };

  const handleCalculate = () => {
    const newBreakdown = generateBudgetBreakdown();
    setBreakdown(newBreakdown);
    setShowResults(true);
  };

  const getTotalAmount = () => {
    return breakdown.reduce((sum, item) => 
      sum + (selectedTier === 'average' ? item.averageAmount : item.premiumAmount), 0
    );
  };

  const getPerPersonCost = () => {
    return Math.round(getTotalAmount() / formData.guestCount);
  };

  const downloadBudget = () => {
    const csvContent = [
      ['Category', 'Percentage', selectedTier === 'average' ? 'Average Cost' : 'Premium Cost', 'Description'],
      ...breakdown.map(item => [
        item.category,
        `${item.percentage}%`,
        `$${(selectedTier === 'average' ? item.averageAmount : item.premiumAmount).toLocaleString()}`,
        item.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-budget-breakdown-${formData.style.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Calculator className="h-8 w-8 text-primary-500" />
          <h2 className="text-3xl font-serif font-bold text-gray-800">Personalized Budget Calculator</h2>
        </div>
        <p className="text-xl text-gray-600">Get a detailed cost breakdown based on your wedding style and preferences</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Style</label>
            <select
              value={formData.style}
              onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select your style</option>
              {WEDDING_STYLES.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
            <input
              type="number"
              value={formData.guestCount}
              onChange={(e) => setFormData(prev => ({ ...prev, guestCount: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="1"
              max="500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select state/territory</option>
              {LOCATION_OPTIONS.map(location => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget (AUD)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={formData.totalBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: Number(e.target.value) }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="5000"
                step="1000"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Must-Have Elements</label>
            <textarea
              value={formData.mustHaves}
              onChange={(e) => setFormData(prev => ({ ...prev, mustHaves: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
              placeholder="e.g., live band, premium photography, waterfront venue..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Constraints or Notes</label>
            <textarea
              value={formData.constraints}
              onChange={(e) => setFormData(prev => ({ ...prev, constraints: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
              placeholder="Any specific budget limitations or priorities..."
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleCalculate}
            disabled={!formData.style || !formData.location}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Calculate My Budget
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && breakdown.length > 0 && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">${getTotalAmount().toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Estimated Cost (AUD)</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">${getPerPersonCost()}</div>
              <div className="text-sm text-gray-600">Cost Per Guest (AUD)</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <MapPin className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{getLocationName(formData.location)}</div>
              <div className="text-sm text-gray-600">Location Factor</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <Sparkles className="h-8 w-8 text-gold-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{formData.style}</div>
              <div className="text-sm text-gray-600">Wedding Style</div>
            </div>
          </div>

          {/* Tier Selection */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Budget Breakdown</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedTier('average')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedTier === 'average'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Average
                  </button>
                  <button
                    onClick={() => setSelectedTier('premium')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedTier === 'premium'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Premium
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadBudget}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                  {onSaveBudget && (
                    <button
                      onClick={() => onSaveBudget(breakdown)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {breakdown.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-gray-800">{item.category}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-800">
                        ${(selectedTier === 'average' ? item.averageAmount : item.premiumAmount).toLocaleString()}
                      </div>
                      {selectedTier === 'average' && (
                        <div className="text-sm text-gray-500">
                          Premium: ${item.premiumAmount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="text-sm font-medium text-blue-800 mb-1">Cost-Saving Tips:</h5>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {item.costSavingTips.map((tip, tipIndex) => (
                            <li key={tipIndex}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Prices are estimates based on current market rates in {getLocationName(formData.location)}</li>
                  <li>• Actual costs may vary significantly based on specific vendors and choices</li>
                  <li>• Consider getting quotes from multiple vendors for accurate pricing</li>
                  <li>• The emergency buffer helps cover unexpected expenses and price changes</li>
                  <li>• {formData.style} style typically {getStyleMultiplier(formData.style) > 1 ? 'increases' : 'decreases'} costs by {Math.abs((getStyleMultiplier(formData.style) - 1) * 100).toFixed(0)}%</li>
                  <li>• All amounts are displayed in Australian Dollars (AUD)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}