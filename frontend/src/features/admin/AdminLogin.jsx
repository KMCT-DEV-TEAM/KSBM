"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
const logo = '/assets/Images/LOGO__KMCT School of Business Management (1).png';

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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F9] p-4 font-sans">
      <div className="w-full max-w-[400px] bg-white rounded-[0.5rem] shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-8 sm:p-10 border border-gray-100">
        
        {/* KSBM Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="KSBM Logo" className="h-12 object-contain" />
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#566A7F] mb-1">Welcome to KSBM! 👋</h3>
          <p className="text-[#697A8D] text-sm">Please sign in to your account and start the adventure</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#FF3E1D]/10 border border-[#FF3E1D]/20 rounded-md flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-[#FF3E1D] shrink-0" />
            <p className="text-sm text-[#FF3E1D] font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-[#697A8D]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="admin@ksbm.ac.in"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Password</label>
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary/90">Forgot Password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-[#697A8D]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Remember Me Toggle Mock */}
          <div className="flex items-center mt-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="ml-2 text-sm text-[#697A8D]">Remember me</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2.5 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_2px_4px_0_var(--color-primary)] disabled:opacity-70 mt-4 flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign in'
            )}
          </button>
          
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;

