import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-yellow-500/10 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          {language === 'en' ? 'Payment Cancelled' : 'পেমেন্ট বাতিল করা হয়েছে'}
        </h1>
        
        <p className="text-muted-foreground mb-8">
          {language === 'en' 
            ? 'You have cancelled the payment process. No charges have been made to your account.'
            : 'আপনি পেমেন্ট প্রক্রিয়া বাতিল করেছেন। আপনার অ্যাকাউন্ট থেকে কোনো টাকা কাটা হয়নি।'}
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/#pricing')}
            className="w-full bg-gradient-to-r from-primary to-blue-600"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Choose a Plan' : 'একটি প্ল্যান বেছে নিন'}
          </Button>
          
          <Link to="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
