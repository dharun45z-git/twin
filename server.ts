import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Gemini client lazily
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// --------------------------------------------------------------------------
// API Route: Generate 30-Day Content Plan
// --------------------------------------------------------------------------
app.post('/api/generate-batch', async (req, res) => {
  try {
    const {
      brandName = 'Acme Co',
      industry = 'Retail & E-commerce',
      tone = 'Professional & Engaging',
      targetAudience = 'Small business owners & professionals',
      primaryGoal = 'Brand Awareness & Sales',
      platforms = ['instagram', 'linkedin', 'twitter', 'facebook'],
      customKeywords = '',
      monthName = 'August 2026',
      postCount = 30
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = getGenAI();
      const prompt = `You are a world-class social media strategist and expert copywriter for small businesses.
Create a high-converting, realistic ${postCount}-day social media content calendar for "${brandName}".

Brand Context:
- Industry: ${industry}
- Tone of Voice: ${tone}
- Target Audience: ${targetAudience}
- Main Goal: ${primaryGoal}
- Target Platforms: ${platforms.join(', ')}
- Keywords/Focus Topics: ${customKeywords || 'General value, tips, social proof, promotions'}
- Month: ${monthName}

For EACH day from Day 1 to Day ${postCount}, generate a detailed post object with:
1. dayNumber (integer from 1 to ${postCount})
2. contentPillar: one of ["Educational / Tips", "Promotional / Offer", "Behind the Scenes", "Social Proof / Testimonial", "Community / Engagement", "Industry News"]
3. title: concise catchy internal title
4. primaryPlatform: best suited platform among [${platforms.join(', ')}]
5. caption: rich compelling main caption with line breaks and call-to-action
6. hashtags: array of 5-8 relevant hashtags
7. platformVariations: object mapping each selected platform (${platforms.join(', ')}) to a customized version of the post formatted specifically for that platform's character style and features.
8. bestTime: optimal posting time string (e.g. "09:30 AM", "01:15 PM", "06:00 PM")
9. visualPrompt: detailed AI image prompt describing a sleek professional graphic or photo for this post
10. visualStyle: one of ["minimalist_graphic", "lifestyle_photo", "infographic", "quote_card", "product_spotlight", "behind_the_scenes"]
11. engagementHook: 1-sentence question or call to action to boost comments

Return a valid JSON array of exactly ${postCount} post objects.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: `Array of ${postCount} daily social media posts`,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                contentPillar: { type: Type.STRING },
                title: { type: Type.STRING },
                primaryPlatform: { type: Type.STRING },
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                platformVariations: {
                  type: Type.OBJECT,
                  properties: {
                    instagram: { type: Type.STRING },
                    linkedin: { type: Type.STRING },
                    twitter: { type: Type.STRING },
                    facebook: { type: Type.STRING },
                  }
                },
                bestTime: { type: Type.STRING },
                visualPrompt: { type: Type.STRING },
                visualStyle: { type: Type.STRING },
                engagementHook: { type: Type.STRING }
              },
              required: ['dayNumber', 'contentPillar', 'title', 'primaryPlatform', 'caption', 'hashtags', 'bestTime', 'visualPrompt', 'engagementHook']
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const posts = JSON.parse(text);
        return res.json({ success: true, posts, source: 'gemini' });
      }
    }

    // High quality fallback generation if Gemini API key not present or fails
    const fallbackPosts = generateFallback30DayPosts(brandName, industry, tone, platforms, postCount);
    return res.json({ success: true, posts: fallbackPosts, source: 'fallback' });

  } catch (err: any) {
    console.error('Error in /api/generate-batch:', err);
    const { brandName = 'Acme Co', industry = 'Retail', tone = 'Friendly', platforms = ['instagram', 'linkedin', 'twitter', 'facebook'], postCount = 30 } = req.body || {};
    const fallbackPosts = generateFallback30DayPosts(brandName, industry, tone, platforms, postCount);
    return res.json({ success: true, posts: fallbackPosts, source: 'fallback', error: err.message });
  }
});

// --------------------------------------------------------------------------
// API Route: AI Image Generator
// --------------------------------------------------------------------------
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1', style = 'modern' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: `${prompt}. High quality commercial marketing graphic, ${style} aesthetic, vivid color harmony, 4k crisp detail.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio === '9:16' ? '9:16' : aspectRatio === '16:9' ? '16:9' : '1:1'
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            return res.json({
              success: true,
              imageUrl: `data:${mimeType};base64,${base64Data}`,
              source: 'gemini'
            });
          }
        }
      }
    }

    // SVG / Unsplash visual fallback if image generation is not available
    const fallbackUrl = generateCreativeImagePlaceholder(prompt, style);
    return res.json({ success: true, imageUrl: fallbackUrl, source: 'placeholder' });

  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    const { prompt = 'Social Media Graphic', style = 'modern' } = req.body || {};
    return res.json({
      success: true,
      imageUrl: generateCreativeImagePlaceholder(prompt, style),
      source: 'placeholder',
      error: err.message
    });
  }
});

