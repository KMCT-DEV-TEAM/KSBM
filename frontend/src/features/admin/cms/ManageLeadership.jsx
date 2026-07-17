"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2 } from 'lucide-react';
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

const ManageLeadership = () => {
  const [subheading, setSubheading] = useState('MEET OUR LEADER');
  const [heading, setHeading] = useState('Visionary Leadership for a Better Tomorrow');
  const [name, setName] = useState('Dr. Navas K M');
  const [title, setTitle] = useState('MANAGING TRUSTEE - KMCT');
  const [description, setDescription] = useState(['']);
  const [image, setImage] = useState('/assets/Images/image 33.png');
  const [signatureImage, setSignatureImage] = useState('/assets/Images/image 32.png');
  
  const [leader2Name, setLeader2Name] = useState('Dr. James Starlin');
  const [leader2Title, setLeader2Title] = useState('PRINCIPAL');
  const [leader2Description, setLeader2Description] = useState(['']);
  const [leader2Image, setLeader2Image] = useState('https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/leadership');
      if (data) {
        if (data.subheading) setSubheading(data.subheading);
        if (data.heading) setHeading(data.heading);
        if (data.name) setName(data.name);
        if (data.title) setTitle(data.title);
        if (data.description && data.description.length > 0) setDescription(data.description);
        if (data.image) setImage(data.image);
        if (data.signatureImage) setSignatureImage(data.signatureImage);
        if (data.leader2Name) setLeader2Name(data.leader2Name);
        if (data.leader2Title) setLeader2Title(data.leader2Title);
        if (data.leader2Description && data.leader2Description.length > 0) setLeader2Description(data.leader2Description);
        if (data.leader2Image) setLeader2Image(data.leader2Image);
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
          await api.put('/cms/leadership', { 
            subheading, heading, name, title, description, image, signatureImage, leader2Name, leader2Title, leader2Description, leader2Image
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
        setSubheading('MEET OUR LEADER');
        setHeading('Visionary Leadership for a Better Tomorrow');
        setName('Dr. Navas K M');
        setTitle('MANAGING TRUSTEE - KMCT');
        setDescription([
          `"The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge – they reveal the defining nature of KSBM."`,
          `We believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and as KSBM, this is our overarching commitment to shaping a transformative future.`,
          `As KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."`
        ]);
        setImage('/assets/Images/Group 164.png');
        setSignatureImage('/assets/Images/image 32.png');
        setLeader2Name('Dr. James Starlin');
        setLeader2Title('PRINCIPAL');
        setLeader2Description([
          `"The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds."`,
          `We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.`,
          `KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."`
        ]);
        setLeader2Image('https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80');
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const updateDescription = (index, value) => {
    const newDesc = [...description];
    newDesc[index] = value;
    setDescription(newDesc);
  };
  const addDescriptionPara = () => setDescription([...description, '']);
  const removeDescriptionPara = (index) => setDescription(description.filter((_, i) => i !== index));

  const updateLeader2Description = (index, value) => {
    const newDesc = [...leader2Description];
    newDesc[index] = value;
    setLeader2Description(newDesc);
  };
  const addLeader2DescriptionPara = () => setLeader2Description([...leader2Description, '']);
  const removeLeader2DescriptionPara = (index) => setLeader2Description(leader2Description.filter((_, i) => i !== index));

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">Leadership Section</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the leader profile and message.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 bg-white text-[#697A8D] px-4 py-2.5 rounded-md font-semibold text-sm border border-[#D9DEE3] hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_2px_4px_0_var(--color-primary)] disabled:opacity-70"
          >
            {isSaving || isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#566A7F] border-b pb-2">Section Titles</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Subheading</label>
              <input type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Heading</label>
              <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <h3 className="text-lg font-bold text-[#566A7F] border-b pb-2 mt-8">Images</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Leader Image</label>
              <SingleImageUploader 
                imageUrl={image} 
                onUploadComplete={setImage}
                onUploadStateChange={setIsUploading}
                label="Upload Leader Image"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Signature Image</label>
              <SingleImageUploader 
                imageUrl={signatureImage} 
                onUploadComplete={setSignatureImage}
                onUploadStateChange={setIsUploading}
                label="Upload Signature Image"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#566A7F] border-b pb-2">Leader Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Title / Designation</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Message / Description</label>
                <button onClick={addDescriptionPara} className="text-primary hover:bg-primary/10 p-1 rounded-full"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {description.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <textarea 
                      value={para}
                      onChange={(e) => updateDescription(index, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button onClick={() => removeDescriptionPara(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leader 2 Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-200">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#566A7F] border-b pb-2">Leader 2 (Principal) Image</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Leader 2 Image</label>
              <SingleImageUploader 
                imageUrl={leader2Image} 
                onUploadComplete={setLeader2Image}
                onUploadStateChange={setIsUploading}
                label="Upload Leader 2 Image"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#566A7F] border-b pb-2">Leader 2 Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Name</label>
              <input type="text" value={leader2Name} onChange={(e) => setLeader2Name(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Title / Designation</label>
              <input type="text" value={leader2Title} onChange={(e) => setLeader2Title(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Message / Description</label>
                <button onClick={addLeader2DescriptionPara} className="text-primary hover:bg-primary/10 p-1 rounded-full"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {leader2Description.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <textarea 
                      value={para}
                      onChange={(e) => updateLeader2Description(index, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button onClick={() => removeLeader2DescriptionPara(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLeadership;
