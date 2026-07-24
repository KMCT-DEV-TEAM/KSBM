"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import AccreditationUploader from './components/AccreditationUploader';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AccreditationPreview from '../../home/components/AccreditationSection';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import { useDeferredUpload } from '../../../hooks/useDeferredUpload';


const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const ManageAccreditation = () => {
  const [subheading, setSubheading] = useState('');
  const [showSubheading, setShowSubheading] = useState(true);

  const [heading, setHeading] = useState('');
  const [showHeading, setShowHeading] = useState(true);

  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [showImage, setShowImage] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger' });
  const iframeRef = useRef(null);

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

  const previewData = {
    subheading, heading, imageUrl, images,
    showSubheading, showHeading, showImage
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: 'preview-accreditation-data', payload: previewData },
            '*'
          );
        }
      }, 500);
      
      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'preview-accreditation-data', payload: previewData },
          '*'
        );
      }
    }
  }, [previewData, isPreviewModalOpen]);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/accreditation');
      setSubheading(data.subheading || '');
      setShowSubheading(data.showSubheading ?? true);
      setHeading(data.heading || '');
      setShowHeading(data.showHeading ?? true);
      setImageUrl(data.imageUrl || '');
      
      const defaultBanners = [
        { url: '/assets/Images/Home/Component 86.png' },
        { url: '/assets/Images/Home/Component 87.png' },
        { url: '/assets/Images/Home/Component 88.png' }
      ];
      setImages(data.images && data.images.length > 0 ? data.images : defaultBanners);
      
      setShowImage(data.showImage ?? true);
    } catch (error) {
      console.error('Error fetching accreditation settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load accreditation settings.' });
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
          const finalImages = await Promise.all(images.map(async (img) => {
            if (img.file) {
              const url = await uploadFile(img.file);
              return { url };
            }
            return img;
          }));

          await api.put('/cms/accreditation', {
            subheading, heading, imageUrl, images: finalImages,
            showSubheading, showHeading, showImage
          });
          
          await executeDeletions();
          setImages(finalImages);
          Toast.fire({ icon: 'success', title: 'Accreditation section saved successfully!' });
        } catch (error) {
          console.error('Error saving accreditation settings:', error);
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
      setSubheading('Institutional Credentials');
      setShowSubheading(true);
      setHeading('Accreditation & Affiliations');
      setShowHeading(true);
      setImageUrl('');
      setImages([
        { url: '/assets/Images/Home/Component 86.png' },
        { url: '/assets/Images/Home/Component 87.png' },
        { url: '/assets/Images/Home/Component 88.png' }
      ]);
      setShowImage(true);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    });
  };

  const handleConfirmAction = async () => {
    
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Accreditation Settings"
        description="Manage the text and logos on the Accreditation & Affiliations section."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving}
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
                src="/preview/accreditation"
                className="w-full h-full border-0"
                title="Accreditation Preview"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">

        {/* Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2869] mb-4">Text Content</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Subheading</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showSubheading} onChange={(e) => setShowSubheading(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <input
                type="text"
                value={subheading}
                maxLength={30}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. Institutional Credentials"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">{subheading.length}/30</div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Main Heading</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showHeading} onChange={(e) => setShowHeading(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <input
                type="text"
                value={heading}
                maxLength={40}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Accreditation & Affiliations"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">{heading.length}/40</div>
            </div>
          </div>
        </div>

        {/* Image Settings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1e2869]">Accreditation Logos Image</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showImage} onChange={(e) => setShowImage(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm font-semibold text-gray-500">Show Image</span>
            </label>
          </div>
          <p className="text-sm text-gray-500 mb-4">Upload multiple images for accreditation and affiliation logos. These will be shown on the website.</p>
          <AccreditationUploader
            images={images}
            setImages={setImages}
            onUploadStateChange={(uploading) => setIsUploading(uploading)}
            deferredMode={true}
            onMarkForDeletion={markForDeletion}
          />
        </div>

      </div>

      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        isSubmitting={isSaving}
      />
    </div>
  );
};

export default ManageAccreditation;