// --------------------------------------------------------------------------
// API Route: AI Caption Enhancer / Optimizer
// --------------------------------------------------------------------------
app.post('/api/enhance-caption', async (req, res) => {
  try {
    const { caption, action, targetPlatform = 'instagram', brandTone = 'Professional' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && caption) {
      const ai = getGenAI();
      let instruction = `Rewrite this caption to make it more engaging for ${targetPlatform} using a ${brandTone} tone. Keep key message, add appropriate formatting, line breaks, and emojis.`;

      if (action === 'make_viral') {
        instruction = `Transform this post caption into a high-converting, viral-style post tailored for ${targetPlatform}. Use an attention-grabbing hook, strong formatting, bullet points, and an irresistible call to action.`;
      } else if (action === 'shorten') {
        instruction = `Shorten this caption to under 200 characters while preserving the main message and call to action. Perfect for quick scanning.`;
      } else if (action === 'expand_linkedin') {
        instruction = `Expand this post into a thought-leadership LinkedIn post with short punchy paragraphs, actionable takeaways, personal reflection, and a discussion question at the end.`;
      } else if (action === 'add_hashtags') {
        instruction = `Keep the original caption and add 8-12 high-reach targeted hashtags tailored for small businesses and ${targetPlatform}.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${instruction}\n\nOriginal Caption:\n"${caption}"`
      });

      const text = response.text;
      if (text) {
        return res.json({ success: true, enhancedCaption: text.trim(), source: 'gemini' });
      }
    }

    // Fallback enhancement
    let enhanced = caption || '';
    if (action === 'make_viral') {
      enhanced = `🔥 GAME CHANGER for your business:\n\n${caption}\n\n👉 Save this post & share with someone who needs to hear this! #Growth #SmallBusiness`;
    } else if (action === 'add_hashtags') {
      enhanced = `${caption}\n\n#SmallBusinessOwner #BusinessGrowth #MarketingTips #SocialPilotAI #EntrepreneurLife #GrowthHacks`;
    } else if (action === 'shorten') {
      enhanced = caption.slice(0, 180) + '... Tap link in bio to learn more! ✨';
    } else {
      enhanced = `✨ ${caption}\n\n💬 What are your thoughts? Drop a comment below! 👇`;
    }

    return res.json({ success: true, enhancedCaption: enhanced, source: 'fallback' });
  } catch (err: any) {
    console.error('Error in /api/enhance-caption:', err);
    return res.json({ success: false, error: err.message });
  }
});

