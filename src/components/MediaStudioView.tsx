import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Download,
  Copy,
  Layers,
  Loader2,
  Check,
  RefreshCw,
  Sliders,
  Maximize2
} from 'lucide-react';
import { BrandProfile } from '../types';
import { apiGenerateImage } from '../services/api';

interface MediaStudioViewProps {
  brand: BrandProfile;
}

export const MediaStudioView: React.FC<MediaStudioViewProps> = ({ brand }) => {
  const [prompt, setPrompt] = useState(
    `Modern aesthetic promotional image for ${brand.name}, eco-friendly luxury packaging with warm morning lighting, studio photography`
  );
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('lifestyle_photo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'
  ]);
  const [selectedImage, setSelectedImage] = useState<string>(generatedImages[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await apiGenerateImage(prompt, aspectRatio, style);
      if (result.imageUrl) {
        setGeneratedImages([result.imageUrl, ...generatedImages]);
        setSelectedImage(result.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini AI Visual Studio</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-white">AI Social Media Image Generator</h1>
        <p className="text-xs text-slate-400">
          Craft brand-tailored photos, product spotlights, quote cards, and carousel visuals using Google Gemini image generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Controls */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Visual Concept Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              placeholder="Describe your desired photo..."
            />
            <button
              onClick={copyPrompt}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? 'Copied Prompt' : 'Copy Prompt'}</span>
            </button>
          </div>

          {/* Style Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Visual Aesthetic Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="lifestyle_photo">📸 Aesthetic Lifestyle Commercial Photography</option>
              <option value="product_spotlight">✨ Studio Product Spotlight with Warm Lighting</option>
              <option value="quote_card">💬 Minimalist Quote Card & Typography</option>
              <option value="behind_the_scenes">✂️ Behind-The-Scenes Workshop & Atelier</option>
              <option value="minimalist_graphic">🎨 Vector Brand Graphic & Infographic</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1:1', label: '1:1 (Insta Feed)' },
                { id: '9:16', label: '9:16 (Story / Reel)' },
                { id: '16:9', label: '16:9 (X / Banner)' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id)}
                  className={`py-2 rounded-xl text-[11px] font-bold border transition-all ${
                    aspectRatio === r.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>{isGenerating ? 'Generating Image...' : 'Generate High-Res Visual'}</span>
          </button>
        </div>

        {/* Right Gallery & Large Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="relative aspect-square max-h-[420px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center mx-auto">
              <img src={selectedImage} alt="" className="w-full h-full object-cover" />
              {isGenerating && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-2 text-white">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  <span className="text-xs font-bold">Gemini AI rendering studio graphics...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-slate-400 font-medium">Rendered via Gemini-3.1 Image Engine</span>
              <a
                href={selectedImage}
                target="_blank"
                rel="noreferrer"
                download="socialpilot_visual.jpg"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res</span>
              </a>
            </div>
          </div>

          {/* History Gallery Thumbs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300">Generated Visual History ({generatedImages.length})</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {generatedImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-indigo-500 scale-95 shadow-lg' : 'border-slate-800 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
