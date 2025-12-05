import React, { useState } from 'react';
import { LogIn, Lock, Mail, Eye, EyeOff, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading = false }) => {
  const [email, setEmail] = useState('admin@semenkita.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/50 mr-3">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">SEMENKITA</h1>
              <p className="text-xs font-bold text-cyan-500 tracking-widest">LOGISTICS PLATFORM</p>
            </div>
          </div>

          {/* Form Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-400">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg">
              <p className="text-sm text-rose-400 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo Credentials Note */}
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-xs text-cyan-400">
                <span className="font-bold">Demo:</span> Use any email with password "password123" or click login directly
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin">⚙️</div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-500">
              SEMENKITA © 2024. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