// --------------------------------------------------------------------------
// API Route: AI Post Quality Analysis & Actionable Suggestions
// --------------------------------------------------------------------------
app.post('/api/analyze-post', async (req, res) => {
  try {
    const { caption = '', title = '', primaryPlatform = 'instagram', contentType = 'image', hashtags = [], brandTone = 'Professional & Inspiring' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && caption) {
      const ai = getGenAI();
      const prompt = `You are a top social media conversion strategist. Analyze this social media post draft and produce specific, actionable suggestions to improve engagement, clarity, tone, and platform optimization.

Post Context:
- Primary Channel: ${primaryPlatform}
- Content Format: ${contentType}
- Target Brand Tone: ${brandTone}
- Post Title: "${title}"
- Current Caption: "${caption}"
- Hashtags: ${hashtags.join(', ') || 'None'}

Evaluate the post and return a JSON object with:
1. qualityScore (integer 60-98)
2. toneRating (short summary of tone fit)
3. readabilityGrade (e.g. "Grade 6 - Very Readable")
4. engagementHookScore (integer 50-100)
5. suggestions (array of 3-5 concise, actionable advice objects):
   - id: unique string ID
   - category: one of ["engagement", "clarity", "tone", "platform_optimization"]
   - title: catchy title of advice (e.g. "Add a High-Converting Question", "Incorporate Instagram Double-Tap Driver", "Shorten Twitter Length", "Format for LinkedIn Readability")
   - description: 1-sentence reason why this advice improves performance.
   - impact: "High Impact" | "Medium Impact" | "Quick Fix"
   - actionType: "replace_caption" | "append_cta" | "add_hashtags" | "format_bullets" | "add_question"
   - suggestedContent: the EXACT text snippet or modified caption to apply when user clicks "Apply Suggestion".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              qualityScore: { type: Type.INTEGER },
              toneRating: { type: Type.STRING },
              readabilityGrade: { type: Type.STRING },
              engagementHookScore: { type: Type.INTEGER },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    impact: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                    suggestedContent: { type: Type.STRING }
                  },
                  required: ['id', 'category', 'title', 'description', 'impact', 'actionType', 'suggestedContent']
                }
              }
            },
            required: ['qualityScore', 'toneRating', 'readabilityGrade', 'engagementHookScore', 'suggestions']
          }
        }
      });

      const text = response.text;
      if (text) {
        const analysis = JSON.parse(text);
        return res.json({ success: true, analysis, source: 'gemini' });
      }
    }

    // Fallback AI analysis generator
    const fallbackAnalysis = generateFallbackPostAnalysis(caption, primaryPlatform, hashtags);
    return res.json({ success: true, analysis: fallbackAnalysis, source: 'fallback' });

  } catch (err: any) {
    console.error('Error in /api/analyze-post:', err);
    const { caption = '', primaryPlatform = 'instagram', hashtags = [] } = req.body || {};
    return res.json({
      success: true,
      analysis: generateFallbackPostAnalysis(caption, primaryPlatform, hashtags),
      source: 'fallback'
    });
  }
});

function generateFallbackPostAnalysis(caption: string, platform: string, hashtags: string[]) {
  const charCount = caption.length;
  const suggestions = [];

  // Suggestion 1: Engagement Question
  if (!caption.includes('?')) {
    suggestions.push({
      id: 'sug_question_' + Date.now(),
      category: 'engagement',
      title: 'Add an Interactive Question Hook',
      description: 'Posts that ask direct questions receive up to 3.4x more comments and community interactions.',
      impact: 'High Impact',
      actionType: 'add_question',
      suggestedContent: caption + '\n\n💬 What are your thoughts on this? Drop a comment below! 👇'
    });
  }

  // Suggestion 2: Call to Action (CTA)
  if (!caption.toLowerCase().includes('click') && !caption.toLowerCase().includes('tap') && !caption.toLowerCase().includes('link')) {
    suggestions.push({
      id: 'sug_cta_' + Date.now(),
      category: 'engagement',
      title: 'Include a Clear Call-To-Action (CTA)',
      description: 'Directing viewers on what step to take next boosts click-throughs and saves.',
      impact: 'High Impact',
      actionType: 'append_cta',
      suggestedContent: caption + '\n\n👉 Save this post for later & tap the link in our bio to learn more! ✨'
    });
  }

  // Suggestion 3: Platform Specific Optimization
  if (platform === 'twitter' && charCount > 260) {
    suggestions.push({
      id: 'sug_twitter_limit_' + Date.now(),
      category: 'platform_optimization',
      title: 'Twitter / X Character Limit Check',
      description: 'Your caption is close to the 280-character limit. Shortening it improves retweets.',
      impact: 'Quick Fix',
      actionType: 'replace_caption',
      suggestedContent: caption.slice(0, 240) + '... 🧵 Full details in thread below!'
    });
  } else if (platform === 'instagram' && hashtags.length < 5) {
    suggestions.push({
      id: 'sug_insta_hashtags_' + Date.now(),
      category: 'platform_optimization',
      title: 'Optimize Instagram Hashtag Density',
      description: 'Instagram posts with 5-10 targeted niche hashtags see 28% higher organic reach.',
      impact: 'Medium Impact',
      actionType: 'add_hashtags',
      suggestedContent: caption + '\n\n#SmallBusiness #GrowthHacks #OrganicReach #ContentStrategy #BrandCommunity'
    });
  } else if (platform === 'linkedin') {
    suggestions.push({
      id: 'sug_linkedin_spacing_' + Date.now(),
      category: 'clarity',
      title: 'Enhance LinkedIn Paragraph Readability',
      description: 'Break wall-of-text into punchy 1-2 sentence lines for smooth mobile browsing.',
      impact: 'Medium Impact',
      actionType: 'format_bullets',
      suggestedContent: caption.replace(/\. /g, '.\n\n')
    });
  }

  // Suggestion 4: Clarity & Formatting
  suggestions.push({
    id: 'sug_bullet_points_' + Date.now(),
    category: 'clarity',
    title: 'Structure Key Points with Emojis & Bullets',
    description: 'Scannable bullet points increase reading completion rate by 42%.',
    impact: 'Medium Impact',
    actionType: 'replace_caption',
    suggestedContent: `✨ KEY HIGHLIGHT:\n\n${caption}\n\n• 🌿 Point 1: Sustainable & high quality\n• ⚡ Point 2: Fast execution & proven results\n• 🎯 Point 3: Community focused`
  });

  return {
    qualityScore: Math.min(94, 72 + Math.floor(charCount / 20) + (caption.includes('?') ? 8 : 0)),
    toneRating: 'Authentic, Professional & Engaging',
    readabilityGrade: 'Grade 6 - Very Scannable',
    engagementHookScore: caption.includes('?') ? 92 : 68,
    suggestions
  };
}

// --------------------------------------------------------------------------
// API Route: Stripe Checkout Simulation
// --------------------------------------------------------------------------
app.post('/api/stripe-checkout', (req, res) => {
  const { plan = 'pro', interval = 'monthly' } = req.body;
  const price = plan === 'business' ? (interval === 'yearly' ? '$790/year' : '$79/mo') : (interval === 'yearly' ? '$290/year' : '$29/mo');
  
  res.json({
    success: true,
    checkoutUrl: '#',
    session: {
      id: 'cs_test_' + Math.random().toString(36).substring(2, 12),
      plan,
      interval,
      amount: price,
      status: 'active',
      customerEmail: 'user@example.com',
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });
});

// --------------------------------------------------------------------------
// Helper: 30-Day Fallback Generator
// --------------------------------------------------------------------------
function generateFallback30DayPosts(brandName: string, industry: string, tone: string, platforms: string[], count = 30) {
  const pillars = [
    'Educational / Tips',
    'Promotional / Offer',
    'Behind the Scenes',
    'Social Proof / Testimonial',
    'Community / Engagement',
    'Industry News'
  ];

  const templates = [
    {
      pillar: 'Educational / Tips',
      title: '5 Game-Changing Strategies for Growth',
      hook: 'What is the #1 mistake most people make in ' + industry + '?',
      body: `Here are 5 quick wins you can implement today to stay ahead in ${industry}:\n\n1. Audit your current workflow\n2. Focus on client satisfaction\n3. Leverage smart automation\n4. Benchmark your top competitors\n5. Consistency over perfection\n\nWhich one are you implementing first?`,
      visualPrompt: `Sleek infographic style vector image featuring 5 growth steps for ${brandName}, dark indigo background, modern typography`,
      style: 'infographic'
    },
    {
      pillar: 'Promotional / Offer',
      title: 'Special VIP Offer & Feature Spotlight',
      hook: `Ready to upgrade your ${industry} experience?`,
      body: `At ${brandName}, we believe in delivering top-tier quality every single time.\n\n✨ For a limited time, get exclusive access to our premium package with 20% OFF!\n\n👉 Click the link in our bio or comment "READY" to claim yours today!`,
      visualPrompt: `High-converting promotional product graphic for ${brandName} with 20% OFF badge, glowing purple lighting, professional studio shot`,
      style: 'product_spotlight'
    },
    {
      pillar: 'Behind the Scenes',
      title: 'A Day in the Life Behind the Scenes',
      hook: 'Ever wondered what goes into creating exceptional results?',
      body: `Here is a peek behind the curtain at ${brandName}! 🛠️\n\nFrom early morning brain-storms to polishing every fine detail, our team puts heart into everything we build.\n\nTag a fellow entrepreneur who hustles hard!`,
      visualPrompt: `Authentic behind the scenes workplace photography of team collaborating at ${brandName}, warm natural sunlight`,
      style: 'behind_the_scenes'
    },
    {
      pillar: 'Social Proof / Testimonial',
      title: 'Customer Spotlight & Success Story',
      hook: 'Real results speak louder than words. 💬',
      body: `"Working with ${brandName} completely transformed our operations. We saved 15+ hours a week and doubled our reach!" — Verified Client\n\nWe are honored to empower businesses like yours to reach new heights.`,
      visualPrompt: `Elegant customer quote card with 5 gold stars, clean frosted glass texture, modern serif title for ${brandName}`,
      style: 'quote_card'
    },
    {
      pillar: 'Community / Engagement',
      title: 'Weekly Community Question & Poll',
      hook: 'Let’s settle the debate once and for all! 👇',
      body: `When it comes to success in ${industry}, what matters MORE to you?\n\nA) Speed & Automation\nB) Personalization & Craftsmanship\n\nDrop A or B in the comments below! We’ll be replying to every single comment today.`,
      visualPrompt: `Interactive poll graphic with vibrant contrasting options A and B, minimalist geometric aesthetic for ${brandName}`,
      style: 'minimalist_graphic'
    },
    {
      pillar: 'Industry News',
      title: 'Future Trends & What You Need to Know',
      hook: `The landscape of ${industry} is shifting fast. Are you ready?`,
      body: `Here are 3 major shifts happening right now:\n\n📈 1. AI integration is mandatory, not optional.\n🎯 2. Hyper-personalization is driving conversions.\n🚀 3. Short-form visual content leads engagement.\n\nHow is ${brandName} adapting? Tap the link to read our full insight report.`,
      visualPrompt: `Futuristic technology trend graphic with abstract data streams and glowing cyan lighting, representing ${brandName}`,
      style: 'lifestyle_photo'
    }
  ];

  const posts = [];
  const times = ['08:30 AM', '09:45 AM', '11:15 AM', '01:30 PM', '04:00 PM', '06:45 PM', '08:00 PM'];

  for (let i = 1; i <= count; i++) {
    const t = templates[(i - 1) % templates.length];
    const time = times[(i - 1) % times.length];
    const mainPlatform = platforms[(i - 1) % platforms.length] || 'instagram';

    posts.push({
      dayNumber: i,
      contentPillar: t.pillar,
      title: `Day ${i}: ${t.title}`,
      primaryPlatform: mainPlatform,
      caption: `${t.hook}\n\n${t.body}`,
      hashtags: [`#${brandName.replace(/\s+/g, '')}`, `#${industry.replace(/[^a-zA-Z0-9]/g, '')}`, '#SmallBusiness', '#GrowthHacks', '#SocialPilotAI', '#ContentCreator'],
      platformVariations: {
        instagram: `✨ ${t.hook}\n\n${t.body}\n.\n.\n.#${brandName.replace(/\s+/g, '')} #${industry.replace(/[^a-zA-Z0-9]/g, '')} #InstaGrowth`,
        linkedin: `💡 ${t.title}\n\n${t.hook}\n\n${t.body}\n\nHow does your organization handle this? Let's connect and discuss in the comments below.\n\n#BusinessStrategy #Leadership #${industry.replace(/[^a-zA-Z0-9]/g, '')}`,
        twitter: `⚡ ${t.hook}\n\n${t.body.slice(0, 180)}...\n\nThread below 🧵 👇`,
        facebook: `📢 ${t.title}\n\n${t.hook}\n\n${t.body}\n\nLike & Share if you found this helpful!`
      },
      bestTime: time,
      visualPrompt: t.visualPrompt,
      visualStyle: t.style,
      engagementHook: t.hook
    });
  }

  return posts;
}

