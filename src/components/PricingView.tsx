import React, { useState } from 'react';
import {
  Check,
  Zap,
  Sparkles,
  CreditCard,
  Building2,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { apiSimulateStripeCheckout } from '../services/api';

interface PricingViewProps {
  onSuccessUpgrade?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onSuccessUpgrade }) => {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: 'starter' | 'pro' | 'business') => {
    setIsLoading(plan);
    try {
      await apiSimulateStripeCheckout(plan, interval);
      if (onSuccessUpgrade) onSuccessUpgrade();
      alert(`Success! You have subscribed to the SocialPilot AI ${plan.toUpperCase()} plan.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 border border-indigo-500/30 text-center space-y-3 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Flexible SaaS Subscriptions</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-white">Scale Your Small Business Content Engine</h1>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Choose a plan that fits your growth. Refill AI credits, generate multi-platform campaigns, and customize AI brand voice.
        </p>

        {/* Monthly vs Yearly Toggle */}
        <div className="pt-2 inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setInterval('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              interval === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setInterval('yearly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              interval === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Yearly Billing</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Starter Solopreneur</h3>
              <p className="text-xs text-slate-400">Perfect for single founders and boutique brands.</p>
            </div>

            <div className="font-heading font-extrabold text-3xl text-white">
              {interval === 'yearly' ? '$19' : '$24'} <span className="text-xs text-slate-400 font-medium">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span><strong>100 AI Credits</strong> / month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>1 Brand Profile Workspace</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>30-Day Campaign Generator</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Instagram & Facebook Variations</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout('starter')}
            disabled={isLoading === 'starter'}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading === 'starter' && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Get Started</span>
          </button>
        </div>

        {/* Pro Plan (Featured) */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-950/90 to-slate-900 border-2 border-indigo-500 shadow-2xl relative space-y-6 flex flex-col justify-between">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
            Most Popular
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Pro Growth</h3>
              <p className="text-xs text-indigo-300">Designed for growing small businesses & creators.</p>
            </div>

            <div className="font-heading font-extrabold text-3xl text-white">
              {interval === 'yearly' ? '$49' : '$59'} <span className="text-xs text-indigo-300 font-medium">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-indigo-500/30">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span><strong>500 AI Credits</strong> / month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>3 Brand Workspaces</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Gemini High-Res Image Studio</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>AI Post Quality Audit & Suggestions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Advanced Content Calendar Filters & Sorting</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout('pro')}
            disabled={isLoading === 'pro'}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading === 'pro' && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Upgrade to Pro Now</span>
          </button>
        </div>

        {/* Business Agency Plan */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Agency / Unlimited</h3>
              <p className="text-xs text-slate-400">For agencies managing multiple client accounts.</p>
            </div>

            <div className="font-heading font-extrabold text-3xl text-white">
              {interval === 'yearly' ? '$129' : '$149'} <span className="text-xs text-slate-400 font-medium">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span><strong>2,000 AI Credits</strong> / month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Unlimited Brand Workspaces</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Custom Team Roles & Approvals</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Dedicated Support & API Access</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout('business')}
            disabled={isLoading === 'business'}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading === 'business' && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Contact Sales</span>
          </button>
        </div>
      </div>
    </div>
  );
};
