import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Video,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Layers,
  Clock,
  Sparkles,
  List,
  Grid,
  CheckCircle2,
  Search,
  ArrowUpDown,
  Tag,
  X,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ContentType, Platform, PostItem, PostStatus } from '../types';

interface CalendarViewProps {
  posts: PostItem[];
  onSelectPost: (post: PostItem) => void;
  onCreateNewPostOnDate: (dateStr: string, dayNum: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onSelectPost,
  onCreateNewPostOnDate
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  
  // Advanced Filter States
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting States
  const [sortField, setSortField] = useState<'scheduledDate' | 'createdAt' | 'lastModified' | 'viralityScore' | 'dayNumber'>('scheduledDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const currentMonthName = 'August 2026';

  // Extract all unique custom tags across posts
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => set.add(t));
      }
    });
    return Array.from(set);
  }, [posts]);

  // Filter and Sort Logic
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter((p) => {
      // Platform filter
      if (platformFilter !== 'all' && p.primaryPlatform !== platformFilter) return false;

      // Content type filter
      if (contentTypeFilter !== 'all' && (p.contentType || 'image') !== contentTypeFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Custom Tag filter
      if (selectedTag !== 'all') {
        const hasTag = p.tags && p.tags.includes(selectedTag);
        if (!hasTag) return false;
      }

      // Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCaption = p.caption.toLowerCase().includes(q);
        const matchesHashtags = p.hashtags && p.hashtags.some((h) => h.toLowerCase().includes(q));
        const matchesTags = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCaption && !matchesHashtags && !matchesTags) return false;
      }

      return true;
    });

    // Sorting logic
    result.sort((a, b) => {
      let valA: any = a[sortField] || 0;
      let valB: any = b[sortField] || 0;

      if (sortField === 'scheduledDate') {
        valA = new Date(a.scheduledDate).getTime();
        valB = new Date(b.scheduledDate).getTime();
      } else if (sortField === 'createdAt') {
        valA = new Date(a.createdAt || '2026-07-01').getTime();
        valB = new Date(b.createdAt || '2026-07-01').getTime();
      } else if (sortField === 'lastModified') {
        valA = new Date(a.lastModified || '2026-07-01').getTime();
        valB = new Date(b.lastModified || '2026-07-01').getTime();
      } else if (sortField === 'viralityScore') {
        valA = a.viralityScore || 0;
        valB = b.viralityScore || 0;
      } else if (sortField === 'dayNumber') {
        valA = a.dayNumber || 0;
        valB = b.dayNumber || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [posts, platformFilter, contentTypeFilter, statusFilter, selectedTag, searchQuery, sortField, sortOrder]);

  const activeFilterCount =
    (platformFilter !== 'all' ? 1 : 0) +
    (contentTypeFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (selectedTag !== 'all' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const resetAllFilters = () => {
    setPlatformFilter('all');
    setContentTypeFilter('all');
    setStatusFilter('all');
    setSelectedTag('all');
    setSearchQuery('');
  };

  // Helper icons
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'twitter':
        return <Twitter className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'tiktok':
        return <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    }
  };

  const getContentTypeIcon = (cType?: ContentType) => {
    switch (cType) {
      case 'image':
        return <ImageIcon className="w-3 h-3 text-indigo-400" />;
      case 'video':
        return <Video className="w-3 h-3 text-red-400" />;
      case 'carousel':
        return <Layers className="w-3 h-3 text-amber-400" />;
      case 'link':
        return <LinkIcon className="w-3 h-3 text-emerald-400" />;
      case 'text':
        return <FileText className="w-3 h-3 text-slate-400" />;
      default:
        return <ImageIcon className="w-3 h-3 text-indigo-400" />;
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Published</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>Scheduled</span>
          </span>
        );
      case 'needs_review':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" />
            <span>Needs Review</span>
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            <span>Draft</span>
          </span>
        );
    }
  };

  // 31 Days for August 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls Panel */}
      <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-xl space-y-4">
        {/* Top Title Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-xl text-white">{currentMonthName}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {filteredAndSortedPosts.length} of {posts.length} Posts
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage, filter by channel, format, status or custom tags, and sort campaign posts.
              </p>
            </div>
          </div>

          {/* View Mode Toggle & Add Post */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  viewMode === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid Calendar</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>

            <button
              onClick={() => onCreateNewPostOnDate('2026-08-15', 15)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
            {/* 1. Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search title, caption, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* 2. Platform Filter */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="all">🌐 All Channels</option>
              <option value="instagram">📸 Instagram</option>
              <option value="linkedin">💼 LinkedIn</option>
              <option value="twitter">⚡ Twitter / X</option>
              <option value="facebook">📘 Facebook</option>
              <option value="tiktok">🎵 TikTok</option>
            </select>

            {/* 3. Content Type Filter */}
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="all">📂 All Formats</option>
              <option value="image">📷 Image Post</option>
              <option value="video">📹 Video / Reel</option>
              <option value="carousel">🎠 Carousel</option>
              <option value="link">🔗 Article Link</option>
              <option value="text">📝 Text / Thread</option>
            </select>

            {/* 4. Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="all">📊 All Statuses</option>
              <option value="scheduled">⏰ Scheduled</option>
              <option value="draft">📝 Drafts</option>
              <option value="needs_review">⚠️ Needs Review</option>
              <option value="published">✅ Published</option>
            </select>

            {/* 5. Custom Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-indigo-300 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="all">🏷️ All Tags</option>
              {allUniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Row & Active Filters Clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 flex-wrap">
              <span className="flex items-center gap-1 text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
                Sort By:
              </span>

              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="scheduledDate">Scheduled Date</option>
                <option value="createdAt">Creation Time</option>
                <option value="lastModified">Last Modified Time</option>
                <option value="viralityScore">AI Virality Index</option>
                <option value="dayNumber">Day Number</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>{sortOrder === 'asc' ? 'Oldest / Low-High ↑' : 'Newest / High-Low ↓'}</span>
              </button>
            </div>

            {/* Active Filters Counter & Reset */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''} Applied
                </span>
                <button
                  onClick={resetAllFilters}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Calendar View */}
      {viewMode === 'month' ? (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-3 sm:p-5 space-y-3">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 text-center text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {daysInMonth.map((dayNum) => {
              const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayPosts = filteredAndSortedPosts.filter((p) => p.dayNumber === dayNum);

              return (
                <div
                  key={dayNum}
                  className="min-h-[125px] sm:min-h-[155px] rounded-2xl bg-slate-800/40 border border-slate-700/40 p-2 flex flex-col justify-between hover:border-slate-600/90 transition-all group hover:bg-slate-800/60"
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-heading font-extrabold text-xs text-slate-300 group-hover:text-indigo-400 transition-colors">
                      {dayNum}
                    </span>

                    <button
                      onClick={() => onCreateNewPostOnDate(dateStr, dayNum)}
                      className="p-1 rounded-lg text-slate-500 hover:text-indigo-300 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="Add post on this day"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Posts */}
                  <div className="space-y-1.5 my-1 overflow-y-auto max-h-[105px] pr-0.5">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => onSelectPost(post)}
                        className={`p-1.5 rounded-xl border text-[11px] cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col gap-1 ${
                          post.status === 'scheduled'
                            ? 'bg-slate-800 border-indigo-500/40 hover:border-indigo-400 text-slate-100'
                            : post.status === 'published'
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                            : post.status === 'needs_review'
                            ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
                            : 'bg-slate-900 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0 truncate">
                            {getPlatformIcon(post.primaryPlatform)}
                            <span className="font-bold truncate text-[10px]">{post.title}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {getContentTypeIcon(post.contentType)}
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                post.status === 'scheduled'
                                  ? 'bg-indigo-400'
                                  : post.status === 'published'
                                  ? 'bg-emerald-400'
                                  : post.status === 'needs_review'
                                  ? 'bg-purple-400'
                                  : 'bg-amber-400'
                              }`}
                            />
                          </div>
                        </div>

                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt=""
                            className="w-full h-9 rounded-lg object-cover ring-1 ring-slate-700/60"
                          />
                        )}

                        <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            {post.bestTime}
                          </span>
                          {post.viralityScore !== undefined && (
                            <span className="text-violet-400 font-bold flex items-center gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" />
                              {post.viralityScore}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {dayPosts.length === 0 && (
                    <button
                      onClick={() => onCreateNewPostOnDate(dateStr, dayNum)}
                      className="w-full py-2 text-[10px] text-slate-500 hover:text-indigo-400 font-semibold border border-dashed border-slate-700/50 hover:border-indigo-500/40 rounded-xl transition-colors"
                    >
                      + Draft
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredAndSortedPosts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <Filter className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-white">No posts match your filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search query, platform filter, or content format selection.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors inline-block mt-2"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredAndSortedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-md"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-1 ring-slate-700/80"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 flex flex-col items-center justify-center shrink-0 text-indigo-300">
                      <span className="text-[10px] font-bold uppercase text-indigo-400">Day</span>
                      <span className="font-heading font-extrabold text-base leading-none">{post.dayNumber}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {post.contentPillar}
                      </span>

                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 bg-slate-900/60 px-2 py-0.5 rounded-lg border border-slate-700/50">
                        {getPlatformIcon(post.primaryPlatform)}
                        <span className="capitalize">{post.primaryPlatform}</span>
                      </span>

                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-lg border border-slate-700/50 capitalize">
                        {getContentTypeIcon(post.contentType)}
                        <span>{post.contentType || 'image'}</span>
                      </span>

                      <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {post.scheduledDate} @ {post.bestTime}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    {/* Custom Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <Tag className="w-3 h-3 text-indigo-400 shrink-0" />
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(t);
                            }}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-indigo-300 border border-slate-700/80 hover:border-indigo-500"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {post.viralityScore !== undefined && (
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Virality Score</div>
                      <div className="text-sm font-extrabold text-violet-400 flex items-center gap-1 justify-end">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {post.viralityScore}/100
                      </div>
                    </div>
                  )}

                  {getStatusBadge(post.status)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
