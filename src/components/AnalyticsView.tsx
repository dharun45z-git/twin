import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { PostItem } from '../types';

interface AnalyticsViewProps {
  posts: PostItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ posts }) => {
  const publishedPosts = posts.filter((p) => p.status === 'published' || p.likesCount);

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Real-time Insights</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-white">Social Engagement & AI Analytics</h1>
        <p className="text-xs text-slate-400">
          Track cross-platform performance, reach metrics, audience interactions, and AI virality rankings.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Reach</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 font-heading font-extrabold text-2xl text-white">48,290</div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.8% vs last month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Likes</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
          <div className="mt-3 font-heading font-extrabold text-2xl text-white">3,840</div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18.2% vs last month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Comments & Replies</span>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3 font-heading font-extrabold text-2xl text-white">628</div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+32.1% engagement rate</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Avg Virality Score</span>
            <TrendingUp className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-3 font-heading font-extrabold text-2xl text-white">91 / 100</div>
          <div className="text-[11px] text-indigo-300 font-semibold mt-1">
            Top 5% in Eco Fashion
          </div>
        </div>
      </div>

      {/* Top Performing Posts Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-heading font-bold text-base text-white">Top Performing Social Posts</h3>
        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-slate-700" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center font-bold text-indigo-300 shrink-0">
                    Day {p.dayNumber}
                  </div>
                )}
                <div className="min-w-0 space-y-1">
                  <h4 className="font-bold text-xs text-white truncate">{p.title}</h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="capitalize text-indigo-300 font-semibold">{p.primaryPlatform}</span>
                    <span>•</span>
                    <span>{p.contentType || 'image'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-1 text-pink-400">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{p.likesCount || 142}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{p.commentsCount || 28}</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Virality: {p.viralityScore || 92}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
