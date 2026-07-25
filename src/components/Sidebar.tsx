import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  BarChart3,
  CreditCard,
  Settings,
  Zap,
  Building2,
  ChevronRight
} from 'lucide-react';
import { BrandProfile } from '../types';

export type NavTab =
  | 'dashboard'
  | 'generator'
  | 'calendar'
  | 'media'
  | 'analytics'
  | 'pricing'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  brand: BrandProfile;
  scheduledCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  brand,
  scheduledCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'generator' as NavTab,
      label: '30-Day AI Generator',
      icon: Sparkles,
      badge: 'AI'
    },
    {
      id: 'calendar' as NavTab,
      label: 'Content Calendar',
      icon: Calendar,
      count: scheduledCount
    },
    {
      id: 'media' as NavTab,
      label: 'AI Image Studio',
      icon: ImageIcon,
    },
    {
      id: 'analytics' as NavTab,
      label: 'Analytics & Insights',
      icon: BarChart3,
    },
    {
      id: 'pricing' as NavTab,
      label: 'Subscriptions & Credits',
      icon: CreditCard,
    },
    {
      id: 'settings' as NavTab,
      label: 'Brand Setup & Voice',
      icon: Settings,
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/95 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] p-3">
      {/* Top Navigation Links */}
      <div className="space-y-6">
        {/* Brand Card Quick Summary */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Building2 className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-100 truncate">{brand.name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{brand.industry}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo / Help Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-800 to-violet-950/80 border border-indigo-500/20 text-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-heading font-bold text-xs text-white">Need More Posts?</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
          Scale your brand with 250 AI credits per month and custom voice tuning.
        </p>
        <button
          onClick={() => onSelectTab('pricing')}
          className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-sm"
        >
          <span>Upgrade Plan</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
