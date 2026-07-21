"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageGoverningBody = () => {
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  const [contentSubheading, setContentSubheading] = useState('');
  const [contentHeading, setContentHeading] = useState('');
  const [contentDescription, setContentDescription] = useState([]);
  
  const [members, setMembers] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/governing-body');
      if (data) {
        if (data.heroHeading) setHeroHeading(data.heroHeading);
        if (data.heroSubtext) setHeroSubtext(data.heroSubtext);
        if (data.heroBgImage) setHeroBgImage(data.heroBgImage);
        if (data.contentSubheading) setContentSubheading(data.contentSubheading);
        if (data.contentHeading) setContentHeading(data.contentHeading);
        if (data.contentDescription) setContentDescription(data.contentDescription);
        if (data.members && data.members.length > 0) setMembers(data.members);
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
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/governing-body', { 
            heroHeading, heroSubtext, heroBgImage,
            contentSubheading, contentHeading, contentDescription,
            members 
          }, { hideLoader: true });
          Toast.fire({ icon: 'success', title: 'Settings saved successfully!' });
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
      message: 'This will reset all your settings to their original state. You still need to click "Save Changes" to apply them.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setHeroHeading('KSBM Governing Body');
        setHeroSubtext('Strategizing for excellence: The leadership framework dedicated to advancing pharmaceutical management education through visionary governance, industrial synergy, and academic rigor.');
        setHeroBgImage('/assets/Images/image 2.png');
        setContentSubheading('COMMITTEE');
        setContentHeading('Governing Body');
        setContentDescription([
          "The Governing Body of KMCT School of Business Management plays a pivotal role in shaping the institution's academic and administrative framework. The body is chaired by Dr. Navas KM, with Dr. Ayisha Nazreen serving as the Special Invitee, and Dr. Sujith Varma as the Member Secretary. It also includes selected faculty members who serve as academic nominees, industry representatives, and ex-officio members, ensuring a diverse and well-rounded leadership.",
          "The Governing Body is committed to maintaining academic excellence, fostering research and innovation, and strengthening industry-academic collaborations. Through strategic decision-making and policy implementation, it ensures the holistic development of students and the institution, keeping pace with the evolving landscape of management education."
        ]);
        setMembers([
          { name: "Dr. Navas K M", title: "Managing Trustee", image: "/assets/Images/image 35.png" }
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
  const addMember = () => setMembers([...members, { name: '', title: '', image: '' }]);
  const removeMember = (index) => setMembers(members.filter((_, i) => i !== index));

  const updateContentDescription = (index, value) => {
    const newDesc = [...contentDescription];
    newDesc[index] = value;
    setContentDescription(newDesc);
  };
  const addContentDescriptionPara = () => setContentDescription([...contentDescription, '']);
  const removeContentDescriptionPara = (index) => setContentDescription(contentDescription.filter((_, i) => i !== index));

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Governing Body Section"
        description="Manage the Governing Body members."
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        
        {/* Hero & Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 border-b pb-12 border-gray-200">
          {/* Hero Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1e2869] border-b pb-2">Hero Section</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Hero Heading</label>
              <input type="text" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Hero Subtext</label>
              <textarea value={heroSubtext} onChange={(e) => setHeroSubtext(e.target.value)} rows={4} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Background Image</label>
              <SingleImageUploader 
                imageUrl={heroBgImage} 
                onUploadComplete={setHeroBgImage}
                onUploadStateChange={setIsUploading}
                label="Upload Hero Bg"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1e2869] border-b pb-2">Content Details</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Content Subheading</label>
              <input type="text" value={contentSubheading} onChange={(e) => setContentSubheading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Content Heading</label>
              <input type="text" value={contentHeading} onChange={(e) => setContentHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Description Paragraphs</label>
                <button onClick={addContentDescriptionPara} className="text-primary hover:bg-primary/10 p-1 rounded-full"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {contentDescription.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <textarea 
                      value={para}
                      onChange={(e) => updateContentDescription(index, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button onClick={() => removeContentDescriptionPara(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div>
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h3 className="text-lg font-bold text-[#1e2869]">Governing Body Members</h3>
            <button onClick={addMember} className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-colors">
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
                <button onClick={() => removeMember(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1.5 rounded-md"><Trash2 className="w-4 h-4" /></button>
                <div className="space-y-4 pr-10">
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Name</label>
                    <input type="text" value={member.name} onChange={(e) => updateMember(index, 'name', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Title</label>
                    <input type="text" value={member.title} onChange={(e) => updateMember(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Member Image</label>
                    <SingleImageUploader 
                      imageUrl={member.image} 
                      onUploadComplete={(url) => updateMember(index, 'image', url)}
                      onUploadStateChange={setIsUploading}
                      label="Upload Member Image"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {members.length === 0 && <p className="text-gray-500 text-sm italic mt-4">No members added yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageGoverningBody;
