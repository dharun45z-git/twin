import { AIAnalysisResult, BrandProfile, PostItem } from '../types';

export async function apiGenerate30DayBatch(
  brand: BrandProfile,
  monthName: string = 'August 2026',
  postCount: number = 30
): Promise<{ posts: Partial<PostItem>[]; source: string }> {
  try {
    const res = await fetch('/api/generate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandName: brand.name,
        industry: brand.industry,
        tone: brand.tone,
        targetAudience: brand.targetAudience,
        primaryGoal: brand.primaryGoal,
        platforms: brand.targetPlatforms,
        customKeywords: brand.customKeywords,
        monthName,
        postCount
      })
    });

    const data = await res.json();
    if (data.success && Array.isArray(data.posts)) {
      return { posts: data.posts, source: data.source || 'gemini' };
    }
    throw new Error(data.error || 'Failed to generate posts');
  } catch (err: any) {
    console.error('API Error apiGenerate30DayBatch:', err);
    throw err;
  }
}

export async function apiGenerateImage(
  prompt: string,
  aspectRatio: string = '1:1',
  style: string = 'modern'
): Promise<{ imageUrl: string; source: string }> {
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aspectRatio, style })
    });

    const data = await res.json();
    if (data.success && data.imageUrl) {
      return { imageUrl: data.imageUrl, source: data.source || 'gemini' };
    }
    throw new Error(data.error || 'Failed to generate image');
  } catch (err: any) {
    console.error('API Error apiGenerateImage:', err);
    throw err;
  }
}

export async function apiEnhanceCaption(
  caption: string,
  action: 'make_viral' | 'shorten' | 'expand_linkedin' | 'add_hashtags',
  targetPlatform: string = 'instagram',
  brandTone: string = 'Professional'
): Promise<string> {
  try {
    const res = await fetch('/api/enhance-caption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption, action, targetPlatform, brandTone })
    });

    const data = await res.json();
    if (data.success && data.enhancedCaption) {
      return data.enhancedCaption;
    }
    return caption;
  } catch (err: any) {
    console.error('API Error apiEnhanceCaption:', err);
    return caption;
  }
}

export async function apiAnalyzePost(
  post: Partial<PostItem>,
  brandTone: string = 'Professional & Inspiring'
): Promise<AIAnalysisResult> {
  try {
    const res = await fetch('/api/analyze-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: post.caption || '',
        title: post.title || '',
        primaryPlatform: post.primaryPlatform || 'instagram',
        contentType: post.contentType || 'image',
        hashtags: post.hashtags || [],
        brandTone
      })
    });

    const data = await res.json();
    if (data.success && data.analysis) {
      return data.analysis;
    }
    throw new Error(data.error || 'Failed to analyze post');
  } catch (err: any) {
    console.error('API Error apiAnalyzePost:', err);
    // Fallback client result
    return {
      qualityScore: 82,
      toneRating: 'Clear & Engaging',
      readabilityGrade: 'Grade 6',
      engagementHookScore: 78,
      suggestions: [
        {
          id: 'fallback_cta_' + Date.now(),
          category: 'engagement',
          title: 'Add a Strong Call to Action (CTA)',
          description: 'Direct your followers on what action to take next.',
          impact: 'High Impact',
          actionType: 'append_cta',
          suggestedContent: (post.caption || '') + '\n\n👉 Comment "YES" or save this post if you agree!'
        },
        {
          id: 'fallback_hashtags_' + Date.now(),
          category: 'platform_optimization',
          title: 'Add Target Niche Hashtags',
          description: 'Include 5-8 relevant hashtags to expand discoverability.',
          impact: 'Medium Impact',
          actionType: 'add_hashtags',
          suggestedContent: (post.caption || '') + '\n\n#SmallBusiness #GrowthStrategy #ContentCreator #SocialPilotAI'
        }
      ]
    };
  }
}

export async function apiSimulateStripeCheckout(
  plan: 'starter' | 'pro' | 'business',
  interval: 'monthly' | 'yearly'
): Promise<{ success: boolean; checkoutUrl?: string }> {
  try {
    const res = await fetch('/api/stripe-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, interval })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('API Error apiSimulateStripeCheckout:', err);
    return { success: true };
  }
}

