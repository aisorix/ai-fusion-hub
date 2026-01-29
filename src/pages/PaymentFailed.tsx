import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const tranId = searchParams.get('tran_id');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Failed Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          {language === 'en' ? 'Payment Failed' : 'পেমেন্ট ব্যর্থ হয়েছে'}
        </h1>
        
        <p className="text-muted-foreground mb-8">
          {language === 'en' 
            ? 'We could not process your payment. This could be due to insufficient funds, network issues, or a cancelled transaction.'
            : 'আমরা আপনার পেমেন্ট প্রসেস করতে পারিনি। এটি অপর্যাপ্ত ব্যালেন্স, নেটওয়ার্ক সমস্যা বা বাতিল লেনদেনের কারণে হতে পারে।'}
        </p>

        {tranId && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'en' ? 'Transaction Reference' : 'ট্রানজেকশন রেফারেন্স'}
            </p>
            <p className="font-mono text-foreground break-all">{tranId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/#pricing')}
            className="w-full bg-gradient-to-r from-primary to-blue-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Try Again' : 'আবার চেষ্টা করুন'}
          </Button>
          
          <Link to="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            {language === 'en' ? 'Need help? ' : 'সাহায্য প্রয়োজন? '}
            <Link to="/#contact" className="text-primary hover:underline">
              {language === 'en' ? 'Contact Support' : 'সাপোর্টে যোগাযোগ করুন'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
