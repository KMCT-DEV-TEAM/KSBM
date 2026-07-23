"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
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

const ManageVisionMission = () => {
  const [visionTitle, setVisionTitle] = useState('Our Vision');
  const [visionContent, setVisionContent] = useState(['"To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research."']);
  const [visionImage, setVisionImage] = useState('/assets/Images/image 27.png');
  
  const [missionTitle, setMissionTitle] = useState('Our Mission');
  const [missionContent, setMissionContent] = useState([
    'To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research.',
    'To provide high-quality healthcare education that integrates academic excellence with clinical practice.',
    'To foster a culture of continuous learning, ethical practice, and compassionate patient care.',
    'To contribute to the healthcare sector by producing highly skilled and dedicated nursing professionals.'
  ]);
  const [missionImage, setMissionImage] = useState('/assets/Images/image 28.png');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/vision-mission');
      if (data) {
        if (data.visionTitle) setVisionTitle(data.visionTitle);
        if (data.visionContent && data.visionContent.length > 0) setVisionContent(data.visionContent);
        if (data.visionImage) setVisionImage(data.visionImage);
        if (data.missionTitle) setMissionTitle(data.missionTitle);
        if (data.missionContent && data.missionContent.length > 0) setMissionContent(data.missionContent);
        if (data.missionImage) setMissionImage(data.missionImage);
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
          await api.put('/cms/vision-mission', { 
            visionTitle, visionContent, visionImage, 
            missionTitle, missionContent, missionImage 
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
        setVisionTitle('Our Vision');
        setVisionContent(['"To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research."']);
        setVisionImage('/assets/Images/image 27.png');
        setMissionTitle('Our Mission');
        setMissionContent([
          'To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research.',
          'To provide high-quality healthcare education that integrates academic excellence with clinical practice.',
          'To foster a culture of continuous learning, ethical practice, and compassionate patient care.',
          'To contribute to the healthcare sector by producing highly skilled and dedicated nursing professionals.'
        ]);
        setMissionImage('/assets/Images/image 28.png');
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const updateVisionContent = (index, value) => {
    const newContent = [...visionContent];
    newContent[index] = value;
    setVisionContent(newContent);
  };
  const addVisionParagraph = () => setVisionContent([...visionContent, '']);
  const removeVisionParagraph = (index) => setVisionContent(visionContent.filter((_, i) => i !== index));

  const updateMissionContent = (index, value) => {
    const newContent = [...missionContent];
    newContent[index] = value;
    setMissionContent(newContent);
  };
  const addMissionParagraph = () => setMissionContent([...missionContent, '']);
  const removeMissionParagraph = (index) => setMissionContent(missionContent.filter((_, i) => i !== index));

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Vision & Mission Section"
        description="Manage the Vision and Mission content."
        onPreview={() => window.open('/about', '_blank')}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1e2869] border-b pb-2">Our Vision</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Vision Title</label>
              <input 
                type="text" 
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Vision Image</label>
              <SingleImageUploader 
                imageUrl={visionImage} 
                onUploadComplete={setVisionImage}
                onUploadStateChange={setIsUploading}
                label="Upload Vision Image"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Vision Content</label>
                <button onClick={addVisionParagraph} className="text-primary hover:bg-primary/10 p-1 rounded-full"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {visionContent.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <textarea 
                      value={para}
                      onChange={(e) => updateVisionContent(index, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button onClick={() => removeVisionParagraph(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1e2869] border-b pb-2">Our Mission</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Mission Title</label>
              <input 
                type="text" 
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Mission Image</label>
              <SingleImageUploader 
                imageUrl={missionImage} 
                onUploadComplete={setMissionImage}
                onUploadStateChange={setIsUploading}
                label="Upload Mission Image"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Mission Content</label>
                <button onClick={addMissionParagraph} className="text-primary hover:bg-primary/10 p-1 rounded-full"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {missionContent.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <textarea 
                      value={para}
                      onChange={(e) => updateMissionContent(index, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button onClick={() => removeMissionParagraph(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-1"><Trash2 className="w-4 h-4" /></button>
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

export default ManageVisionMission;
