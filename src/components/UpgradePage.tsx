import { useNavigate } from 'react-router-dom';
import { Heart, CheckCircle, Sparkles, Globe, Users, ArrowLeft, Crown, Loader } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useState } from 'react';

export default function UpgradePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (tier: string) => {
    try {
      setLoading(tier);
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { tier }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const pricingPlans = [
    {
      tier: 'basic',
      name: 'Basic',
      price: '$9.99',
      popular: false,
      features: [
        'Unlimited AI Assistant Chats',
        'Basic Website Builder',
        '5 Vision Boards',
        '500 Photo Uploads',
        'Email Support'
      ]
    },
    {
      tier: 'premium',
      name: 'Premium',
      price: '$29.99',
      popular: true,
      features: [
        'Everything in Basic',
        'Custom Domain for Website',
        'Unlimited Vision Boards',
        'Unlimited Photo Uploads',
        'Advanced RSVP Management',
        'Collaboration Tools',
        'Priority Support'
      ]
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      price: '$99.99',
      popular: false,
      features: [
        'Everything in Premium',
        'White-label Solutions',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Advanced Analytics',
        'API Access',
        '24/7 Phone Support'
      ]
    }
  ];

  const freeFeatures = [
    'Basic wedding planning checklist',
    'Simple budget tracker',
    'Basic website builder',
    '5 AI assistant messages',
    '1 vision board with 10 photos',
    'Standard RSVP (up to 50 guests)'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-serif font-semibold text-gray-800">Upgrade to Pro</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Crown className="h-16 w-16 text-gold-400" />
            <Sparkles className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800 mb-6">
            Unlock <span className="text-primary-500">Wedly Pro</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get unlimited access to all our premium features and plan the perfect wedding with ease. 
            Join thousands of couples who've upgraded to create their dream wedding.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Free</h3>
              <div className="text-3xl font-bold text-gray-600 mb-2">$0</div>
              <p className="text-gray-500 text-sm">Forever free</p>
            </div>
            <ul className="space-y-2 mb-6 text-sm">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="text-center">
              <div className="text-sm text-gray-500 font-medium">Current Plan</div>
            </div>
          </div>

          {/* Paid Plans */}
          {pricingPlans.map((plan) => (
            <div 
              key={plan.tier}
              className={`bg-white rounded-2xl shadow-lg p-6 border-2 relative ${
                plan.popular 
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-800 mb-2">{plan.price}</div>
                <p className="text-gray-500 text-sm">One-time payment</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={loading === plan.tier}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
              >
                {loading === plan.tier ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-12">
            Why Couples Love Wedly Pro
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">AI-Powered Planning</h3>
              <p className="text-gray-600">
                Get unlimited access to our AI assistant that helps with vendor recommendations, 
                timeline planning, and answers all your wedding questions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-sage-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Professional Website</h3>
              <p className="text-gray-600">
                Create a stunning wedding website with your own custom domain, 
                unlimited photos, and advanced RSVP management.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Collaboration Tools</h3>
              <p className="text-gray-600">
                Share your planning progress with family members and wedding planners. 
                Get everyone involved in creating your perfect day.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">
            What Our Pro Members Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600 italic mb-4">
                "Upgrading to Pro was the best decision we made! The AI assistant saved us hours of research, 
                and our wedding website looks absolutely stunning."
              </p>
              <div className="font-semibold text-gray-800">- Sarah & Michael</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600 italic mb-4">
                "The collaboration tools made it so easy to involve our families in the planning process. 
                Everyone could see our progress and contribute ideas."
              </p>
              <div className="font-semibold text-gray-800">- Emma & David</div>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">30-Day Money Back Guarantee</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're confident you'll love Wedly Pro. If you're not completely satisfied within 30 days, 
            we'll refund your money, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}