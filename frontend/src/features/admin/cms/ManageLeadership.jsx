"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2, ArrowUp, ArrowDown, UserPlus, Eye, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import LeadershipSection from '../../about/components/LeadershipSection';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const defaultLeaders = [
  {
    id: '1',
    subheading: 'OUR VISIONARY LEADER DR. NAVAS K.M',
    heading: 'Leadership Vision',
    name: 'Dr. Navas K M',
    title: 'MANAGING TRUSTEE - KMCT',
    description: `"The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge – they reveal the defining nature of KSBM."\n\nWe believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and as KSBM, this is our overarching commitment to shaping a transformative future.\n\nAs KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."`,
    image: '/assets/Images/Group 164.png'
  },
  {
    id: '2',
    subheading: 'MEET OUR LEADER',
    name: 'Dr. James Starlin',
    title: 'PRINCIPAL',
    description: `"The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds."\n\nWe continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.\n\nKSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."`,
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80'
  }
];

const ManageLeadership = () => {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const iframeRef = useRef(null);

  const previewData = {
    leaders: leaders.map(leader => ({
      ...leader,
      description: Array.isArray(leader.description) ? leader.description : [leader.description],
      image: typeof leader.image === 'object' && leader.image.file ? URL.createObjectURL(leader.image.file) : leader.image
    }))
  };

  useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName: 'LeadershipSection', payload: previewData }, '*');
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
  const [newLeader, setNewLeader] = useState({
    name: '',
    title: '',
    subheading: 'MEET OUR LEADER',
    heading: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/leadership');
      if (data && data.leaders && data.leaders.length > 0) {
        setLeaders(data.leaders.map(l => ({
          ...l,
          description: Array.isArray(l.description) ? l.description.join('\n\n') : l.description
        })));
      } else if (data) {
        // Construct leaders from legacy fields if leaders array not present
        setLeaders([
          {
            id: '1',
            subheading: data.subheading || 'OUR VISIONARY LEADER DR. NAVAS K.M',
            heading: data.heading || 'Leadership Vision',
            name: data.name || 'Dr. Navas K M',
            title: data.title || 'MANAGING TRUSTEE - KMCT',
            description: data.description && data.description.length > 0 ? (Array.isArray(data.description) ? data.description.join('\n\n') : data.description) : defaultLeaders[0].description,
            image: data.image || '/assets/Images/Group 164.png'
          },
          {
            id: '2',
            subheading: 'MEET OUR LEADER',
            name: data.leader2Name || 'Dr. James Starlin',
            title: data.leader2Title || 'PRINCIPAL',
            description: data.leader2Description && data.leader2Description.length > 0 ? (Array.isArray(data.leader2Description) ? data.leader2Description.join('\n\n') : data.leader2Description) : defaultLeaders[1].description,
            image: data.leader2Image || 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80'
          }
        ]);
      } else {
        setLeaders(defaultLeaders);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these leadership profiles to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          const finalLeaders = [];
          for (let i = 0; i < leaders.length; i++) {
            let leader = { ...leaders[i] };
            
            if (typeof leader.image === 'object' && leader.image.file) {
              const formData = new FormData();
              formData.append('image', leader.image.file);
              const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }, hideLoader: true });
              leader.image = res.data.url;
            }

            leader.description = [leader.description];
            finalLeaders.push(leader);
          }

          await api.put('/cms/leadership', {
            leaders: finalLeaders,
            heading: finalLeaders[0]?.heading || 'Visionary Leadership for a Better Tomorrow',
            subheading: finalLeaders[0]?.subheading,
            name: finalLeaders[0]?.name,
            title: finalLeaders[0]?.title,
            description: finalLeaders[0]?.description,
            image: finalLeaders[0]?.image,
            leader2Name: finalLeaders[1]?.name,
            leader2Title: finalLeaders[1]?.title,
            leader2Description: finalLeaders[1]?.description,
            leader2Image: finalLeaders[1]?.image
          }, { hideLoader: true });
          Toast.fire({ icon: 'success', title: 'Leadership settings saved successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save leadership settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset the leadership list to original defaults. Click "Save Changes" afterwards to apply.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setLeaders(defaultLeaders);
        Toast.fire({ icon: 'info', title: 'Reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const handleAddLeaderSave = () => {
    if (!newLeader.name || !newLeader.title) {
      Toast.fire({ icon: 'error', title: 'Name and Title are required.' });
      return;
    }
    const leaderToAdd = { ...newLeader, id: Date.now().toString() };
    setLeaders([...leaders, leaderToAdd]);
    setIsAddModalOpen(false);
    setNewLeader({
      name: '', title: '', subheading: 'MEET OUR LEADER', heading: '', description: '', image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80'
    });
    Toast.fire({ icon: 'success', title: 'New leader added! Scroll down to edit.' });
  };

  const handleRemoveLeader = async (index) => {
    if (leaders.length <= 1) {
      Toast.fire({ icon: 'warning', title: 'You must keep at least one leader profile.' });
      return;
    }
    const leaderName = leaders[index]?.name || 'Leader';
    
    await confirmAction({
      title: 'Remove Leader?',
      message: `Are you sure you want to remove ${leaderName}?`,
      confirmText: 'Yes, remove them!',
      variant: 'danger',
      action: async () => {
        setLeaders((prevLeaders) => prevLeaders.filter((_, i) => i !== index));
        Toast.fire({ icon: 'success', title: `${leaderName} removed! Click "Save Changes" to apply.` });
      }
    });
  };

  const handleMoveLeader = (index, direction) => {
    const newLeaders = [...leaders];
    if (direction === 'up' && index > 0) {
      [newLeaders[index - 1], newLeaders[index]] = [newLeaders[index], newLeaders[index - 1]];
    } else if (direction === 'down' && index < newLeaders.length - 1) {
      [newLeaders[index + 1], newLeaders[index]] = [newLeaders[index], newLeaders[index + 1]];
    }
    setLeaders(newLeaders);
  };

  const updateLeaderField = (index, field, value) => {
    const newLeaders = [...leaders];
    newLeaders[index] = { ...newLeaders[index], [field]: value };
    setLeaders(newLeaders);
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="About Us - Leadership Section"
        description="Add and manage leaders. They automatically display on the About Us page in an alternating left/right layout."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

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

      <div className="flex justify-between items-center w-full mt-4">
        <h2 className="text-xl font-bold text-[#566A7F] font-heading">Leadership Profiles</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          Add Person
        </button>
      </div>

      {/* Leaders List */}
      <div className="space-y-8 w-full">
        {leaders.map((leader, index) => {
          const isEven = index % 2 === 0;
          const layoutBadgeText = isEven ? "Alternative Layout: Image Left, Content Right" : "Alternative Layout: Content Left, Image Right";

          return (
            <div
              key={leader.id || index}
              className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] border border-gray-100 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-[#f8f9fc] px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#566A7F] text-base">
                      {leader.name || 'Untitled Leader'}
                    </h3>
                    <span className="text-xs font-semibold text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                      {layoutBadgeText}
                    </span>
                  </div>
                </div>

                {/* Move & Delete Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleMoveLeader(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLeader(index, 'down')}
                    disabled={index === leaders.length - 1}
                    className="p-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLeader(index)}
                    className="p-1.5 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors ml-2"
                    title="Remove Person"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Images */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-[#566A7F] uppercase tracking-wider border-b pb-2">
                      Images
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">
                        Person Image / Photo
                      </label>
                      <SingleImageUploader
                        imageUrl={leader.image}
                        onUploadComplete={(url) => updateLeaderField(index, 'image', url)}
                        onUploadStateChange={setIsUploading}
                        label="Upload Photo"
                        deferredUpload={true}
                      />
                    </div>

                  </div>

                  {/* Right Column: Titles and Description */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-[#566A7F] uppercase tracking-wider border-b pb-2">
                      Profile Details
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">
                          Name
                        </label>
                        <span className="text-xs text-gray-500">{leader.name?.length || 0}/50</span>
                      </div>
                      <input
                        type="text"
                        maxLength={50}
                        value={leader.name || ''}
                        onChange={(e) => updateLeaderField(index, 'name', e.target.value)}
                        placeholder="e.g. Dr. Navas K.M"
                        className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">
                          Title / Designation
                        </label>
                        <span className="text-xs text-gray-500">{leader.title?.length || 0}/50</span>
                      </div>
                      <input
                        type="text"
                        maxLength={50}
                        value={leader.title || ''}
                        onChange={(e) => updateLeaderField(index, 'title', e.target.value)}
                        placeholder="e.g. MANAGING TRUSTEE - KMCT"
                        className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">
                          Subheading Tag (Small Top Text)
                        </label>
                        <span className="text-xs text-gray-500">{leader.subheading?.length || 0}/50</span>
                      </div>
                      <input
                        type="text"
                        maxLength={50}
                        value={leader.subheading || ''}
                        onChange={(e) => updateLeaderField(index, 'subheading', e.target.value)}
                        placeholder="e.g. MEET OUR LEADER"
                        className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {index === 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">
                            Main Heading (Optional)
                          </label>
                          <span className="text-xs text-gray-500">{leader.heading?.length || 0}/50</span>
                        </div>
                        <input
                          type="text"
                          maxLength={50}
                          value={leader.heading || ''}
                          onChange={(e) => updateLeaderField(index, 'heading', e.target.value)}
                          placeholder="e.g. Leadership Vision"
                          className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">
                          Message / Paragraphs
                        </label>
                        <span className="text-xs text-gray-500">{leader.description?.length || 0}/900</span>
                      </div>
                      <textarea
                        value={leader.description || ''}
                        maxLength={900}
                        onChange={(e) => updateLeaderField(index, 'description', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Leader Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-[#1e2869]">Add New Leader</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
              <div>
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Name *</label>
                <input 
                  type="text" 
                  maxLength={50} 
                  value={newLeader.name} 
                  onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. Dr. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Title / Designation *</label>
                <input 
                  type="text" 
                  maxLength={50} 
                  value={newLeader.title} 
                  onChange={(e) => setNewLeader({ ...newLeader, title: e.target.value })} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. Managing Director"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Subheading</label>
                <input 
                  type="text" 
                  maxLength={50} 
                  value={newLeader.subheading} 
                  onChange={(e) => setNewLeader({ ...newLeader, subheading: e.target.value })} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. MEET OUR LEADER"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Heading</label>
                <input 
                  type="text" 
                  maxLength={50} 
                  value={newLeader.heading} 
                  onChange={(e) => setNewLeader({ ...newLeader, heading: e.target.value })} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. Leadership Vision"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Message / Paragraphs</label>
                <textarea 
                  maxLength={900} 
                  rows={4}
                  value={newLeader.description} 
                  onChange={(e) => setNewLeader({ ...newLeader, description: e.target.value })} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="Enter message..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Photo</label>
                <SingleImageUploader
                  imageUrl={newLeader.image}
                  onUploadComplete={(url) => setNewLeader({ ...newLeader, image: url })}
                  onUploadStateChange={setIsUploading}
                  label="Upload Photo"
                  deferredUpload={true}
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100 shrink-0">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddLeaderSave}
                className="px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
              >
                Add Person
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLeadership;
