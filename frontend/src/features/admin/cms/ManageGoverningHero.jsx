"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Eye, Monitor, Smartphone, Tablet, X } from 'lucide-react';
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

const ManageGoverningHero = () => {
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  const [showHeroTextContent, setShowHeroTextContent] = useState(true);
  const [contentSubheading, setContentSubheading] = useState('');
  const [contentHeading, setContentHeading] = useState('');
  const [contentDescription, setContentDescription] = useState([]);
  const [showContentDetails, setShowContentDetails] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = useRef(null);

  const previewData = {
    previewType: 'hero',
    heroHeading,
    heroSubtext,
    heroBgImage: typeof heroBgImage === 'object' && heroBgImage?.previewUrl ? heroBgImage.previewUrl : heroBgImage,
    showHeroTextContent,
    contentSubheading,
    contentHeading,
    contentDescription,
    showContentDetails
  };

  useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName: 'GoverningBody', payload: previewData }, '*');
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
      const { data } = await api.get('/cms/governing-body');
      if (data) {
        if (data.heroHeading) setHeroHeading(data.heroHeading);
        if (data.heroSubtext) setHeroSubtext(data.heroSubtext);
        if (data.heroBgImage) setHeroBgImage(data.heroBgImage);
        if (data.contentSubheading) setContentSubheading(data.contentSubheading);
        if (data.contentHeading) setContentHeading(data.contentHeading);
        if (data.contentDescription) setContentDescription(data.contentDescription);
        if (data.showHeroTextContent !== undefined) setShowHeroTextContent(data.showHeroTextContent);
        if (data.showContentDetails !== undefined) setShowContentDetails(data.showContentDetails);
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
          const newHeroBgImage = await uploadDeferredImage(heroBgImage, '/upload/aboutus');

          await api.put('/cms/governing-body', { 
            heroHeading, heroSubtext, heroBgImage: newHeroBgImage, showHeroTextContent,
            contentSubheading, contentHeading, contentDescription, showContentDetails
          }, { hideLoader: true });
          
          setHeroBgImage(newHeroBgImage);
          
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
        setShowHeroTextContent(true);
        setShowContentDetails(true);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const updateContentDescription = (index, value) => {
    const newDesc = [...contentDescription];
    newDesc[index] = value;
    setContentDescription(newDesc);
  };
  const addContentDescriptionPara = () => setContentDescription([...contentDescription, '']);
  const removeContentDescriptionPara = (index) => setContentDescription(contentDescription.filter((_, i) => i !== index));

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full relative">
      <PageHeader
        title="Governing Body Hero & Content"
        description="Manage the Hero section and Content Details of the Governing Body page."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div className="mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Hero Heading</label>
                
</div>
<input type="text" maxLength={50} value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
<div className="text-right text-xs text-gray-400 mt-1">{heroHeading.length}/50 characters</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Hero Subtext</label>
                
              </div>
              <textarea maxLength={200} value={heroSubtext} onChange={(e) => setHeroSubtext(e.target.value)} rows={4} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              <div className="text-right text-xs text-gray-400 mt-1">{heroSubtext.length}/200 characters</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Hero Background Image</label>
              <SingleImageUploader 
                imageUrl={heroBgImage} 
                uploadEndpoint="/upload/aboutus"
                defaultImage="/assets/Images/image 2.png"
                onUploadComplete={setHeroBgImage}
                onUploadStateChange={setIsUploading}
                label="Upload Hero Bg"
                deferredUpload={true}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-[#1e2869]">Content Details</h3>
              <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-xs font-semibold text-[#566A7F] uppercase">Show Section</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={showContentDetails} onChange={(e) => setShowContentDetails(e.target.checked)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${showContentDetails ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showContentDetails ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Content Subheading</label>
</div>
<input type="text" maxLength={50} value={contentSubheading} onChange={(e) => setContentSubheading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
<div className="text-right text-xs text-gray-400 mt-1">{contentSubheading.length}/50 characters</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="mb-1.5">
<label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Content Heading</label>
                
</div>
<input type="text" maxLength={100} value={contentHeading} onChange={(e) => setContentHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
<div className="text-right text-xs text-gray-400 mt-1">{contentHeading.length}/100 characters</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Description Paragraphs</label>
                <button onClick={addContentDescriptionPara} className="text-primary hover:bg-primary/10 p-1 rounded-full"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {contentDescription.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="w-full relative">
                      <textarea 
                        maxLength={500}
                        value={para}
                        onChange={(e) => updateContentDescription(index, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <span className="absolute bottom-2 right-2 text-[10px] text-gray-400 bg-white px-1">{para.length}/500</span>
                    </div>
                    <button onClick={() => removeContentDescriptionPara(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default ManageGoverningHero;
