import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { NavTab, Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { GeneratorWizard } from './components/GeneratorWizard';
import { PostEditorModal } from './components/PostEditorModal';
import { MediaStudioView } from './components/MediaStudioView';
import { AnalyticsView } from './components/AnalyticsView';
import { PricingView } from './components/PricingView';
import { BrandSettingsView } from './components/BrandSettingsView';
import { AuthModal } from './components/AuthModal';
import { INITIAL_BRANDS, INITIAL_POSTS, INITIAL_USER } from './data/initialData';
import { BrandProfile, PostItem, UserProfile } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [brands, setBrands] = useState<BrandProfile[]>(INITIAL_BRANDS);
  const [activeBrand, setActiveBrand] = useState<BrandProfile>(INITIAL_BRANDS[0]);
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPostForEdit, setSelectedPostForEdit] = useState<PostItem | null>(null);

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  const handleSavePost = (updatedPost: PostItem) => {
    const exists = posts.some((p) => p.id === updatedPost.id);
    if (exists) {
      setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    } else {
      setPosts([updatedPost, ...posts]);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
    setSelectedPostForEdit(null);
  };

  const handleGeneratorComplete = (newPosts: PostItem[]) => {
    setPosts([...newPosts, ...posts]);
    setUser((prev) => ({
      ...prev,
      aiCredits: Math.max(0, prev.aiCredits - 30)
    }));
    setActiveTab('calendar');
  };

  const handleCreateNewPostOnDate = (dateStr: string, dayNum: number) => {
    const newDraft: PostItem = {
      id: `post_new_${Date.now()}`,
      dayNumber: dayNum,
      scheduledDate: dateStr,
      bestTime: '10:00 AM',
      contentPillar: 'Educational / Tips',
      title: `Day ${dayNum}: New ${activeBrand.name} Concept`,
      primaryPlatform: activeBrand.targetPlatforms?.[0] || 'instagram',
      contentType: 'image',
      tags: ['draft'],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      viralityScore: 88,
      caption: `Exciting updates from ${activeBrand.name}! Share your thoughts below. 👇`,
      hashtags: ['#SmallBusiness', `#${activeBrand.name.replace(/\s+/g, '')}`],
      platformVariations: {},
      visualPrompt: `Aesthetic product photo for ${activeBrand.name}`,
      visualStyle: 'lifestyle_photo',
      status: 'draft'
    };

    setSelectedPostForEdit(newDraft);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <Navbar
        user={user}
        activeBrand={activeBrand}
        brands={brands}
        onSelectBrand={(b) => setActiveBrand(b)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenPricing={() => setActiveTab('pricing')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'generator') {
              setIsGeneratorOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          brand={activeBrand}
          scheduledCount={scheduledCount}
        />

        {/* Main Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              brand={activeBrand}
              posts={posts}
              onOpenGenerator={() => setIsGeneratorOpen(true)}
              onOpenCalendar={() => setActiveTab('calendar')}
              onOpenMediaStudio={() => setActiveTab('media')}
              onEditPost={(p) => setSelectedPostForEdit(p)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              posts={posts}
              onSelectPost={(p) => setSelectedPostForEdit(p)}
              onCreateNewPostOnDate={handleCreateNewPostOnDate}
            />
          )}

          {activeTab === 'media' && <MediaStudioView brand={activeBrand} />}

          {activeTab === 'analytics' && <AnalyticsView posts={posts} />}

          {activeTab === 'pricing' && (
            <PricingView
              onSuccessUpgrade={() => {
                setUser((prev) => ({ ...prev, aiCredits: prev.maxCredits }));
              }}
            />
          )}

          {activeTab === 'settings' && (
            <BrandSettingsView
              brand={activeBrand}
              onUpdateBrand={(updated) => {
                setActiveBrand(updated);
                setBrands(brands.map((b) => (b.id === updated.id ? updated : b)));
              }}
            />
          )}
        </main>
      </div>

      {/* 30-Day Campaign Generator Wizard */}
      <GeneratorWizard
        brand={activeBrand}
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onComplete={handleGeneratorComplete}
        userCredits={user.aiCredits}
      />

      {/* Post Editor & AI Quality Audit Modal */}
      {selectedPostForEdit && (
        <PostEditorModal
          post={selectedPostForEdit}
          isOpen={!!selectedPostForEdit}
          onClose={() => setSelectedPostForEdit(null)}
          onSave={handleSavePost}
          onDelete={handleDeletePost}
          brandName={activeBrand.name}
          brandTone={activeBrand.tone}
        />
      )}

      {/* Auth & Account Dialog */}
      <AuthModal
        user={user}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUpdateUser={(updated) => setUser(updated)}
      />
    </div>
  );
}

export default App;
