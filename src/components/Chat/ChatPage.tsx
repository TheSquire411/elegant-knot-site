import { useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import BackButton from '../common/BackButton';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import FeatureGate from '../Subscription/FeatureGate';
import { useWeddingData } from '../../hooks/useWeddingData';
import { useSubscription } from '../../hooks/useSubscription';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { weddingData, loading: weddingDataLoading } = useWeddingData();
  const { incrementUsage } = useSubscription();

  const sendWeddingMessage = async (message: string, context: any) => {
    try {
      const response = await fetch(`https://rpcnysgxybcffnprttar.supabase.co/functions/v1/gemini-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwY255c2d4eWJjZmZucHJ0dGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Mzg0NzEsImV4cCI6MjA2NzAxNDQ3MX0.SRW1RxKoEMnELP_n2HABctZls_niw6a5_D6PsSxvhUM`
        },
        body: JSON.stringify({
          type: 'weddingAssistant',
          message: message,
          weddingContext: context
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling wedding assistant:', error);
      throw error;
    }
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Increment usage
      await incrementUsage('ai_conversations');

      // Send message with wedding context
      const response = await sendWeddingMessage(message, weddingData);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || 'I apologize, but I had trouble processing your request.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startConversation = () => {
    if (weddingData) {
      const greeting = `Hello! I'm your AI Wedding Assistant. I can see you have ${weddingData.budgets.length} budget(s) with a total of $${weddingData.totalBudget.toLocaleString()} planned and $${weddingData.totalSpent.toLocaleString()} spent so far. How can I help you with your wedding planning today?`;
      
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: greeting,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="mb-8">
          <BackButton />
        </div>
        
        <div className="text-center mb-12">
          <div className="subheading-accent text-primary mb-4">AI Wedding Assistant</div>
          <h1 className="section-heading flex items-center justify-center gap-3 mb-8">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Wedding Assistant
          </h1>
        </div>

        <FeatureGate
          featureType="ai_conversations"
          featureName="AI Wedding Assistant"
          description="Get personalized wedding planning advice and insights"
        >
          <div className="bg-card rounded-2xl shadow-xl h-[600px] flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="section-heading text-lg mb-2">
                      Welcome to your AI Wedding Assistant!
                    </h3>
                    <p className="elegant-text mb-6 max-w-md mx-auto">
                      I can help you with budget planning, vendor suggestions, timeline management, and answer questions about your wedding plans.
                    </p>
                  {!weddingDataLoading && (
                    <button
                      onClick={startConversation}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Start Conversation
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-border p-6">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isTyping || weddingDataLoading}
                disabled={weddingDataLoading}
              />
            </div>
          </div>
        </FeatureGate>
      </div>
    </div>
  );
}