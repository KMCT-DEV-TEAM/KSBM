"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2, Eye, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import VisionMissionSection from '../../about/components/VisionMissionSection';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageVisionMission = () => {
  const [visionTitle, setVisionTitle] = useState('Our Vision');
  const [visionContent, setVisionContent] = useState('"To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research."');
  const [visionImage, setVisionImage] = useState('/assets/Images/aboutus/vision.png');
  
  const [missionTitle, setMissionTitle] = useState('Our Mission');
  const [missionContent, setMissionContent] = useState('To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research.\n\nTo provide high-quality healthcare education that integrates academic excellence with clinical practice.\n\nTo foster a culture of continuous learning, ethical practice, and compassionate patient care.\n\nTo contribute to the healthcare sector by producing highly skilled and dedicated nursing professionals.');
  const [missionImage, setMissionImage] = useState('/assets/Images/aboutus/mission.png');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = useRef(null);

  const previewData = {
    visionTitle,
    visionContent: [visionContent],
    visionImage: visionImage.file ? URL.createObjectURL(visionImage.file) : visionImage,
    missionTitle,
    missionContent: [missionContent],
    missionImage: missionImage.file ? URL.createObjectURL(missionImage.file) : missionImage
  };

  useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName: 'VisionMissionSection', payload: previewData }, '*');
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/vision-mission');
      if (data) {
        if (data.visionTitle) setVisionTitle(data.visionTitle);
        if (data.visionContent && Array.isArray(data.visionContent)) setVisionContent(data.visionContent.join('\n\n'));
        if (data.visionImage) setVisionImage(data.visionImage);
        if (data.missionTitle) setMissionTitle(data.missionTitle);
        if (data.missionContent && Array.isArray(data.missionContent)) setMissionContent(data.missionContent.join('\n\n'));
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
          let finalVisionImage = visionImage;
          if (typeof visionImage === 'object' && visionImage.file) {
            const formData = new FormData();
            formData.append('image', visionImage.file);
            const res = await api.post('/upload/aboutus', formData, { headers: { 'Content-Type': 'multipart/form-data' }, hideLoader: true });
            finalVisionImage = res.data.url;
          }

          let finalMissionImage = missionImage;
          if (typeof missionImage === 'object' && missionImage.file) {
            const formData = new FormData();
            formData.append('image', missionImage.file);
            const res = await api.post('/upload/aboutus', formData, { headers: { 'Content-Type': 'multipart/form-data' }, hideLoader: true });
            finalMissionImage = res.data.url;
          }

          await api.put('/cms/vision-mission', { 
            visionTitle, 
            visionContent: [visionContent], 
            visionImage: finalVisionImage, 
            missionTitle, 
            missionContent: [missionContent], 
            missionImage: finalMissionImage 
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
        setVisionContent('"To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research."');
        setVisionImage('/assets/Images/image 27.png');
        setMissionTitle('Our Mission');
        setMissionContent('To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research.\n\nTo provide high-quality healthcare education that integrates academic excellence with clinical practice.\n\nTo foster a culture of continuous learning, ethical practice, and compassionate patient care.\n\nTo contribute to the healthcare sector by producing highly skilled and dedicated nursing professionals.');
        setMissionImage('/assets/Images/image 28.png');
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };



  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Vision & Mission Section"
        description="Manage the Vision and Mission content."
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1e2869] border-b pb-2">Our Vision</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Vision Title</label>
                <span className="text-xs text-gray-500">{visionTitle.length}/50</span>
              </div>
              <input 
                type="text" 
                maxLength={50}
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
                deferredUpload={true}
                defaultImage="/assets/Images/aboutus/vision.png"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Vision Content</label>
                <span className="text-xs text-gray-500">{visionContent.length}/2000</span>
              </div>
              <textarea 
                value={visionContent}
                maxLength={2000}
                onChange={(e) => setVisionContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Mission Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1e2869] border-b pb-2">Our Mission</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Mission Title</label>
                <span className="text-xs text-gray-500">{missionTitle.length}/50</span>
              </div>
              <input 
                type="text" 
                maxLength={50}
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
                deferredUpload={true}
                defaultImage="/assets/Images/aboutus/mission.png"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Mission Content</label>
                <span className="text-xs text-gray-500">{missionContent.length}/2000</span>
              </div>
              <textarea 
                value={missionContent}
                maxLength={2000}
                onChange={(e) => setMissionContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVisionMission;
