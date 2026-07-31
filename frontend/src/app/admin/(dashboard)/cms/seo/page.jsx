"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../../../api/axios';
import { Save, Search, Settings, Link, Share2, Hash, Layout, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import SingleImageUploader from '../../../../../features/admin/cms/components/SingleImageUploader';

const pageOptions = [
  { value: 'global', label: 'Global Defaults' },
  { value: 'home', label: 'Home Page' },
  { value: 'about', label: 'About Us' },
  { value: 'admissions', label: 'Admissions' },
  { value: 'programs_mba', label: 'Programs - MBA' },
  { value: 'programs_bba', label: 'Programs - BBA' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'contact', label: 'Contact Us' },
];

export default function ManageSeoPage() {
  const [selectedPage, setSelectedPage] = useState('global');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    favicon: '',
  });

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url instanceof File) return URL.createObjectURL(url);
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    
    // Construct absolute URL using API base
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const fetchSeoSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cms/seo/${selectedPage}`);
      setSeoData({
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        keywords: data.keywords || '',
        ogTitle: data.ogTitle || '',
        ogDescription: data.ogDescription || '',
        ogImage: data.ogImage || '',
        twitterCard: data.twitterCard || 'summary_large_image',
        twitterTitle: data.twitterTitle || '',
        twitterDescription: data.twitterDescription || '',
        favicon: data.favicon || '',
      });
    } catch (error) {
      console.error('Failed to fetch SEO settings', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch SEO settings for this page.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, [selectedPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeoData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(seoData).forEach(key => {
        if (key !== 'ogImage' && key !== 'favicon') formData.append(key, seoData[key]);
      });

      if (seoData.ogImage instanceof File) {
        formData.append('ogImage', seoData.ogImage);
      } else if (seoData.ogImage) {
        formData.append('ogImage', seoData.ogImage);
      }

      if (seoData.favicon instanceof File) {
        formData.append('favicon', seoData.favicon);
      } else if (seoData.favicon) {
        formData.append('favicon', seoData.favicon);
      }

      const { data } = await api.put(`/cms/seo/${selectedPage}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSeoData(prev => ({ ...prev, ogImage: data.ogImage }));

      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully',
        text: 'The SEO settings have been updated.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Failed to save SEO settings', error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'An error occurred while saving the SEO settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#566A7F] flex items-center gap-3">
              <Search className="w-7 h-7 text-primary" />
              SEO Management
            </h1>
            <p className="text-[#697A8D] mt-1 text-sm">
              Configure meta tags, Open Graph data, and Twitter cards to improve search rankings.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Settings
          </button>
        </div>
      </div>

      {/* Page Selector */}
      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="shrink-0 p-3 bg-primary/10 text-primary rounded-lg">
          <Layout className="w-6 h-6" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-[#566A7F] mb-1">Select Page to Edit</label>
          <select 
            value={selectedPage} 
            onChange={(e) => setSelectedPage(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm text-[#566A7F] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {pageOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          
          {/* General Meta Tags */}
          <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6">
            <h3 className="text-lg font-bold text-[#566A7F] flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
              <Search className="w-5 h-5 text-[#697A8D]" />
              General Meta Tags
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Meta Title</label>
                <input 
                  type="text" 
                  name="metaTitle"
                  value={seoData.metaTitle}
                  onChange={handleChange}
                  placeholder="e.g., Best Management School in Kerala | KSBM"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-400 mt-1">Recommended length: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Meta Description</label>
                <textarea 
                  name="metaDescription"
                  value={seoData.metaDescription}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., KMCT School of Business Management offers premier MBA and BBA programs..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">Recommended length: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Keywords</label>
                <input 
                  type="text" 
                  name="keywords"
                  value={seoData.keywords}
                  onChange={handleChange}
                  placeholder="e.g., MBA in Kerala, Top B-School, Business Management"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-400 mt-1">Comma-separated list of keywords</p>
              </div>

              {selectedPage === 'global' && (
                <div>
                  <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Favicon (Website Icon)</label>
                  <div className="max-w-xs">
                    <SingleImageUploader 
                      label="Upload Favicon"
                      imageUrl={getImageUrl(seoData.favicon)}
                      onUploadComplete={(data) => setSeoData(prev => ({ ...prev, favicon: data.file }))}
                      deferredUpload={true}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Recommended size: 32x32 or 64x64 pixels (.png, .ico)</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Graph (Facebook/LinkedIn) */}
            <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6">
              <h3 className="text-lg font-bold text-[#566A7F] flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                <Share2 className="w-5 h-5 text-blue-600" />
                Open Graph (Facebook/LinkedIn)
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">OG Title</label>
                  <input 
                    type="text" 
                    name="ogTitle"
                    value={seoData.ogTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">OG Description</label>
                  <textarea 
                    name="ogDescription"
                    value={seoData.ogDescription}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">OG Image</label>
                  <SingleImageUploader 
                    label=""
                    imageUrl={getImageUrl(seoData.ogImage)}
                    onUploadComplete={(data) => setSeoData(prev => ({ ...prev, ogImage: data.file }))}
                    deferredUpload={true}
                  />
                  <p className="text-xs text-gray-400 mt-2">Recommended size: 1200 x 630 pixels</p>
                </div>
              </div>
            </div>

            {/* Twitter Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6">
              <h3 className="text-lg font-bold text-[#566A7F] flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                <Hash className="w-5 h-5 text-sky-400" />
                Twitter Card
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Card Type</label>
                  <select 
                    name="twitterCard"
                    value={seoData.twitterCard}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="summary">Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Twitter Title</label>
                  <input 
                    type="text" 
                    name="twitterTitle"
                    value={seoData.twitterTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#566A7F] mb-1.5">Twitter Description</label>
                  <textarea 
                    name="twitterDescription"
                    value={seoData.twitterDescription}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
