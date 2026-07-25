import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Video,
  Image as ImageIcon,
  Clock,
  Check,
  Copy,
  Trash2,
  Loader2,
  Send,
  Eye,
  Type,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  Tag,
  ArrowRight,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import { AIAnalysisResult, AISuggestion, ContentType, Platform, PostItem, PostStatus } from '../types';
import { apiAnalyzePost, apiEnhanceCaption, apiGenerateImage } from '../services/api';

interface PostEditorModalProps {
  post: PostItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPost: PostItem) => void;
  onDelete: (postId: string) => void;
  brandName: string;
  brandTone?: string;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  post,
  isOpen,
  onClose,
  onSave,
  onDelete,
  brandName,
  brandTone = 'Professional & Inspiring'
}) => {
  const [activeTab, setActiveTab] = useState<'ai_suggestions' | 'copy' | 'media' | 'preview' | 'schedule'>('ai_suggestions');
  const [title, setTitle] = useState(post.title);
  const [caption, setCaption] = useState(post.caption);
  const [hashtags, setHashtags] = useState<string[]>(post.hashtags || []);
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [primaryPlatform, setPrimaryPlatform] = useState<Platform>(post.primaryPlatform);
  const [contentType, setContentType] = useState<ContentType>(post.contentType || 'image');
  const [scheduledDate, setScheduledDate] = useState(post.scheduledDate);
  const [bestTime, setBestTime] = useState(post.bestTime);
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '');
  const [visualPrompt, setVisualPrompt] = useState(post.visualPrompt || '');
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // AI Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Quick Action States
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && post) {
      setTitle(post.title);
      setCaption(post.caption);
      setHashtags(post.hashtags || []);
      setTags(post.tags || []);
      setPrimaryPlatform(post.primaryPlatform);
      setContentType(post.contentType || 'image');
      setScheduledDate(post.scheduledDate);
      setBestTime(post.bestTime);
      setStatus(post.status);
      setImageUrl(post.imageUrl || '');
      setVisualPrompt(post.visualPrompt || '');

      // Automatically run AI analysis when modal opens
      runAIAnalysis(post.caption, post.title, post.primaryPlatform, post.contentType || 'image', post.hashtags || []);
    }
  }, [isOpen, post]);

  if (!isOpen) return null;

  // Run AI Post Quality Analysis
  const runAIAnalysis = async (c: string, t: string, platform: Platform, format: ContentType, hTags: string[]) => {
    setIsAnalyzing(true);
    try {
      const result = await apiAnalyzePost(
        {
          caption: c,
          title: t,
          primaryPlatform: platform,
          contentType: format,
          hashtags: hTags
        },
        brandTone
      );
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error running AI analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySuggestion = (sug: AISuggestion) => {
    if (sug.suggestedContent) {
      if (sug.actionType === 'add_hashtags') {
        const newHashtags = sug.suggestedContent.match(/#[a-zA-Z0-9_]+/g) || [];
        setHashtags(Array.from(new Set([...hashtags, ...newHashtags])));
      } else {
        setCaption(sug.suggestedContent);
      }

      setAppliedSuggestionIds([...appliedSuggestionIds, sug.id]);
      
      // Re-run analysis on updated caption
      runAIAnalysis(sug.suggestedContent, title, primaryPlatform, contentType, hashtags);
    }
  };

  const handleEnhance = async (action: 'make_viral' | 'shorten' | 'expand_linkedin' | 'add_hashtags') => {
    setIsEnhancing(true);
    try {
      const result = await apiEnhanceCaption(caption, action, primaryPlatform, brandTone);
      setCaption(result);
      runAIAnalysis(result, title, primaryPlatform, contentType, hashtags);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateAIImage = async () => {
    setIsGeneratingImage(true);
    try {
      const result = await apiGenerateImage(visualPrompt || title, aspectRatio, post.visualStyle || 'modern');
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSaveAll = () => {
    const updated: PostItem = {
      ...post,
      title,
      caption,
      hashtags,
      tags,
      primaryPlatform,
      contentType,
      scheduledDate,
      bestTime,
      status,
      imageUrl,
      visualPrompt,
      lastModified: new Date().toISOString()
    };
    onSave(updated);
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${caption}\n\n${hashtags.join(' ')}`);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-400" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-sky-400" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-500" />;
      case 'tiktok':
        return <Video className="w-4 h-4 text-cyan-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex flex-col items-center justify-center text-indigo-400 font-extrabold shrink-0">
              <span className="text-[10px] text-indigo-300 uppercase">Day</span>
              <span className="text-base leading-none">{post.dayNumber}</span>
            </div>

            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full font-heading font-extrabold text-lg text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Post Title..."
              />
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {post.contentPillar}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  {getPlatformIcon(primaryPlatform)}
                  <span className="capitalize">{primaryPlatform}</span>
                </span>
                <span>•</span>
                <span>{scheduledDate} @ {bestTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ai_suggestions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'ai_suggestions'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI Quality Audit & Suggestions</span>
            {analysisResult && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                {analysisResult.qualityScore}/100
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('copy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'copy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Caption Editor & Formats</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'media' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>AI Visual Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Channel Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'schedule' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Scheduling & Custom Tags</span>
          </button>
        </div>

        {/* Tab 1: AI Quality Audit & Actionable Suggestions */}
        {activeTab === 'ai_suggestions' && (
          <div className="space-y-6 my-2">
            {/* Top Score Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex flex-col items-center justify-center shrink-0">
                  <span className="font-heading font-extrabold text-2xl text-white">
                    {analysisResult?.qualityScore || 85}
                  </span>
                  <span className="text-[9px] font-bold text-indigo-300 uppercase">Score</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-base text-white">Post Quality Score</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      High Virality Potential
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Tone: <strong className="text-indigo-300">{analysisResult?.toneRating || 'Authentic & Engaging'}</strong> • Readability: <strong className="text-indigo-300">{analysisResult?.readabilityGrade || 'Grade 6'}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => runAIAnalysis(caption, title, primaryPlatform, contentType, hashtags)}
                disabled={isAnalyzing}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md self-stretch md:self-auto justify-center"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze Post'}</span>
              </button>
            </div>

            {/* Suggestions Cards List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Actionable Recommendations ({analysisResult?.suggestions.length || 0})</span>
                </h4>
                <span className="text-xs text-slate-400">Click "Apply Suggestion" to update post instantly</span>
              </div>

              {isAnalyzing ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Gemini AI is auditing caption hooks, clarity, and platform character limits...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {analysisResult?.suggestions.map((sug) => {
                    const isApplied = appliedSuggestionIds.includes(sug.id);

                    return (
                      <div
                        key={sug.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 ${
                          isApplied
                            ? 'bg-emerald-950/30 border-emerald-500/40'
                            : 'bg-slate-800/80 border-slate-700 hover:border-indigo-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                sug.category === 'engagement'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : sug.category === 'clarity'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : sug.category === 'tone'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              }`}>
                                {sug.category.replace('_', ' ')}
                              </span>

                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700">
                                {sug.impact}
                              </span>
                            </div>

                            <h5 className="font-bold text-sm text-slate-100">{sug.title}</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">{sug.description}</p>
                          </div>

                          <button
                            onClick={() => handleApplySuggestion(sug)}
                            disabled={isApplied}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                              isApplied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                            }`}
                          >
                            {isApplied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Wand2 className="w-3.5 h-3.5" />}
                            <span>{isApplied ? 'Applied' : 'Apply Suggestion'}</span>
                          </button>
                        </div>

                        {/* Snippet Preview Box */}
                        {sug.suggestedContent && (
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                            {sug.suggestedContent}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Caption Editor & AI Quick Actions */}
        {activeTab === 'copy' && (
          <div className="space-y-4 my-2">
            {/* Quick Action Toolbar */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                  AI Quick Copy Actions
                </span>
                {isEnhancing && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isEnhancing}
                  onClick={() => handleEnhance('make_viral')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/80 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/60 transition-all"
                >
                  🔥 Make Viral Hook
                </button>
                <button
                  type="button"
                  disabled={isEnhancing}
                  onClick={() => handleEnhance('shorten')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/80 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/60 transition-all"
                >
                  ✂️ Shorten (200 Chars)
                </button>
                <button
                  type="button"
                  disabled={isEnhancing}
                  onClick={() => handleEnhance('expand_linkedin')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/80 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/60 transition-all"
                >
                  💼 Expand for LinkedIn
                </button>
                <button
                  type="button"
                  disabled={isEnhancing}
                  onClick={() => handleEnhance('add_hashtags')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/80 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/60 transition-all"
                >
                  #️⃣ Add AI Hashtags
                </button>
              </div>
            </div>

            {/* Caption Text Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Main Post Caption</label>
                <button
                  onClick={copyToClipboard}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied!' : 'Copy Caption'}</span>
                </button>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
              />
            </div>

            {/* Hashtags Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Target Hashtags</label>
              <input
                type="text"
                value={hashtags.join(' ')}
                onChange={(e) => setHashtags(e.target.value.split(' '))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Visual Media Studio */}
        {activeTab === 'media' && (
          <div className="space-y-6 my-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Image Preview */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">Post Visual Media</label>
                <div className="relative aspect-square rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6 space-y-2 text-slate-400">
                      <ImageIcon className="w-10 h-10 mx-auto text-slate-500" />
                      <p className="text-xs">No image generated yet. Click "Generate AI Image" below!</p>
                    </div>
                  )}

                  {isGeneratingImage && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
                      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                      <span className="text-xs font-bold">Generating high-res visual via Gemini AI...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prompt Controls */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">AI Image Prompt</label>
                  <textarea
                    value={visualPrompt}
                    onChange={(e) => setVisualPrompt(e.target.value)}
                    rows={4}
                    placeholder="Describe the aesthetic photo or graphic prompt..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1:1', '9:16', '16:9'].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 rounded-xl border text-xs font-bold ${
                          aspectRatio === ratio
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isGeneratingImage}
                  onClick={handleGenerateAIImage}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Image with Gemini AI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Channel Preview */}
        {activeTab === 'preview' && (
          <div className="space-y-4 my-2">
            <div className="flex items-center gap-2 flex-wrap">
              {(['instagram', 'linkedin', 'twitter', 'facebook', 'tiktok'] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPrimaryPlatform(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize flex items-center gap-1.5 transition-all ${
                    primaryPlatform === p
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {getPlatformIcon(p)}
                  <span>{p}</span>
                </button>
              ))}
            </div>

            {/* Preview Box */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex justify-center">
              <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 text-slate-200 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs">
                    {brandName[0]}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">{brandName}</div>
                    <div className="text-[10px] text-slate-400">Sponsored • Just now</div>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {caption}
                </p>

                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-64 rounded-xl object-cover ring-1 ring-slate-800"
                  />
                )}

                <div className="text-xs font-medium text-indigo-400">
                  {hashtags.join(' ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Scheduling & Custom Tags */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 my-2 max-w-lg mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Scheduled Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Optimal Post Time</label>
                <input
                  type="text"
                  value={bestTime}
                  onChange={(e) => setBestTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Content Format & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Content Format</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500 capitalize"
                >
                  <option value="image">📷 Image Post</option>
                  <option value="video">📹 Video / Reel</option>
                  <option value="carousel">🎠 Carousel</option>
                  <option value="link">🔗 Article Link</option>
                  <option value="text">📝 Text / Thread</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Post Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500 capitalize"
                >
                  <option value="draft">📝 Draft</option>
                  <option value="scheduled">⏰ Scheduled</option>
                  <option value="needs_review">⚠️ Needs Review</option>
                  <option value="published">✅ Published</option>
                </select>
              </div>
            </div>

            {/* Custom Tags Section */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300">Custom Tags for Calendar Filtering</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. promo, autumn-launch, reels..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60"
                  >
                    #{t}
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-400 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Post</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              Save Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
