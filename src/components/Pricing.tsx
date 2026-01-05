import React, { useState } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';

const models = [
  { name: 'ChatGPT 5', price: '$20/mo', color: 'bg-green-500' },
  { name: 'Google Gemini 2.5 Pro', price: '$20/mo', color: 'bg-purple-600' },
  { name: 'Perplexity Sonar Pro', price: '$20/mo', color: 'bg-orange-500' },
  { name: 'Claude Sonnet 4', price: '$20/mo', color: 'bg-amber-500' },
  { name: 'Grok 4', price: '$30/mo', color: 'bg-cyan-500' },
  { name: 'DeepSeek R1', price: '$15/mo', color: 'bg-violet-600' },
];

const disadvantages = [
  'Multiple subscriptions to manage – expensive',
  'Constant tab switching',
  'No comparison features',
];

const features = [
  'All Premium AI models in Super Fiesta',
  'Side-by-side comparison',
  '3 million tokens/month (Premium models count as 4×)',
  'Instant prompt enhancement',
  'Image generation & Audio transcription',
  'Avatars – your personalized expert team',
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div id="pricing" className="py-10 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
            Get 6 Premium AI Models <br />
            <span className="text-gradient-primary">
              for Half the Price of One
            </span>
          </h2>
          <p className="mt-4 text-xl text-green-600 font-medium flex items-center justify-center gap-3">
            <span className="px-4 py-1 bg-green-100 rounded-full text-sm font-semibold">Limited time</span>
            Save 90% compared to individual subscriptions
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-0">
            {/* Choose Your Plan Card */}
            <div className="bg-card border border-border rounded-3xl p-10 shadow-xl">
              <h3 className="text-2xl font-bold text-foreground text-center mb-8">Choose Your Plan</h3>

              <div className="flex items-center justify-center gap-8 mb-10">
                <span className={`text-xl font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className="relative w-44 h-14 bg-muted rounded-full p-2 shadow-inner"
                >
                  <div
                    className={`absolute top-2 left-2 w-20 h-10 rounded-full transition-all duration-300 flex items-center justify-center text-sm font-bold shadow-md ${
                      isYearly
                        ? 'translate-x-20 gradient-primary text-primary-foreground'
                        : 'translate-x-0 bg-card text-foreground'
                    }`}
                  >
                    {isYearly ? 'Yearly' : 'Monthly'}
                  </div>
                </button>
                <span className={`text-xl font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Yearly</span>
              </div>

              <div className="text-center">
                <span className="text-7xl font-black text-foreground">
                  {isYearly ? '$99' : '$12'}
                </span>
                <span className="text-2xl text-muted-foreground">/{isYearly ? 'Year' : 'Month'}</span>
                {isYearly && (
                  <p className="text-green-600 font-bold text-lg mt-4">
                    Save 32% → <s className="text-muted-foreground">$144</s>
                  </p>
                )}
              </div>
            </div>

            {/* Individual AI Subscriptions Card */}
            <div className="bg-card border border-border rounded-3xl p-10 shadow-xl -mt-4 relative z-10 border-t-0 rounded-t-none">
              <h3 className="text-2xl font-bold text-foreground mb-2">Individual AI Subscriptions</h3>
              <p className="text-5xl font-black text-destructive mb-1">
                $110+<span className="text-2xl text-muted-foreground">/Month</span>
              </p>
              <p className="text-muted-foreground text-lg mb-8">What you're paying now</p>

              <div className="space-y-5">
                {models.map((m) => (
                  <div key={m.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 ${m.color} rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm`}>
                        {m.name[0]}
                      </div>
                      <span className="font-medium text-foreground">{m.name}</span>
                    </div>
                    <span className="text-muted-foreground">{m.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                {disadvantages.map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <X className="w-6 h-6 text-destructive flex-shrink-0" strokeWidth={3} />
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - AI Fiesta Card */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-lg">
              {/* Most Popular Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                <div className="gradient-pink text-primary-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
                  <span className="w-3 h-3 bg-primary-foreground rounded-full animate-ping"></span>
                  MOST POPULAR
                </div>
              </div>

              <div className="bg-card border-2 border-border rounded-3xl p-10 pt-16 shadow-2xl">
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center text-5xl font-black text-primary-foreground shadow-2xl">
                    AI
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-center mb-8 text-foreground">AI Fiesta</h3>

                <div className="space-y-6 mb-10">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Check className="w-7 h-7 text-primary flex-shrink-0" strokeWidth={3} />
                      <span className="text-lg text-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-5 gradient-primary hover:opacity-90 text-primary-foreground text-xl font-bold rounded-2xl transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-3 group">
                  Get Started Now
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition" strokeWidth={3} />
                </button>

                <p className="text-center text-muted-foreground text-sm mt-6">
                  Payments are processed securely via <span className="text-orange-500 font-medium">TossPayments</span> or <span className="text-blue-500 font-medium">Stripe</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
