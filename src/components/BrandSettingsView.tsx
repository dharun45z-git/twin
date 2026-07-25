import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  Save,
  Check,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Video
} from 'lucide-react';
import { BrandProfile, Platform } from '../types';

interface BrandSettingsViewProps {
  brand: BrandProfile;
  onUpdateBrand: (updated: BrandProfile) => void;
}

export const BrandSettingsView: React.FC<BrandSettingsViewProps> = ({
  brand,
  onUpdateBrand
}) => {
  const [name, setName] = useState(brand.name);
  const [industry, setIndustry] = useState(brand.industry);
  const [tone, setTone] = useState(brand.tone);
  const [targetAudience, setTargetAudience] = useState(brand.targetAudience);
  const [primaryGoal, setPrimaryGoal] = useState(brand.primaryGoal);
  const [websiteUrl, setWebsiteUrl] = useState(brand.websiteUrl || '');
  const [customKeywords, setCustomKeywords] = useState(brand.customKeywords || '');
  const [targetPlatforms, setTargetPlatforms] = useState<Platform[]>(
    brand.targetPlatforms || ['instagram', 'linkedin', 'twitter', 'facebook']
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTogglePlatform = (p: Platform) => {
    if (targetPlatforms.includes(p)) {
      if (targetPlatforms.length > 1) {
        setTargetPlatforms(targetPlatforms.filter((item) => item !== p));
      }
    } else {
      setTargetPlatforms([...targetPlatforms, p]);
    }
  };

  const handleSave = () => {
    const updated: BrandProfile = {
      ...brand,
      name,
      industry,
      tone,
      targetAudience,
      primaryGoal,
      websiteUrl,
      customKeywords,
      targetPlatforms
    };
    onUpdateBrand(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Brand Voice & Positioning</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-white">Brand Setup & AI Guidelines</h1>
        <p className="text-xs text-slate-400">
          Define your core brand identity, target demographic, tone, and campaign goals to guide the 30-day AI content engine.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Brand profile updated successfully! AI content generation will now reflect these settings.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Brand / Business Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Industry / Niche</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Brand Tone of Voice</label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Professional, Inspiring, High Energy, Minimalist"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Primary Campaign Goal</label>
            <input
              type="text"
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Target Audience Description</label>
          <textarea
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Key Product Focus / Specific Keywords</label>
          <textarea
            value={customKeywords}
            onChange={(e) => setCustomKeywords(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            placeholder="e.g. Organic cotton, zero-waste packaging, sustainable luxury, autumn drop"
          />
        </div>

        {/* Target Platforms */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Default Target Channels</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'instagram' as Platform, name: 'Instagram', icon: Instagram, color: 'text-pink-400' },
              { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
              { id: 'twitter' as Platform, name: 'Twitter / X', icon: Twitter, color: 'text-sky-400' },
              { id: 'facebook' as Platform, name: 'Facebook', icon: Facebook, color: 'text-blue-500' }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = targetPlatforms.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTogglePlatform(item.id)}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Brand Guidelines</span>
          </button>
        </div>
      </div>
    </div>
  );
};
