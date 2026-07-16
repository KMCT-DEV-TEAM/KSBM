"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2, Users, Briefcase } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageFaculty = () => {
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  
  const [introSubheading, setIntroSubheading] = useState('');
  const [introHeading, setIntroHeading] = useState('');
  const [introText, setIntroText] = useState('');
  
  const [ksbmFaculty, setKsbmFaculty] = useState([]);
  const [adjunctFaculty, setAdjunctFaculty] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/faculty');
      if (data) {
        if (data.heroHeading) setHeroHeading(data.heroHeading);
        if (data.heroSubtext) setHeroSubtext(data.heroSubtext);
        if (data.heroBgImage) setHeroBgImage(data.heroBgImage);
        
        if (data.introSubheading) setIntroSubheading(data.introSubheading);
        if (data.introHeading) setIntroHeading(data.introHeading);
        if (data.introText) setIntroText(data.introText);
        
        if (data.ksbmFaculty && data.ksbmFaculty.length > 0) setKsbmFaculty(data.ksbmFaculty);
        if (data.adjunctFaculty && data.adjunctFaculty.length > 0) setAdjunctFaculty(data.adjunctFaculty);
      }
    } catch (error) {
      console.error('Error fetching Faculty settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Faculty Settings?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save changes!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/faculty', { 
            heroHeading, heroSubtext, heroBgImage,
            introSubheading, introHeading, introText,
            ksbmFaculty, adjunctFaculty 
          }, { hideLoader: true });
          Toast.fire({ icon: 'success', title: 'Faculty settings saved successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all input fields to default values. Click "Save Changes" to apply.',
      confirmText: 'Yes, reset!',
      variant: 'primary',
      action: async () => {
        setHeroHeading('Faculty Members');
        setHeroSubtext('Our distinguished faculty are committed to delivering quality education through innovative teaching, practical learning, and personalized mentorship, helping students build the skills and confidence needed for successful careers.');
        setHeroBgImage('/assets/Images/image 2.png');
        
        setIntroSubheading('FACULTY MEMBERS');
        setIntroHeading('Learn from the Best');
        setIntroText('At KSBM, our faculty members are the cornerstone of academic excellence. With a blend of strong academic credentials, industry expertise, and a passion for teaching, they create a dynamic learning environment that encourages critical thinking, innovation, and leadership. Beyond the classroom, our faculty mentor, inspire, and guide students through every stage of their academic journey, equipping them with the knowledge, confidence, and practical skills needed to succeed in an ever-evolving global business landscape.');
        
        Toast.fire({ icon: 'info', title: 'Reset to defaults. Click Save Changes to apply.' });
      }
    });
  };

  // KSBM Faculty helpers
  const handleAddKsbmMember = () => {
    setKsbmFaculty([...ksbmFaculty, { name: '', title: '', image: '/assets/Images/image 31.png', order: ksbmFaculty.length + 1 }]);
  };

  const handleUpdateKsbmMember = (index, field, value) => {
    const updated = [...ksbmFaculty];
    updated[index][field] = value;
    setKsbmFaculty(updated);
  };

  const handleDeleteKsbmMember = async (index) => {
    await confirmAction({
      title: 'Remove Member?',
      message: 'Are you sure you want to remove this faculty member?',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: async () => {
        const updated = ksbmFaculty.filter((_, i) => i !== index);
        setKsbmFaculty(updated);
        Toast.fire({ icon: 'success', title: 'Member removed from list.' });
      }
    });
  };

  // Adjunct Faculty helpers
  const handleAddAdjunctMember = () => {
    setAdjunctFaculty([...adjunctFaculty, { name: '', title: '', image: '/assets/Images/image 31.png', order: adjunctFaculty.length + 1 }]);
  };

  const handleUpdateAdjunctMember = (index, field, value) => {
    const updated = [...adjunctFaculty];
    updated[index][field] = value;
    setAdjunctFaculty(updated);
  };

  const handleDeleteAdjunctMember = async (index) => {
    await confirmAction({
      title: 'Remove Member?',
      message: 'Are you sure you want to remove this adjunct member?',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: async () => {
        const updated = adjunctFaculty.filter((_, i) => i !== index);
        setAdjunctFaculty(updated);
        Toast.fire({ icon: 'success', title: 'Adjunct member removed from list.' });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader theme="dark" text="Loading Faculty settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2869]">Manage Faculty & People Page</h1>
          <p className="text-sm text-gray-500 mt-1">Configure the hero banner, intro section, KSBM full-time faculty, and adjunct faculty lists.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefault}
            disabled={isSaving || isUploading}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Hero Banner Settings */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#1e2869] mb-4 border-b pb-3">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hero Heading</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hero Description</label>
                <textarea
                  rows="4"
                  value={heroSubtext}
                  onChange={(e) => setHeroSubtext(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hero Background Image</label>
              <SingleImageUploader
                imageUrl={heroBgImage}
                onUploadComplete={(url) => setHeroBgImage(url)}
                onUploadStateChange={setIsUploading}
                label="Upload Hero Background"
              />
            </div>
          </div>
        </div>

        {/* Intro Section Settings */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#1e2869] mb-4 border-b pb-3">Learn from the Best (Intro Section)</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Intro Subheading Tag</label>
                <input
                  type="text"
                  value={introSubheading}
                  onChange={(e) => setIntroSubheading(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Intro Heading</label>
                <input
                  type="text"
                  value={introHeading}
                  onChange={(e) => setIntroHeading(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Intro Paragraph Text</label>
              <textarea
                rows="4"
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* KSBM Faculty Section */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-[#1e2869]">KSBM Full-Time Faculty ({ksbmFaculty.length})</h2>
            </div>
            <button
              onClick={handleAddKsbmMember}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ksbmFaculty.map((member, idx) => (
              <div key={idx} className="p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-4 relative">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
                  <span className="text-xs font-bold uppercase text-gray-500">Member #{idx + 1}</span>
                  <button
                    onClick={() => handleDeleteKsbmMember(idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleUpdateKsbmMember(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g. Aleena Joseph"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title / Designation</label>
                    <input
                      type="text"
                      value={member.title}
                      onChange={(e) => handleUpdateKsbmMember(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g. Assistant Professor in Business Management"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Portrait Image</label>
                    <SingleImageUploader
                      imageUrl={member.image}
                      onUploadComplete={(url) => handleUpdateKsbmMember(idx, 'image', url)}
                      onUploadStateChange={setIsUploading}
                      label="Upload Portrait"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adjunct Faculty Section */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-[#1e2869]">Adjunct Faculty ({adjunctFaculty.length})</h2>
            </div>
            <button
              onClick={handleAddAdjunctMember}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-[#151c48] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Adjunct Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adjunctFaculty.map((member, idx) => (
              <div key={idx} className="p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-4 relative">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
                  <span className="text-xs font-bold uppercase text-gray-500">Adjunct Member #{idx + 1}</span>
                  <button
                    onClick={() => handleDeleteAdjunctMember(idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove adjunct member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleUpdateAdjunctMember(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g. Aleena Joseph"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title / Designation</label>
                    <input
                      type="text"
                      value={member.title}
                      onChange={(e) => handleUpdateAdjunctMember(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g. Adjunct Professor in Business Management"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Portrait Image</label>
                    <SingleImageUploader
                      imageUrl={member.image}
                      onUploadComplete={(url) => handleUpdateAdjunctMember(idx, 'image', url)}
                      onUploadStateChange={setIsUploading}
                      label="Upload Portrait"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFaculty;
