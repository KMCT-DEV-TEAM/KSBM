"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
const logo = '/assets/Images/Header/LOGO__KMCT School of Business Management (1).png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/users/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">

      {/* Left Side - Branding Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
        <img
          src="/assets/Images/aboutus/about-hero-bg.jpg"
          alt="KSBM Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1238] via-[#1e2869]/60 to-transparent"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary-light/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-end p-16 h-full">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">KSBM Admin Portal</h1>
            <p className="text-gray-200 text-base leading-relaxed max-w-md">
              Manage your institution's digital presence, academic programs, facilities, and student activities from one centralized dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-gray-50/50">
        <div className="w-full max-w-[420px] bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">

          {/* Top border accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

          {/* KSBM Logo */}
          <div className="flex justify-center mb-10">
            <img src={logo} alt="KSBM Logo" className="h-16 sm:h-24 object-contain" />
          </div>

          <div className="mb-8 text-center">
            <h3 className="text-2xl font-semibold text-primary mb-2">Welcome Back! 👋</h3>
            <p className="text-gray-500 text-sm">Please sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all placeholder-gray-400"
                  placeholder="admin@ksbm.ac.in"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#0b1238] transition-all shadow-[0_4px_14px_0_rgba(30,40,105,0.39)] hover:shadow-[0_6px_20px_rgba(30,40,105,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

