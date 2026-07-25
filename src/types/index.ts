export type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'tiktok';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'needs_review';

export type ContentType = 'image' | 'video' | 'text' | 'link' | 'carousel';

export type ContentPillar =
  | 'Educational / Tips'
  | 'Promotional / Offer'
  | 'Behind the Scenes'
  | 'Social Proof / Testimonial'
  | 'Community / Engagement'
  | 'Industry News';

export interface PlatformVariations {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
}

export interface AISuggestion {
  id: string;
  category: 'engagement' | 'clarity' | 'tone' | 'platform_optimization';
  title: string;
  description: string;
  impact: 'High Impact' | 'Medium Impact' | 'Quick Fix';
  actionType: 'replace_caption' | 'append_cta' | 'add_hashtags' | 'format_bullets' | 'add_question';
  suggestedContent: string;
  applied?: boolean;
}

export interface AIAnalysisResult {
  qualityScore: number;
  toneRating: string;
  readabilityGrade: string;
  engagementHookScore: number;
  suggestions: AISuggestion[];
}

export interface PostItem {
  id: string;
  dayNumber: number;
  scheduledDate: string; // YYYY-MM-DD
  bestTime: string; // e.g. "09:30 AM"
  contentPillar: ContentPillar;
  title: string;
  primaryPlatform: Platform;
  contentType: ContentType;
  tags: string[];
  createdAt: string; // ISO date string
  lastModified: string; // ISO date string
  viralityScore: number; // 0 - 100
  caption: string;
  hashtags: string[];
  platformVariations: PlatformVariations;
  visualPrompt: string;
  visualStyle: string;
  imageUrl?: string;
  status: PostStatus;
  engagementHook?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  tone: string; // e.g., "Friendly & Relatable", "Professional", "Bold & Casual"
  targetAudience: string;
  primaryGoal: string;
  websiteUrl?: string;
  logoUrl?: string;
  brandColors: string[];
  targetPlatforms: Platform[];
  customKeywords: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  companyName: string;
  role: string;
  plan: 'starter' | 'pro' | 'business';
  aiCredits: number;
  maxCredits: number;
  isOnboarded: boolean;
}

export interface PlanDetail {
  id: 'starter' | 'pro' | 'business';
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  creditsPerMonth: number;
  maxBrands: number;
  features: string[];
  recommended?: boolean;
}
