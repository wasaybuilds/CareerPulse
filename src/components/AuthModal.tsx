import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setName('Wasay');
    setEmail('wasay@careerpulse.dev');
    setPassword('PulsePass2026!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                {isRegisterMode ? 'Create CareerPulse Account' : 'Sign in to CareerPulse'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Keep your job applications & JDs private</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setErrorMessage('');
            }}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold transition border-b-2 ${
              !isRegisterMode
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold transition border-b-2 ${
              isRegisterMode
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs animate-shake">
              {errorMessage}
            </div>
          )}

          {isRegisterMode && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Wasay Builds"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition active:scale-[0.98] mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : isRegisterMode ? 'Create Private Account' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Fill Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Quick Test Credentials:</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Demo User</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
