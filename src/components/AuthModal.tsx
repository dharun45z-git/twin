import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-white">
            {isLogin ? 'Welcome Back to SocialPilot AI' : 'Create Your SocialPilot AI Account'}
          </h2>
          <p className="text-xs text-slate-400">
            Manage your brand content calendar, generate 30 days of posts, and access AI visual studio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>{isLogin ? 'Sign In to Workspace' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {isLogin ? "Don't have an account? Sign up free" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
