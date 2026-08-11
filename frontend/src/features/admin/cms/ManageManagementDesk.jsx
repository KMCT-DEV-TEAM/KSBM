"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2, Eye, Monitor, Smartphone, Tablet, X, ArrowUp, ArrowDown, FileText, Users, Edit, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import { uploadDeferredImage } from './utils/uploadHelper';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageManagementDesk = () => {
  const [showHero, setShowHero] = useState(true);
  const [showHeroTextContent, setShowHeroTextContent] = useState(true);
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  
  const [showIntro, setShowIntro] = useState(true);
  const [introSubheading, setIntroSubheading] = useState('');
  const [introHeading, setIntroHeading] = useState('');
  const [introDescription, setIntroDescription] = useState([]);
  
  const [showMembers, setShowMembers] = useState(true);
  const [members, setMembers] = useState([]);
  
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [currentMember, setCurrentMember] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('hero');
  const iframeRef = useRef(null);

  const previewData = {
    previewType: activeTab,
    showHero, showHeroTextContent, heroHeading, heroSubtext, 
    heroBgImage: typeof heroBgImage === 'object' && heroBgImage?.previewUrl ? heroBgImage.previewUrl : heroBgImage,
    showIntro, introSubheading, introHeading, introDescription,
    showMembers,
    members: members.map(m => ({
      ...m,
      image: typeof m.image === 'object' && m.image?.previewUrl ? m.image.previewUrl : m.image,
      thumbnail: typeof m.thumbnail === 'object' && m.thumbnail?.previewUrl ? m.thumbnail.previewUrl : m.thumbnail
    }))
  };

  useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName: 'ManagementDesk', payload: previewData }, '*');
        }
      };
      
      sendData();
      
      let count = 0;
      interval = setInterval(() => {
        sendData();
        count++;
        if (count > 10) clearInterval(interval);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [previewData, isPreviewModalOpen]);

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <FileText className="w-4 h-4" /> },
    { id: 'intro', label: 'Intro Section', icon: <FileText className="w-4 h-4" /> },
    { id: 'members', label: 'Leadership Profiles', icon: <Users className="w-4 h-4" /> }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/management-desk');
      if (data) {
        if (data.showHero !== undefined) setShowHero(data.showHero);
        if (data.showHeroTextContent !== undefined) setShowHeroTextContent(data.showHeroTextContent);
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
          const newHeroBgImage = await uploadDeferredImage(heroBgImage, '/upload/management');
          
          const newMembers = await Promise.all(members.map(async (m) => ({
            ...m,
            image: await uploadDeferredImage(m.image, '/upload/management'),
            thumbnail: await uploadDeferredImage(m.thumbnail, '/upload/management')
          })));

          await api.put('/cms/management-desk', { 
            showHero, showHeroTextContent, heroHeading, heroSubtext, heroBgImage: newHeroBgImage,
            showIntro, introSubheading, introHeading, introDescription,
            showMembers, members: newMembers 
          }, { hideLoader: true });
          
          setHeroBgImage(newHeroBgImage);
          setMembers(newMembers);
          
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
        setShowHeroTextContent(true);
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

  const removeMember = async (index) => {
    await confirmAction({
      title: 'Remove Leader?',
      message: 'Are you sure you want to remove this leader?',
      confirmText: 'Yes, remove',
      variant: 'danger',
      action: () => setMembers(members.filter((_, i) => i !== index))
    });
  };

  const handleSaveMemberModal = () => {
    if (!currentMember.name) {
      Toast.fire({ icon: 'warning', title: 'Leader Name is required' });
      return;
    }
    const newMembers = [...members];
    if (editingMemberIndex !== null) {
      newMembers[editingMemberIndex] = currentMember;
    } else {
      newMembers.push(currentMember);
    }
    setMembers(newMembers);
    setIsMemberModalOpen(false);
  };

  const updateCurrentMemberPara = (pIndex, value) => {
    const newDesc = [...(currentMember.description || [])];
    newDesc[pIndex] = value;
    setCurrentMember({ ...currentMember, description: newDesc });
  };
  const addCurrentMemberPara = () => {
    setCurrentMember({ ...currentMember, description: [...(currentMember.description || []), ''] });
  };
  const removeCurrentMemberPara = (pIndex) => {
    setCurrentMember({ ...currentMember, description: (currentMember.description || []).filter((_, i) => i !== pIndex) });
  };
  const moveCurrentMemberParaUp = (pIndex) => {
    if (pIndex === 0) return;
    const newDesc = [...(currentMember.description || [])];
    const temp = newDesc[pIndex - 1];
    newDesc[pIndex - 1] = newDesc[pIndex];
    newDesc[pIndex] = temp;
    setCurrentMember({ ...currentMember, description: newDesc });
  };
  const moveCurrentMemberParaDown = (pIndex) => {
    const desc = currentMember.description || [];
    if (pIndex === desc.length - 1) return;
    const newDesc = [...desc];
    const temp = newDesc[pIndex + 1];
    newDesc[pIndex + 1] = newDesc[pIndex];
    newDesc[pIndex] = temp;
    setCurrentMember({ ...currentMember, description: newDesc });
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


  return (
    <div className="space-y-6 w-full">
      {/* Tabs */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div
          className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1 custom-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <PageHeader
        title="Management Desk Section"
        description="Manage the Management Desk hero, introduction, leadership profiles, order, and visibility."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full"
        >
          {activeTab === 'hero' && (
            <div className="w-full">
              {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-[#1e2869]">Hero Section</h3>
              <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Text</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={showHeroTextContent} onChange={(e) => setShowHeroTextContent(e.target.checked)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${showHeroTextContent ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showHeroTextContent ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Hero Heading</label>
                <span className="text-xs text-gray-400">{(heroHeading || '').length}/60</span>
              </div>
              <input type="text" maxLength={60} value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Hero Subtext</label>
                <span className="text-xs text-gray-400">{(heroSubtext || '').length}/225</span>
              </div>
              <textarea maxLength={225} value={heroSubtext} onChange={(e) => setHeroSubtext(e.target.value)} rows={4} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Hero Background Image</label>
              <SingleImageUploader 
                imageUrl={heroBgImage} 
                uploadEndpoint="/upload/management"
                defaultImage="/assets/Images/management/default-management-hero.jpg"
                onUploadComplete={setHeroBgImage}
                onUploadStateChange={setIsUploading}
                label="Upload Hero Bg"
                deferredUpload={true}
              />
            </div>
            </div>
            </div>
          )}

          {activeTab === 'intro' && (
            <div className="w-full">
              {/* Intro Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-[#1e2869]">Intro Section</h3>
              <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={showIntro} onChange={(e) => setShowIntro(e.target.checked)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${showIntro ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showIntro ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Intro Subheading (Tag)</label>
                <span className="text-xs text-gray-400">{(introSubheading || '').length}/50</span>
              </div>
              <input type="text" maxLength={50} value={introSubheading} onChange={(e) => setIntroSubheading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Intro Heading</label>
                <span className="text-xs text-gray-400">{(introHeading || '').length}/60</span>
              </div>
              <input type="text" maxLength={60} value={introHeading} onChange={(e) => setIntroHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Intro Paragraphs</label>
                <button onClick={addIntroDescriptionPara} className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"><Plus className="w-3.5 h-3.5" /> Add Paragraph</button>
              </div>
              <div className="space-y-3">
                {introDescription.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex flex-col gap-0.5 mt-1">
                      <button onClick={() => moveIntroParaUp(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move Up"><ArrowUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => moveIntroParaDown(index)} disabled={index === introDescription.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move Down"><ArrowDown className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex flex-col flex-1 relative">
                      <textarea 
                        maxLength={600}
                        value={para}
                        onChange={(e) => updateIntroDescription(index, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <span className="text-[10px] text-gray-400 absolute bottom-2 right-3 bg-white px-1 rounded-sm">{(para || '').length}/600</span>
                    </div>
                    <button onClick={() => removeIntroDescriptionPara(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-1 shrink-0"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
            </div>
            </div>
          )}

          {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-[#1e2869]">Leadership Profiles (Alternating Zig-Zag)</h3>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Profiles</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={showMembers} onChange={(e) => setShowMembers(e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${showMembers ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showMembers ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
              <button onClick={() => {
                setEditingMemberIndex(null);
                setCurrentMember({ id: Date.now().toString(), name: '', badgeRole: '', tag: 'MESSAGE FROM LEADER', title: 'Leadership Vision', image: '', thumbnail: '', description: [''] });
                setIsMemberModalOpen(true);
              }} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">
                <Plus className="w-4 h-4" /> Add Leader
              </button>
            </div>
            
            <Reorder.Group axis="y" values={members} onReorder={setMembers} className="space-y-4">
              {members.map((member, index) => (
                <Reorder.Item key={member.id} value={member} className="bg-white p-4 border border-gray-300 rounded-xl shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-gray-300" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-[#1e2869]">{member.name || 'Unnamed Leader'}</h4>
                      <p className="text-xs text-gray-500 font-medium">{member.badgeRole || 'No Role Assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => {
                      setEditingMemberIndex(index);
                      setCurrentMember({...member});
                      setIsMemberModalOpen(true);
                    }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Leader">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeMember(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove Leader">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {members.length === 0 && <p className="text-gray-500 text-sm italic mt-4 text-center">No leaders added yet.</p>}
          </div>
        )}
        </motion.div>
      </AnimatePresence>

      {/* Member Edit Modal */}
      {isMemberModalOpen && currentMember && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-[#1e2869]">{editingMemberIndex !== null ? 'Edit Leader' : 'Add New Leader'}</h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Leader Name</label>
                    <span className="text-xs text-gray-400">{(currentMember.name || '').length}/50</span>
                  </div>
                  <input type="text" maxLength={50} value={currentMember.name} onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})} placeholder="e.g. Dr. Navas K. M" className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Floating Badge Role</label>
                    <span className="text-xs text-gray-400">{(currentMember.badgeRole || '').length}/50</span>
                  </div>
                  <input type="text" maxLength={50} value={currentMember.badgeRole} onChange={(e) => setCurrentMember({...currentMember, badgeRole: e.target.value})} placeholder="e.g. Chairman" className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Message Tag</label>
                    <span className="text-xs text-gray-400">{(currentMember.tag || '').length}/50</span>
                  </div>
                  <input type="text" maxLength={50} value={currentMember.tag} onChange={(e) => setCurrentMember({...currentMember, tag: e.target.value})} placeholder="e.g. MESSAGE FROM OUR CHAIRMAN" className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Message Title</label>
                    <span className="text-xs text-gray-400">{(currentMember.title || '').length}/60</span>
                  </div>
                  <input type="text" maxLength={60} value={currentMember.title} onChange={(e) => setCurrentMember({...currentMember, title: e.target.value})} placeholder="e.g. Leadership Vision" className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-2">Main Portrait Photo</label>
                    <SingleImageUploader 
                      imageUrl={currentMember.image} 
                      uploadEndpoint="/upload/management"
                      defaultImage="/assets/Images/management/default-management-leader.jpg"
                      onUploadComplete={(urlObj) => setCurrentMember({...currentMember, image: urlObj})}
                      onUploadStateChange={setIsUploading}
                      label="Upload Main Portrait"
                      deferredUpload={true}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-2">Thumbnail (Floating Badge)</label>
                    <SingleImageUploader 
                      imageUrl={currentMember.thumbnail} 
                      uploadEndpoint="/upload/management"
                      defaultImage="/assets/Images/management/default-management-badge.png"
                      onUploadComplete={(urlObj) => setCurrentMember({...currentMember, thumbnail: urlObj})}
                      onUploadStateChange={setIsUploading}
                      label="Upload Thumbnail"
                      deferredUpload={true}
                    />
                  </div>
                </div>
              </div>

              {/* Paragraphs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Message Paragraphs</label>
                  <button onClick={addCurrentMemberPara} className="text-primary hover:bg-primary/10 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Paragraph</button>
                </div>
                <div className="space-y-2.5">
                  {(currentMember.description || []).map((para, pIndex) => (
                    <div key={pIndex} className="flex gap-2 items-start">
                      <div className="flex flex-col gap-0.5 mt-1">
                        <button onClick={() => moveCurrentMemberParaUp(pIndex)} disabled={pIndex === 0} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move Para Up"><ArrowUp className="w-3 h-3" /></button>
                        <button onClick={() => moveCurrentMemberParaDown(pIndex)} disabled={pIndex === (currentMember.description || []).length - 1} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move Para Down"><ArrowDown className="w-3 h-3" /></button>
                      </div>
                      <div className="flex flex-col flex-1 relative">
                        <textarea 
                          maxLength={600}
                          value={para}
                          onChange={(e) => updateCurrentMemberPara(pIndex, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <span className="text-[10px] text-gray-400 absolute bottom-1 right-2 bg-white px-1 rounded-sm">{(para || '').length}/600</span>
                      </div>
                      <button onClick={() => removeCurrentMemberPara(pIndex)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md mt-1 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsMemberModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
              <button onClick={handleSaveMemberModal} className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">Save Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
              <Eye className="w-5 h-5" /> Live Preview
            </div>
            
            <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('tablet')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => setIsPreviewModalOpen(false)}
              className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-[85vh] ${previewMode === 'desktop' ? 'w-[100%] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe
                ref={iframeRef}
                src="/preview/cms"
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageManagementDesk;
