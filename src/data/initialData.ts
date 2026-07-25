import { BrandProfile, PlanDetail, PostItem, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'user_101',
  name: 'Sarah Jenkins',
  email: 'sarah@luminaapparel.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  companyName: 'Lumina Apparel',
  role: 'Founder & CEO',
  plan: 'pro',
  aiCredits: 142,
  maxCredits: 250,
  isOnboarded: true,
};

export const INITIAL_BRAND: BrandProfile = {
  id: 'brand_lumina',
  name: 'Lumina Apparel',
  industry: 'Sustainable Fashion & Lifestyle',
  tone: 'Authentic, Inspiring & Modern',
  targetAudience: 'Eco-conscious millennials & professionals aged 24-42',
  primaryGoal: 'Drive Online Sales & Brand Community',
  websiteUrl: 'https://luminaapparel.com',
  logoUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&auto=format&fit=crop&q=80',
  brandColors: ['#6366f1', '#ec4899', '#10b981'],
  targetPlatforms: ['instagram', 'linkedin', 'twitter', 'facebook'],
  customKeywords: 'organic cotton, ethical manufacturing, timeless minimalist style, eco fashion tips'
};

export const INITIAL_BRANDS: BrandProfile[] = [
  INITIAL_BRAND,
  {
    id: 'brand_artisan',
    name: 'Artisan Roast Co.',
    industry: 'Specialty Coffee & Roastery',
    tone: 'Warm, Passionate & Expert',
    targetAudience: 'Coffee enthusiasts & remote workers',
    primaryGoal: 'Drive Coffee Subscriptions',
    websiteUrl: 'https://artisanroast.com',
    logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    brandColors: ['#78350f', '#d97706', '#fef3c7'],
    targetPlatforms: ['instagram', 'facebook', 'twitter'],
    customKeywords: 'single origin roast, direct trade beans, espresso tips'
  }
];


