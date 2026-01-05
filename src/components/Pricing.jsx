import React, { useState } from 'react';
import { Check, X, ChevronRight, Sparkles } from 'lucide-react';

const models = [
  { name: 'ChatGPT 5', price: '$20/mo', color: 'from-green-500 to-emerald-500' },
  { name: 'Google Gemini 2.5 Pro', price: '$20/mo', color: 'from-blue-500 to-cyan-500' },
  { name: 'Perplexity Sonar Pro', price: '$20/mo', color: 'from-orange-500 to-red-500' },
  { name: 'Claude Sonnet 4', price: '$20/mo', color: 'from-amber-500 to-yellow-500' },
  { name: 'Grok 4', price: '$30/mo', color: 'from-cyan-500 to-blue-500' },
  { name: 'DeepSeek R1', price: '$15/mo', color: 'from-violet-500 to-purple-500' },
];

const disadvantages = [
  'Multiple subscriptions to manage',
  'Constant tab switching',
  'No side-by-side comparison',
];

const features = [
  'All 6 Premium AI models included',
  'Side-by-side AI comparison',
  '3 million tokens/month',
  'Instant prompt enhancement',
  'Image generation & Audio transcription',
  'Custom AI Avatars (Expert Teams)',
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-600 text-sm font-semibold mb-6">
            Limited Time Offer — Save 90%
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
            Get 6 Premium AI Models
            <br />
            <span className="text-gradient-primary">for Less Than One</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Why pay $110+/month for separate subscriptions when you can get everything for just $99/year?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Left: Comparison Card */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl">
            {/* Individual Subscriptions Header */}
            <div className="p-8 border-b border-border bg-destructive/5">
              <div className="flex items-center gap-3 mb-4">
                <X className="w-8 h-8 text-destructive" />
                <h3 className="text-2xl font-bold text-foreground">Individual Subscriptions</h3>
              </div>
              <p className="text-4xl md:text-5xl font-black text-destructive">
                $110+<span className="text-lg text-muted-foreground font-normal">/month</span>
              </p>
              <p className="text-muted-foreground mt-2">What most people pay</p>
            </div>

            {/* Models List */}
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {models.map((m) => (
                  <div key={m.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-md`}>
                        {m.name[0]}
                      </div>
                      <span className="font-medium text-foreground">{m.name}</span>
                    </div>
                    <span className="text-muted-foreground font-medium">{m.price}</span>
                  </div>
                ))}
              </div>

              {/* Disadvantages */}
              <div className="pt-6 border-t border-border space-y-3">
                {disadvantages.map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <X className="w-5 h-5 text-destructive flex-shrink-0" />
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Sorix Card */}
          <div className="relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="flex items-center gap-2 px-5 py-2 gradient-pink rounded-full text-primary-foreground text-sm font-bold shadow-xl">
                <Sparkles className="w-4 h-4" />
                MOST POPULAR
              </div>
            </div>

            <div className="bg-card rounded-3xl border-2 border-primary/20 overflow-hidden shadow-2xl pt-8">
              {/* Header */}
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto gradient-primary rounded-2xl flex items-center justify-center text-4xl font-black text-primary-foreground shadow-xl mb-6">
                  AI
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-6">AI Sorix</h3>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className={`font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                  <button
                    onClick={() => setIsYearly(!isYearly)}
                    className="relative w-16 h-8 rounded-full bg-muted p-1 transition-colors"
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 rounded-full gradient-primary shadow-md transition-all duration-300 ${
                        isYearly ? 'left-9' : 'left-1'
                      }`}
                    />
                  </button>
                  <span className={`font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Yearly</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-6xl md:text-7xl font-black text-foreground">
                    {isYearly ? '$99' : '$12'}
                  </span>
                  <span className="text-2xl text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                </div>
                {isYearly && (
                  <p className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-semibold">
                    Save 32% — <s className="text-muted-foreground">$144</s>
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="p-8 pt-0">
                <div className="space-y-4 mb-8">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full py-4 gradient-primary text-primary-foreground text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                  Get Started Now
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-muted-foreground text-sm mt-6">
                  Secure payments via <span className="text-foreground font-medium">Stripe</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
