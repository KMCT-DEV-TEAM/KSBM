"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2, Eye, Monitor, Smartphone, Tablet, X, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

// Import frontend components for live preview inside modal
import ManagementDeskHero from '../../about/components/management-desk/ManagementDeskHero';
import ManagementDeskIntro from '../../about/components/management-desk/ManagementDeskIntro';
import ManagementDeskMembers from '../../about/components/management-desk/ManagementDeskMembers';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageManagementDesk = () => {
  const [showHero, setShowHero] = useState(true);
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  
  const [showIntro, setShowIntro] = useState(true);
  const [introSubheading, setIntroSubheading] = useState('');
  const [introHeading, setIntroHeading] = useState('');
  const [introDescription, setIntroDescription] = useState([]);
  
  const [showMembers, setShowMembers] = useState(true);
  const [members, setMembers] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Live Preview state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/management-desk');
      if (data) {
        if (data.showHero !== undefined) setShowHero(data.showHero);
        if (data.heroHeading) setHeroHeading(data.heroHeading);
        if (data.heroSubtext) setHeroSubtext(data.heroSubtext);
        if (data.heroBgImage) setHeroBgImage(data.heroBgImage);
        
        if (data.showIntro !== undefined) setShowIntro(data.showIntro);
        if (data.introSubheading) setIntroSubheading(data.introSubheading);
        if (data.introHeading) setIntroHeading(data.introHeading);
        if (data.introDescription) setIntroDescription(data.introDescription);
        
        if (data.showMembers !== undefined) setShowMembers(data.showMembers);
        if (data.members && data.members.length > 0) setMembers(data.members);
      }
    } catch (error) {
      console.error('Error fetching Management Desk settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these Management Desk changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/management-desk', { 
            showHero, heroHeading, heroSubtext, heroBgImage,
            showIntro, introSubheading, introHeading, introDescription,
            showMembers, members 
          }, { hideLoader: true });
          Toast.fire({ icon: 'success', title: 'Management Desk saved successfully!' });
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
      message: 'This will reset all Management Desk settings to their original state. You still need to click "Save Changes" to apply.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setShowHero(true);
        setHeroHeading('Management Desk');
        setHeroSubtext("Our leaders stand at the forefront of delivering dynamic management education through innovative teaching, practical learning and personalized mentorship to shape today's students into tomorrow's successful business leaders.");
        setHeroBgImage('/assets/Images/image 2.png');
        
        setShowIntro(true);
        setIntroSubheading('MANAGEMENT DESK');
        setIntroHeading('A Vision That Inspires Excellence');
        setIntroDescription([
          "The Management Desk at KSBM sets the vision, strategy, and direction for the institution, guiding future leaders and administrators with a firm commitment to high academic and professional standards. Our dedicated management board brings invaluable experience across top industries, governing and mentoring students with confidence. Through strategic guidance and a student-centric approach, they ensure that every learner receives the opportunities, support, and mentorship needed to excel in both academic and professional life."
        ]);
        
        setShowMembers(true);
        setMembers([
          {
            id: '1',
            name: 'Dr. Navas K. M',
            badgeRole: 'Chairman',
            tag: 'MESSAGE FROM OUR CHAIRMAN',
            title: 'Leadership Vision',
            image: '/assets/Images/Group 164.png',
            thumbnail: '/assets/Images/image 32.png',
            description: [
              "The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge — they reveal the defining nature of KSBM.",
              "We believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and at KSBM, this is our overarching commitment to shaping a transformative future.",
              "As KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."
            ]
          },
          {
            id: '2',
            name: 'Dr. Ayisha Nazreen',
            badgeRole: 'Vice Chairman',
            tag: 'MESSAGE FROM OUR VICE CHAIRMAN',
            title: 'Leadership Vision',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
            description: [
              "The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds.",
              "We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.",
              "KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."
            ]
          },
          {
            id: '3',
            name: 'Dr. James Starlin',
            badgeRole: 'Executive Director',
            tag: 'MESSAGE FROM OUR DIRECTOR',
            title: 'Leadership Vision',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
            description: [
              "In an era defined by rapid technological shifts and global transformation, management education must remain adaptive and innovative. At KSBM, we prepare our graduates to not only respond to industry evolution but to actively drive change and foster sustainable enterprises.",
              "Our commitment to academic excellence and industrial synergy empowers students with deep analytical rigor, strategic foresight, and hands-on leadership capabilities. We invite ambitious minds to embark on this transformative journey with us."
            ]
          }
        ]);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };
  const addMember = () => setMembers([...members, { id: Date.now().toString(), name: '', badgeRole: '', tag: 'MESSAGE FROM LEADER', title: 'Leadership Vision', image: '', thumbnail: '', description: [''] }]);
  const removeMember = (index) => setMembers(members.filter((_, i) => i !== index));

  // Reorder Leaders
  const moveMemberUp = (index) => {
    if (index === 0) return;
    const newMembers = [...members];
    const temp = newMembers[index - 1];
    newMembers[index - 1] = newMembers[index];
    newMembers[index] = temp;
    setMembers(newMembers);
  };
  const moveMemberDown = (index) => {
    if (index === members.length - 1) return;
    const newMembers = [...members];
    const temp = newMembers[index + 1];
    newMembers[index + 1] = newMembers[index];
    newMembers[index] = temp;
    setMembers(newMembers);
  };

  const updateMemberDescription = (mIndex, pIndex, value) => {
    const newMembers = [...members];
    const newDesc = Array.isArray(newMembers[mIndex].description) ? [...newMembers[mIndex].description] : [];
    newDesc[pIndex] = value;
    newMembers[mIndex].description = newDesc;
    setMembers(newMembers);
  };
  const addMemberDescriptionPara = (mIndex) => {
    const newMembers = [...members];
    const newDesc = Array.isArray(newMembers[mIndex].description) ? [...newMembers[mIndex].description, ''] : [''];
    newMembers[mIndex].description = newDesc;
    setMembers(newMembers);
  };
  const removeMemberDescriptionPara = (mIndex, pIndex) => {
    const newMembers = [...members];
    const newDesc = (newMembers[mIndex].description || []).filter((_, i) => i !== pIndex);
    newMembers[mIndex].description = newDesc;
    setMembers(newMembers);
  };
  const moveMemberParaUp = (mIndex, pIndex) => {
    if (pIndex === 0) return;
    const newMembers = [...members];
    const newDesc = [...(newMembers[mIndex].description || [])];
    const temp = newDesc[pIndex - 1];
    newDesc[pIndex - 1] = newDesc[pIndex];
    newDesc[pIndex] = temp;
    newMembers[mIndex].description = newDesc;
    setMembers(newMembers);
  };
  const moveMemberParaDown = (mIndex, pIndex) => {
    const desc = members[mIndex].description || [];
    if (pIndex === desc.length - 1) return;
    const newMembers = [...members];
    const newDesc = [...desc];
    const temp = newDesc[pIndex + 1];
    newDesc[pIndex + 1] = newDesc[pIndex];
    newDesc[pIndex] = temp;
    newMembers[mIndex].description = newDesc;
    setMembers(newMembers);
  };

  const updateIntroDescription = (index, value) => {
    const newDesc = [...introDescription];
    newDesc[index] = value;
    setIntroDescription(newDesc);
  };
  const addIntroDescriptionPara = () => setIntroDescription([...introDescription, '']);
  const removeIntroDescriptionPara = (index) => setIntroDescription(introDescription.filter((_, i) => i !== index));
  const moveIntroParaUp = (index) => {
    if (index === 0) return;
    const newDesc = [...introDescription];
    const temp = newDesc[index - 1];
    newDesc[index - 1] = newDesc[index];
    newDesc[index] = temp;
    setIntroDescription(newDesc);
  };
  const moveIntroParaDown = (index) => {
    if (index === introDescription.length - 1) return;
    const newDesc = [...introDescription];
    const temp = newDesc[index + 1];
    newDesc[index + 1] = newDesc[index];
    newDesc[index] = temp;
    setIntroDescription(newDesc);
  };

  if (isLoading) return <AdminSkeleton />;

  // Prepare current preview data object
  const previewData = {
    showHero, heroHeading, heroSubtext, heroBgImage,
    showIntro, introSubheading, introHeading, introDescription,
    showMembers, members
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Management Desk Section"
        description="Manage the Management Desk hero, introduction, leadership profiles, order, and visibility."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full space-y-12">
        
        {/* Hero & Intro Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-12 border-gray-200">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-[#1e2869]">Hero Section</h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#566A7F]">
                <span>Show</span>
                <input
                  type="checkbox"
                  checked={showHero}
                  onChange={(e) => setShowHero(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Hero Heading</label>
              <input type="text" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Hero Subtext</label>
              <textarea value={heroSubtext} onChange={(e) => setHeroSubtext(e.target.value)} rows={4} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Hero Background Image</label>
              <SingleImageUploader 
                imageUrl={heroBgImage} 
                onUploadComplete={setHeroBgImage}
                onUploadStateChange={setIsUploading}
                label="Upload Hero Bg"
              />
            </div>
          </div>

          {/* Intro Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-[#1e2869]">Intro Section</h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#566A7F]">
                <span>Show</span>
                <input
                  type="checkbox"
                  checked={showIntro}
                  onChange={(e) => setShowIntro(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Intro Subheading (Tag)</label>
              <input type="text" value={introSubheading} onChange={(e) => setIntroSubheading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Intro Heading</label>
              <input type="text" value={introHeading} onChange={(e) => setIntroHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Intro Paragraphs</label>
                <button onClick={addIntroDescriptionPara} className="text-primary hover:bg-primary/10 p-1 rounded-full"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {introDescription.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex flex-col gap-0.5 mt-1">
                      <button onClick={() => moveIntroParaUp(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move Up"><ArrowUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => moveIntroParaDown(index)} disabled={index === introDescription.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move Down"><ArrowDown className="w-3.5 h-3.5" /></button>
                    </div>
                    <textarea 
                      value={para}
                      onChange={(e) => updateIntroDescription(index, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button onClick={() => removeIntroDescriptionPara(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div>
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1e2869]">Leadership Profiles (Alternating Zig-Zag)</h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#566A7F]">
                <span>Show Profiles</span>
                <input
                  type="checkbox"
                  checked={showMembers}
                  onChange={(e) => setShowMembers(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
              </label>
            </div>
            <button onClick={addMember} className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-colors font-semibold">
              <Plus className="w-4 h-4" /> Add Leader
            </button>
          </div>
          <div className="space-y-8">
            {members.map((member, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative shadow-sm">
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  <button onClick={() => moveMemberUp(index)} disabled={index === 0} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md disabled:opacity-30" title="Move Leader Up"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveMemberDown(index)} disabled={index === members.length - 1} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md disabled:opacity-30" title="Move Leader Down"><ArrowDown className="w-4 h-4" /></button>
                  <button onClick={() => removeMember(index)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md ml-2" title="Remove Leader"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-24">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Leader Name</label>
                      <input type="text" value={member.name} onChange={(e) => updateMember(index, 'name', e.target.value)} placeholder="e.g. Dr. Navas K. M" className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Floating Badge Role</label>
                      <input type="text" value={member.badgeRole} onChange={(e) => updateMember(index, 'badgeRole', e.target.value)} placeholder="e.g. Chairman" className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Message Tag</label>
                      <input type="text" value={member.tag} onChange={(e) => updateMember(index, 'tag', e.target.value)} placeholder="e.g. MESSAGE FROM OUR CHAIRMAN" className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Message Title</label>
                      <input type="text" value={member.title} onChange={(e) => updateMember(index, 'title', e.target.value)} placeholder="e.g. Leadership Vision" className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-2">Main Portrait Photo</label>
                        <SingleImageUploader 
                          imageUrl={member.image} 
                          onUploadComplete={(url) => updateMember(index, 'image', url)}
                          onUploadStateChange={setIsUploading}
                          label="Upload Main Portrait"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-2">Thumbnail (Floating Badge)</label>
                        <SingleImageUploader 
                          imageUrl={member.thumbnail} 
                          onUploadComplete={(url) => updateMember(index, 'thumbnail', url)}
                          onUploadStateChange={setIsUploading}
                          label="Upload Thumbnail"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right side: Paragraphs */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Message Paragraphs</label>
                      <button onClick={() => addMemberDescriptionPara(index)} className="text-primary hover:bg-primary/10 p-1 rounded-full text-xs font-semibold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Paragraph</button>
                    </div>
                    <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                      {(member.description || []).map((para, pIndex) => (
                        <div key={pIndex} className="flex gap-2 items-start">
                          <div className="flex flex-col gap-0.5 mt-1">
                            <button onClick={() => moveMemberParaUp(index, pIndex)} disabled={pIndex === 0} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move Para Up"><ArrowUp className="w-3 h-3" /></button>
                            <button onClick={() => moveMemberParaDown(index, pIndex)} disabled={pIndex === (member.description || []).length - 1} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move Para Down"><ArrowDown className="w-3 h-3" /></button>
                          </div>
                          <textarea 
                            value={para}
                            onChange={(e) => updateMemberDescription(index, pIndex, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                          <button onClick={() => removeMemberDescriptionPara(index, pIndex)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md mt-1"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {members.length === 0 && <p className="text-gray-500 text-sm italic mt-4">No leaders added yet.</p>}
        </div>
      </div>

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between bg-gray-900 text-white px-6 py-3 rounded-t-xl shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm tracking-wide">Live Preview: Management Desk Page</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-semibold transition-colors ${previewMode === 'desktop' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-semibold transition-colors ${previewMode === 'tablet' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-semibold transition-colors ${previewMode === 'mobile' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body (Device Frame) */}
          <div className="flex-1 bg-gray-950 flex justify-center items-center overflow-y-auto p-4 sm:p-8">
            <div
              className={`bg-white rounded-xl shadow-2xl overflow-y-auto transition-all duration-300 max-h-full ${
                previewMode === 'mobile'
                  ? 'w-[375px] border-[12px] border-gray-800 rounded-[32px]'
                  : previewMode === 'tablet'
                  ? 'w-[768px] border-[12px] border-gray-800 rounded-[24px]'
                  : 'w-full max-w-[1440px]'
              }`}
            >
              <div className="bg-[#fcfcfd] min-h-full pb-20">
                {showHero && <ManagementDeskHero data={previewData} />}
                {showIntro && <ManagementDeskIntro data={previewData} />}
                {showMembers && <ManagementDeskMembers data={previewData} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageManagementDesk;