export const PLANS: PlanDetail[] = [
  {
    id: 'starter',
    name: 'Starter Pilot',
    monthlyPrice: 15,
    yearlyPrice: 144,
    creditsPerMonth: 60,
    maxBrands: 1,
    features: [
      '60 AI Content Generation Credits/mo',
      '1 Brand Profile Workspace',
      '30-Day Content Calendar & Planner',
      'Standard AI Caption Enhancer',
      'Instagram & Facebook Scheduling',
      'Basic Performance Analytics'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Pilot',
    monthlyPrice: 29,
    yearlyPrice: 288,
    creditsPerMonth: 250,
    maxBrands: 3,
    recommended: true,
    features: [
      '250 AI Content Credits/mo (~4 months of posts)',
      '3 Brand Profile Workspaces',
      'Gemini-3 Flash AI Image Generation Studio',
      '1-Click Multi-Platform Auto Formatting',
      'LinkedIn, Twitter/X, Instagram, FB & TikTok',
      'AI Viral Hook & Hashtag Optimizer',
      'Optimal Posting Time Recommendations',
      'Export to CSV & PDF Calendar'
    ]
  },
  {
    id: 'business',
    name: 'Agency & Scale',
    monthlyPrice: 79,
    yearlyPrice: 768,
    creditsPerMonth: 800,
    maxBrands: 10,
    features: [
      '800 AI Credits/mo for High-Volume Creation',
      'Up to 10 Client Workspaces',
      'Unlimited AI Image & Graphic Generation',
      'Team Member Role-Based Approvals',
      'Priority AI Generation Speed',
      'Custom Brand Voice Fine-Tuning',
      'Dedicated Account Success Manager',
      'Full API & Supabase/Custom Webhook Access'
    ]
  }
];

export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post_1',
    dayNumber: 1,
    scheduledDate: '2026-08-01',
    bestTime: '09:30 AM',
    contentPillar: 'Educational / Tips',
    title: '5 Steps to Build a Sustainable Wardrobe in 2026',
    primaryPlatform: 'instagram',
    contentType: 'image',
    tags: ['education', 'eco-fashion', 'sustainable'],
    createdAt: '2026-07-20T10:15:00Z',
    lastModified: '2026-07-24T14:20:00Z',
    viralityScore: 92,
    caption: `Fast fashion is officially out. Sustainability is forever. 🌱\n\nBuilding a wardrobe that lasts isn't about buying less—it's about buying intentionally. Here are 5 foundational rules:\n\n1. Choose natural certified organic fabrics (organic cotton, linen, hemp)\n2. Follow the 30-wear test before purchasing\n3. Care for garments with cold gentle washes\n4. Invest in versatile neutral foundational layers\n5. Repair & upcycle before replacing\n\nWhich rule is easiest for you to follow? Comment below! 👇`,
    hashtags: ['#SustainableFashion', '#SlowFashion', '#LuminaApparel', '#EcoFriendlyLiving', '#MinimalistWardrobe'],
    platformVariations: {
      instagram: `Fast fashion is officially out. Sustainability is forever. 🌱\n\nBuilding a wardrobe that lasts isn't about buying less—it's about buying intentionally. Here are 5 foundational rules:\n\n1. Choose natural certified organic fabrics\n2. Follow the 30-wear rule\n3. Care for garments with cold gentle washes\n4. Invest in versatile neutral foundational layers\n5. Repair & upcycle before replacing\n\nWhich rule is easiest for you to follow? Comment below! 👇\n\n#SustainableFashion #SlowFashion #LuminaApparel #EcoFashion`,
      linkedin: `Sustainable manufacturing is no longer a niche consumer preference—it's a core supply chain imperative for 2026.\n\nAt Lumina Apparel, we've reduced our water footprint by 40% through organic fiber sourcing and low-impact dyeing.\n\nHere are 3 insights for retail leaders looking to transition towards circular supply chains:\n\n1. Partner directly with certified GOTS fabric mills\n2. Design for durability & disassembly\n3. Transparent customer lifecycle reporting\n\nHow is your brand approaching sustainable sourcing this quarter?`,
      twitter: `Fast fashion is out. Wardrobe longevity is in. 🌿\n\n5 rules for an intentional, sustainable style in 2026:\n1. 30-wear rule before buying\n2. Organic certified fibers\n3. Cold gentle wash cycles\n4. Neutral staple layers\n5. Repair > replace\n\nThread 🧵👇`,
      facebook: `Ready to upgrade your style while protecting our planet? 🌱\n\nOur latest Lumina Capsule Collection is crafted from 100% GOTS-certified organic cotton. Built to last 100+ washes without losing softness.\n\nEnjoy 15% OFF your first sustainable order with code: LUMINA15`
    },
    visualPrompt: 'Minimalist flatlay of organic cotton beige linen t-shirt, dried eucalyptus, bamboo accessories, soft natural window light, aesthetic commercial photography',
    visualStyle: 'lifestyle_photo',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
    status: 'scheduled',
    likesCount: 142,
    commentsCount: 28,
    engagementHook: 'Which rule is easiest for you to follow? Comment below!'
  },
  {
    id: 'post_2',
    dayNumber: 2,
    scheduledDate: '2026-08-02',
    bestTime: '01:15 PM',
    contentPillar: 'Promotional / Offer',
    title: 'Autumn Organic Capsule Drop — Early Access',
    primaryPlatform: 'instagram',
    contentType: 'carousel',
    tags: ['promo', 'autumn-drop', 'launch', 'capsule'],
    createdAt: '2026-07-21T09:00:00Z',
    lastModified: '2026-07-25T02:10:00Z',
    viralityScore: 96,
    caption: `The Autumn Organic Capsule has landed. 🍂✨\n\nCrafted from 100% GOTS organic combed cotton and dyed with non-toxic botanicals. Ultra-soft, breathable, and designed to pair seamlessly with everything in your closet.\n\n🎁 Limited Batch Drop: Only 250 pieces crafted per colorway.\n\n👉 Tap link in bio to explore the collection before it sells out!`,
    hashtags: ['#CapsuleWardrobe', '#OrganicCotton', '#LuminaDrop', '#AutumnStyle', '#SustainableLuxury'],
    platformVariations: {
      instagram: `The Autumn Organic Capsule has landed. 🍂✨\n\nCrafted from 100% GOTS organic combed cotton. Ultra-soft, breathable, and designed to pair seamlessly with everything in your closet.\n\n🎁 Limited Batch Drop: Only 250 pieces crafted per colorway.\n\n👉 Tap link in bio to shop the drop!`,
      linkedin: `Product Innovation Spotlight: Launching our 2026 Autumn Organic Capsule.\n\nBy utilizing closed-loop water recirculation in production, each sweater saves over 850 liters of water compared to conventional garments.\n\nExplore our design approach and sustainable impact report on our website.`
    },
    visualPrompt: 'High fashion portrait of model wearing cozy oversized mocha knit sweater in minimalist studio setting with soft warm shadows',
    visualStyle: 'product_spotlight',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
    status: 'scheduled',
    likesCount: 210,
    commentsCount: 45,
    engagementHook: 'Which shade is your favorite? Comment below!'
  },
  {
    id: 'post_3',
    dayNumber: 3,
    scheduledDate: '2026-08-03',
    bestTime: '06:00 PM',
    contentPillar: 'Behind the Scenes',
    title: 'Inside Our Eco Studio: Zero Waste Pattern Cutting',
    primaryPlatform: 'linkedin',
    contentType: 'video',
    tags: ['behind-the-scenes', 'craftsmanship', 'zero-waste'],
    createdAt: '2026-07-18T14:30:00Z',
    lastModified: '2026-07-22T11:05:00Z',
    viralityScore: 88,
    caption: `Did you know traditional clothing manufacturing wastes up to 15% of fabric right on the cutting room floor?\n\nHere at Lumina Apparel, our zero-waste pattern engineers fit every design piece like a geometric puzzle, reducing scrap rate to under 1.2%.\n\nEvery tiny leftover fabric remnant is recycled into our eco-packaging tote bags! ♻️\n\nBuilding a greener future takes intentional design at every step.`,
    hashtags: ['#BehindTheScenes', '#ZeroWaste', '#SustainableDesign', '#CircularEconomy', '#LuminaCraft'],
    platformVariations: {
      instagram: `Peek behind the scenes in our atelier! ✂️\n\nWe design zero-waste pattern layouts that save thousands of yards of fabric every single season. Anything left over becomes our signature organic cotton packaging bags!\n\nTag someone who loves eco-conscious design!`,
      twitter: `Traditional fashion wastes 15% of fabric during cutting. We got ours down to 1.2% using digital zero-waste pattern puzzles. 🧩✂️\n\nSmall changes in design = massive environmental impact.`
    },
    visualPrompt: 'Clean aesthetic workshop table with wooden measuring ruler, organic thread spools, pattern sketches, warm workshop atmosphere',
    visualStyle: 'behind_the_scenes',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    status: 'scheduled',
    likesCount: 95,
    commentsCount: 14,
    engagementHook: 'What sustainability metric matters most to you?'
  },
  {
    id: 'post_4',
    dayNumber: 4,
    scheduledDate: '2026-08-04',
    bestTime: '11:00 AM',
    contentPillar: 'Social Proof / Testimonial',
    title: 'Customer Love: 100+ Washes & Still Perfect',
    primaryPlatform: 'facebook',
    contentType: 'image',
    tags: ['testimonial', 'reviews', 'social-proof'],
    createdAt: '2026-07-15T08:20:00Z',
    lastModified: '2026-07-19T16:00:00Z',
    viralityScore: 94,
    caption: `"I was skeptical about paying a premium for an organic tee, but after 8 months and over 50 washes, my Lumina shirt looks and feels as crisp as day one. No shrinkage, no pilling. Worth every penny!" — Maya R., Verified Buyer ⭐⭐⭐⭐⭐\n\nInvest in clothes that love you back. Click below to experience the Lumina difference!`,
    hashtags: ['#CustomerReview', '#LuminaCommunity', '#QualityGarments', '#SustainableStyle'],
    platformVariations: {
      instagram: `"After 8 months and 50+ washes, my Lumina shirt looks as crisp as day one." — Maya R. ⭐⭐⭐⭐⭐\n\nWe craft garments for life, not just for a season.\n\nTap link in bio to read 500+ verified 5-star reviews!`
    },
    visualPrompt: 'Minimalist frosted quote card with 5 gold glowing stars and quote text on dark slate backdrop',
    visualStyle: 'quote_card',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    likesCount: 312,
    commentsCount: 39,
    engagementHook: 'Have you tried Lumina pieces yet?'
  },
  {
    id: 'post_5',
    dayNumber: 5,
    scheduledDate: '2026-08-05',
    bestTime: '04:30 PM',
    contentPillar: 'Community / Engagement',
    title: 'Community Poll: Neutral Earth Tones vs Vibrant Botanicals',
    primaryPlatform: 'twitter',
    contentType: 'text',
    tags: ['poll', 'community', 'color-palette'],
    createdAt: '2026-07-22T11:00:00Z',
    lastModified: '2026-07-23T09:12:00Z',
    viralityScore: 85,
    caption: `Designing our Spring 2027 Palette! We need your vote 🗳️\n\nWhich color vibe are you leaning towards for next season?\n\nOption A: Soft Sage & Warm Oat\nOption B: Terracotta & Wild Indigo\n\nReply with A or B below! Highest voted shades get added to production.`,
    hashtags: ['#CommunityPoll', '#LuminaDesign', '#FashionDebate', '#SustainableFashion'],
    platformVariations: {
      twitter: `Designing our Spring 2027 Palette! We need your vote 🗳️\n\nA) Soft Sage & Warm Oat\nB) Terracotta & Wild Indigo\n\nVote below! 🧵👇`
    },
    visualPrompt: 'Split screen color palette preview showing organic dye samples in soft sage vs terracotta on linen background',
    visualStyle: 'minimalist_graphic',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    status: 'needs_review',
    likesCount: 88,
    commentsCount: 62,
    engagementHook: 'Drop A or B in the comments!'
  },
  {
    id: 'post_6',
    dayNumber: 6,
    scheduledDate: '2026-08-06',
    bestTime: '02:00 PM',
    contentPillar: 'Industry News',
    title: '2026 Circular Economy Report: The Future of Retail',
    primaryPlatform: 'linkedin',
    contentType: 'link',
    tags: ['report', 'industry-insights', 'circular-economy'],
    createdAt: '2026-07-19T13:10:00Z',
    lastModified: '2026-07-24T18:45:00Z',
    viralityScore: 90,
    caption: `Over 73% of consumers in 2026 prioritize brands with transparent circular supply chains.\n\nWe released our quarterly Sustainability & Circularity Benchmark report analyzing 50 leading e-commerce brands.\n\nKey takeaways:\n1. Digital Product Passports build immediate buyer trust\n2. Local garment repair programs increase lifetime value by 38%\n3. Closed-loop recycling drastically cuts raw material costs\n\nRead the full report online: https://luminaapparel.com/report-2026`,
    hashtags: ['#RetailTrends', '#CircularEconomy', '#SustainabilityReport', '#BusinessGrowth'],
    platformVariations: {
      linkedin: `Over 73% of consumers in 2026 prioritize brands with transparent circular supply chains.\n\nRead our full Sustainability Benchmark Report: https://luminaapparel.com/report-2026`
    },
    visualPrompt: 'Modern corporate report cover design for Lumina Sustainability 2026 on sleek glass surface',
    visualStyle: 'minimalist_graphic',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    status: 'draft',
    likesCount: 165,
    commentsCount: 22,
    engagementHook: 'How is your brand tackling circularity this year?'
  }
];
