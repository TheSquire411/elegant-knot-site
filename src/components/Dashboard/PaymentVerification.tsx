import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      verifyPayment(sessionId);
    } else if (paymentStatus === 'success') {
      setStatus('success');
      setMessage('Payment completed successfully! Your account has been upgraded.');
      // Auto redirect after 3 seconds
      setTimeout(() => navigate('/dashboard'), 3000);
    } else if (paymentStatus === 'cancelled') {
      setStatus('error');
      setMessage('Payment was cancelled. You can try again anytime.');
      setTimeout(() => navigate('/upgrade'), 3000);
    } else {
      setStatus('error');
      setMessage('Invalid payment status.');
    }
  }, [searchParams, navigate]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data?.success) {
        setStatus('success');
        setMessage(`Payment verified! You're now on the ${data.tier} plan.`);
        
        // Force refresh of user session to update subscription data
        await supabase.auth.getSession();
        
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        setStatus('error');
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage('There was an error verifying your payment.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center max-w-md">
        {status === 'success' ? (
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        )}
        <h3 className="text-xl font-semibold mb-2">
          {status === 'success' ? 'Payment Successful!' : 'Payment Issue'}
        </h3>
        <p className="text-muted-foreground mb-4">{message}</p>
        <p className="text-sm text-muted-foreground">
          Redirecting you automatically in a few seconds...
        </p>
      </div>
    </div>
  );
}