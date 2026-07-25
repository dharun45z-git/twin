import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Calendar as CalendarIcon,
  CheckCircle2,
  Sliders,
  Target,
  Wand2,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Loader2,
  Zap
} from 'lucide-react';
import { BrandProfile, Platform, PostItem } from '../types';
import { apiGenerate30DayBatch } from '../services/api';

interface GeneratorWizardProps {
  brand: BrandProfile;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (newPosts: PostItem[]) => void;
  userCredits: number;
}

export const GeneratorWizard: React.FC<GeneratorWizardProps> = ({
  brand,
  isOpen,
  onClose,
  onComplete,
  userCredits
}) => {
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [postCount, setPostCount] = useState(30);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(brand.targetPlatforms || ['instagram', 'linkedin', 'twitter', 'facebook']);
  const [toneTweak, setToneTweak] = useState(brand.tone);
  const [primaryGoal, setPrimaryGoal] = useState(brand.primaryGoal);
  const [customFocus, setCustomFocus] = useState(brand.customKeywords || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTogglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    setProgressStep(1);

    const stepTimer1 = setTimeout(() => setProgressStep(2), 1500);
    const stepTimer2 = setTimeout(() => setProgressStep(3), 3200);
    const stepTimer3 = setTimeout(() => setProgressStep(4), 5000);

    try {
      const updatedBrand: BrandProfile = {
        ...brand,
        tone: toneTweak,
        primaryGoal,
        targetPlatforms: selectedPlatforms,
        customKeywords: customFocus
      };

      const result = await apiGenerate30DayBatch(updatedBrand, selectedMonth, postCount);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const generatedList: PostItem[] = result.posts.map((p, idx) => {
        const dayNum = p.dayNumber || idx + 1;
        // Format date YYYY-MM-DD
        const dateObj = new Date(2026, 7, dayNum); // August 2026
        const dateStr = dateObj.toISOString().split('T')[0];

        return {
          id: `post_gen_${Date.now()}_${idx}`,
          dayNumber: dayNum,
          scheduledDate: dateStr,
          bestTime: p.bestTime || '10:00 AM',
          contentPillar: (p.contentPillar as any) || 'Educational / Tips',
          title: p.title || `Day ${dayNum}: ${brand.name} Highlight`,
          primaryPlatform: (p.primaryPlatform as Platform) || selectedPlatforms[0] || 'instagram',
          caption: p.caption || 'Engaging AI caption tailored for your business.',
          hashtags: p.hashtags || ['#SmallBusiness', `#${brand.name.replace(/\s+/g, '')}`],
          platformVariations: p.platformVariations || {
            instagram: p.caption,
            linkedin: p.caption,
            twitter: p.caption?.slice(0, 200),
            facebook: p.caption
          },
          visualPrompt: p.visualPrompt || `Sleek social media visual for ${brand.name}`,
          visualStyle: p.visualStyle || 'lifestyle_photo',
          status: 'scheduled',
          engagementHook: p.engagementHook || 'What do you think? Comment below!',
          contentType: 'image',
          tags: ['campaign', 'ai-generated', brand.name.toLowerCase()],
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          viralityScore: Math.floor(Math.random() * 12) + 86
        };
      });

      onComplete(generatedList);
      setIsGenerating(false);
      onClose();
    } catch (err: any) {
      console.error('Error generating posts:', err);
      setErrorMsg(err.message || 'Failed to generate posts. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        {!isGenerating && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Campaign Engine</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Generate 30 Days of Content for <span className="text-indigo-400">{brand.name}</span>
          </h2>
          <p className="text-xs text-slate-400">
            Customize campaign parameters below to generate 30 distinct daily posts mapped directly to your calendar.
          </p>
        </div>

        {/* Active Generation State */}
        {isGenerating ? (
          <div className="py-12 space-y-8 text-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Sparkles className="w-8 h-8 text-indigo-400 absolute animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-heading font-bold text-lg text-white">
                {progressStep === 1 && 'Analyzing brand voice & target audience...'}
                {progressStep === 2 && 'Crafting 30 daily hooks, captions & CTAs...'}
                {progressStep === 3 && 'Generating multi-platform variations & hashtags...'}
                {progressStep === 4 && 'Finalizing optimal post timings & visual prompts...'}
              </h3>
              <p className="text-xs text-slate-400">
                Gemini AI is processing your campaign using standard social media best practices.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-sm mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-700"
                style={{ width: `${progressStep * 25}%` }}
              />
            </div>
          </div>
        ) : (
          /* Wizard Inputs */
          <div className="space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Month & Post Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Target Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="August 2026">August 2026 (30 Days)</option>
                  <option value="September 2026">September 2026 (30 Days)</option>
                  <option value="October 2026">October 2026 (31 Days)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Post Count</label>
                <select
                  value={postCount}
                  onChange={(e) => setPostCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value={30}>Full 30-Day Calendar (30 Posts)</option>
                  <option value={15}>Bi-Weekly Sprint (15 Posts)</option>
                  <option value={7}>1-Week Blitz (7 Posts)</option>
                </select>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Target Social Platforms</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'instagram' as Platform, name: 'Instagram', icon: Instagram, color: 'text-pink-400' },
                  { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
                  { id: 'twitter' as Platform, name: 'Twitter / X', icon: Twitter, color: 'text-sky-400' },
                  { id: 'facebook' as Platform, name: 'Facebook', icon: Facebook, color: 'text-blue-500' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedPlatforms.includes(item.id);

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
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone of Voice Adjustment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Brand Tone of Voice</label>
              <input
                type="text"
                value={toneTweak}
                onChange={(e) => setToneTweak(e.target.value)}
                placeholder="e.g. Professional, Friendly, Inspiring, High Energy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Focus Keywords / Campaign Topic */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Special Topics / Product Focus</label>
              <textarea
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                rows={2}
                placeholder="e.g., Summer sale promo, product launch, eco manufacturing tips, customer reviews"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Uses <strong className="text-white">30 AI Credits</strong> (Balance: {userCredits})</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleStartGeneration}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Campaign Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
