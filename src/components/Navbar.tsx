import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Building2,
  ChevronDown,
  Plus,
  CreditCard,
  User,
  LogOut,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { BrandProfile, UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  activeBrand: BrandProfile;
  brands: BrandProfile[];
  onSelectBrand: (brand: BrandProfile) => void;
  onOpenGenerator: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeBrand,
  brands,
  onSelectBrand,
  onOpenGenerator,
  onOpenPricing,
  onOpenAuth
}) => {
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const percentCredits = Math.round((user.aiCredits / user.maxCredits) * 100);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between">
      {/* Brand Workspace Switcher & App Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rx-xl rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent hidden sm:inline-block">
            SocialPilot<span className="text-indigo-400">.AI</span>
          </span>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Brand Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBrandMenu(!showBrandMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-sm font-medium text-slate-200 transition-all"
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span className="max-w-[120px] sm:max-w-[180px] truncate">{activeBrand.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showBrandMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Workspaces ({brands.length})
              </div>
              <div className="space-y-1 my-1">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      onSelectBrand(brand);
                      setShowBrandMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      brand.id === activeBrand.id
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-semibold">{brand.name}</div>
                      <div className="text-xs text-slate-400 truncate">{brand.industry}</div>
                    </div>
                    {brand.id === activeBrand.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions: AI Credit Meter, Quick Generator Button, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Credits Badge */}
        <button
          onClick={onOpenPricing}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 text-xs font-semibold text-indigo-200 transition-all group"
          title="Click to refill or upgrade credits"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform fill-amber-400" />
          <span>
            <strong className="text-white">{user.aiCredits}</strong> / {user.maxCredits} AI Credits
          </span>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-500"
              style={{ width: `${percentCredits}%` }}
            />
          </div>
        </button>

        {/* Quick Generate 30-Day Campaign Button */}
        <button
          onClick={onOpenGenerator}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Generate 30 Days</span>
          <span className="sm:hidden">Generate</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-3">
                <span className="font-heading font-bold text-sm text-white">Notifications</span>
                <span className="text-xs text-indigo-400 font-medium">Mark all read</span>
              </div>
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs">
                  <div className="font-semibold text-slate-200">🚀 30-Day Content Batch Ready</div>
                  <div className="text-slate-400 mt-0.5">30 posts successfully generated and mapped to your calendar.</div>
                  <div className="text-[10px] text-slate-500 mt-1">2 mins ago</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs">
                  <div className="font-semibold text-slate-200">✨ AI Image Studio</div>
                  <div className="text-slate-400 mt-0.5">Gemini-3.1 model generated 5 high-res lifestyle social graphics.</div>
                  <div className="text-[10px] text-slate-500 mt-1">1 hour ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-700 mb-1">
                <div className="font-semibold text-sm text-slate-100">{user.name}</div>
                <div className="text-xs text-slate-400 truncate">{user.email}</div>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  {user.plan} Plan
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenPricing();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-indigo-400" />
                Subscription & Credits
              </button>

              <button
                onClick={() => {
                  onOpenAuth();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-400" />
                Account Settings & Team
              </button>

              <button
                onClick={() => {
                  onOpenAuth();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2 mt-1 border-t border-slate-700/60 pt-2"
              >
                <LogOut className="w-4 h-4" />
                Switch Account / Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