function generateCreativeImagePlaceholder(prompt: string, style: string) {
  // Return an SVG data URL with stylish aesthetic matching requested theme
  const title = prompt.slice(0, 35) + (prompt.length > 35 ? '...' : '');
  const colors = [
    ['#4f46e5', '#7c3aed', '#db2777'],
    ['#0284c7', '#2563eb', '#7c3aed'],
    ['#059669', '#0d9488', '#0284c7'],
    ['#d97706', '#dc2626', '#c026d3'],
    ['#1e293b', '#334155', '#475569']
  ];
  const c = colors[Math.floor(Math.random() * colors.length)];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c[0]}" />
        <stop offset="50%" stop-color="${c[1]}" />
        <stop offset="100%" stop-color="${c[2]}" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="800" height="800" fill="url(#grad)" />
    <circle cx="400" cy="300" r="180" fill="rgba(255,255,255,0.08)" />
    <rect x="100" y="100" width="600" height="600" rx="32" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(255,255,255,0.2)" stroke-width="2" filter="url(#shadow)" />
    <path d="M250 480 Q400 380 550 480 T800 480" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>
    <text x="400" y="320" font-family="sans-serif" font-weight="bold" font-size="28" fill="#ffffff" text-anchor="middle">SocialPilot AI Media</text>
    <rect x="250" y="380" width="300" height="40" rx="20" fill="rgba(255,255,255,0.15)" />
    <text x="400" y="406" font-family="sans-serif" font-weight="600" font-size="16" fill="#f8fafc" text-anchor="middle">${style.toUpperCase()} STYLE</text>
    <text x="400" y="520" font-family="sans-serif" font-size="20" fill="#cbd5e1" text-anchor="middle" width="500">${title}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Vite integration / Static serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, import Vite dynamically
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SocialPilot AI server running on http://localhost:${PORT}`);
});
