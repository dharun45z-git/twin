import React from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  BarChart2,
  Zap,
  TrendingUp,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  ArrowRight,
  Plus,
  Sliders,
  Layers
} from 'lucide-react';
import { BrandProfile, PostItem, UserProfile } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  brand: BrandProfile;
  posts: PostItem[];
  onOpenGenerator: () => void;
  onOpenCalendar: () => void;
  onOpenMediaStudio: () => void;
  onEditPost: (post: PostItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  brand,
  posts,
  onOpenGenerator,
  onOpenCalendar,
  onOpenMediaStudio,
  onEditPost
}) => {
  const totalScheduled = posts.filter((p) => p.status === 'scheduled').length;
  const totalPublished = posts.filter((p) => p.status === 'published').length;
  const totalDrafts = posts.filter((p) => p.status === 'draft').length;

  const upcomingPosts = [...posts]
    .filter((p) => p.status === 'scheduled' || p.status === 'draft')
    .slice(0, 6);

  // Calculate pillar breakdown
  const pillarCounts: Record<string, number> = {};
  posts.forEach((p) => {
    pillarCounts[p.contentPillar] = (pillarCounts[p.contentPillar] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Hero 30-Day Campaign Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-950 p-6 sm:p-8 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Engine Ready for {brand.name}</span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              Generate 30 Days of Social Media Content in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-pink-300 to-amber-300">Under 2 Minutes</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Tailored specifically for <strong className="text-white">{brand.industry}</strong> with your brand tone (<span className="italic">{brand.tone}</span>). Generates posts, platform variations, hashtags, best post times & image prompts automatically.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={onOpenGenerator}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Generate 30-Day Calendar</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scheduled Posts */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Scheduled Posts</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-white">{totalScheduled}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">100% On Track</span> for the month
            </div>
          </div>
        </div>

        {/* Published Posts */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Published Posts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-white">{totalPublished}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span className="text-slate-300 font-bold">{totalDrafts} Drafts</span> awaiting review
            </div>
          </div>
        </div>

        {/* AI Engagement Score */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">AI Virality Index</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-white">92 / 100</div>
            <div className="text-[11px] text-violet-400 font-semibold mt-1">
              High Hook & Call-to-Action Score
            </div>
          </div>
        </div>

        {/* AI Credits */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">AI Credit Balance</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-white">{user.aiCredits}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Out of {user.maxCredits} monthly credits
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Scheduled Queue & Content Pillar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scheduled Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-100">Upcoming Content Queue</h2>
              <p className="text-xs text-slate-400">Review, edit, or adjust AI-generated posts before publishing.</p>
            </div>
            <button
              onClick={onOpenCalendar}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onEditPost(post)}
                className="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Visual preview thumb or icon */}
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-slate-700"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex flex-col items-center justify-center shrink-0 text-indigo-300">
                      <span className="text-[10px] uppercase font-bold text-indigo-400">Day</span>
                      <span className="font-heading font-extrabold text-base leading-none">{post.dayNumber}</span>
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {post.contentPillar}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {post.scheduledDate} @ {post.bestTime}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {post.caption}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    post.status === 'scheduled'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {post.status}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-700/50 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Platform Readiness & Content Pillars */}
        <div className="space-y-6">
          {/* Target Platforms */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center justify-between">
              <span>Connected Channels</span>
              <span className="text-xs font-semibold text-emerald-400">4 / 4 Active</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold text-slate-200">Instagram</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-2.5">
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-slate-200">LinkedIn</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-2.5">
                <Twitter className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold text-slate-200">Twitter / X</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-2.5">
                <Facebook className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-slate-200">Facebook</span>
              </div>
            </div>
          </div>

          {/* Content Pillar Strategy Mix */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center justify-between">
              <span>30-Day Pillar Mix</span>
              <span className="text-xs text-indigo-400 font-medium">Optimal Mix</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(pillarCounts).map(([pillar, count]) => {
                const percentage = Math.round((count / (posts.length || 1)) * 100);

                return (
                  <div key={pillar} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300 truncate">{pillar}</span>
                      <span className="text-slate-400">{count} posts ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
