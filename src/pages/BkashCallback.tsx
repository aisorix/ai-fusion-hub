import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const BkashCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const processCallback = async () => {
      const paymentID = searchParams.get('paymentID');
      const paymentStatus = searchParams.get('status');

      if (paymentStatus === 'cancel') {
        navigate('/payment/cancel');
        return;
      }

      if (paymentStatus === 'failure') {
        navigate('/payment/failed');
        return;
      }

      if (!paymentID || paymentStatus !== 'success') {
        setStatus('failed');
        setMessage('Invalid payment callback');
        return;
      }

      try {
        // Execute the bKash payment
        const { data, error } = await supabase.functions.invoke('bkash-payment', {
          body: {
            action: 'execute_payment',
            paymentID,
          },
        });

        if (error || !data?.success) {
          setStatus('failed');
          setMessage(data?.error || 'Payment execution failed');
          setTimeout(() => navigate('/payment/failed'), 2000);
          return;
        }

        setStatus('success');
        setMessage('Payment successful!');
        setTimeout(() => navigate('/payment/success'), 1500);
      } catch (err) {
        console.error('bKash callback error:', err);
        setStatus('failed');
        setMessage('An error occurred');
        setTimeout(() => navigate('/payment/failed'), 2000);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          {status === 'processing' && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
          {status === 'success' && <span className="text-4xl">✅</span>}
          {status === 'failed' && <span className="text-4xl">❌</span>}
        </div>
        <h1 className="text-xl font-semibold mb-2">
          {status === 'processing' && 'Processing Payment'}
          {status === 'success' && 'Payment Successful'}
          {status === 'failed' && 'Payment Failed'}
        </h1>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default BkashCallback;
