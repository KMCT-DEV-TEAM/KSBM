"use client";
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, GripVertical } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import ConfirmationModal from '../../../components/ConfirmationModal';
const graduateImg = '/assets/Images/Home/graduate.png';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';
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

const ManageAbout = () => {
  const [subheading, setSubheading] = useState('');
  const [showSubheading, setShowSubheading] = useState(true);

  const [heading, setHeading] = useState('');
  const [showHeading, setShowHeading] = useState(true);

  const [paragraphs, setParagraphs] = useState(['', '']);
  const [showParagraphs, setShowParagraphs] = useState(true);

  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showImage, setShowImage] = useState(true);

  const [stats, setStats] = useState([]);
  const [showStats, setShowStats] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = React.useRef(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, index: null, title: '', message: '', confirmText: '', variant: 'danger' });

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

  const dragItem = React.useRef();
  const dragOverItem = React.useRef();

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current === undefined || dragOverItem.current === undefined) return;
    if (dragItem.current === dragOverItem.current) return;

    const copyListItems = [...stats];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = undefined;
    dragOverItem.current = undefined;
    setStats(copyListItems);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/about');
      setSubheading(data.subheading || '');
      setShowSubheading(data.showSubheading ?? true);

      setHeading(data.heading || '');
      setShowHeading(data.showHeading ?? true);

      setParagraphs(data.paragraphs || ['', '']);
      setShowParagraphs(data.showParagraphs ?? true);

      setImageUrl(data.imageUrl || '');
      setShowImage(data.showImage ?? true);

      setStats(data.stats || []);
      setShowStats(data.showStats ?? true);
    } catch (error) {
      console.error('Error fetching about settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load about settings.' });
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
          let finalImageUrl = imageUrl;
          if (imageFile) {
            finalImageUrl = await uploadFile(imageFile);
          }

          await api.put('/cms/about', {
            subheading, heading, paragraphs, imageUrl: finalImageUrl, stats,
            showSubheading, showHeading, showParagraphs, showImage, showStats
          });

          await executeDeletions();
          setImageUrl(finalImageUrl);
          setImageFile(null);
          Toast.fire({ icon: 'success', title: 'About section saved successfully!' });
        } catch (error) {
          console.error('Error saving about settings:', error);
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
      setSubheading('BUILDING EXCELLENCE SINCE 1995');
      setShowSubheading(true);
      setHeading("Shaping Tomorrow's Business Leaders");
      setShowHeading(true);
      setParagraphs([
        "At KMCT School of Business Management (KSBM), we believe management education goes beyond academic excellence—it is about developing ethical leaders, innovative thinkers, and future-ready professionals. For over two decades, KSBM has been committed to delivering quality education through its MBA and BBA programs, combining academic rigor with practical learning, industry exposure, internships, and experiential training to prepare students for today's evolving business landscape.",
        "Our MBA program equips students with advanced managerial knowledge, strategic thinking, and leadership skills for successful corporate careers, while the BBA program builds a strong foundation in business, communication, and management for higher studies and professional growth. Supported by experienced faculty, modern infrastructure, and strong industry collaborations, KSBM provides an inspiring environment that nurtures critical thinking, entrepreneurship, innovation, and lifelong learning."
      ]);
      setShowParagraphs(true);
      setImageUrl('');
      setShowImage(true);
      setStats([
        { value: '16+', label: 'YEARS OF EXCELLENCE' },
        { value: '991+', label: 'ACTIVE STUDENTS' },
        { value: '196+', label: 'GLOBAL RECRUITERS' },
        { value: '196+', label: 'GLOBAL RECRUITERS' }
      ]);
      setShowStats(true);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    });
  };

  const addStat = () => {
    if (stats.length >= 5) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'You can only have up to 5 statistics.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
    setStats([...stats, { value: '', label: '' }]);
  };

  const removeStat = (index) => {
    setConfirmModal({
      isOpen: true,
      action: 'removeStat',
      index,
      title: 'Are you sure?',
      message: 'You want to remove this statistic?',
      confirmText: 'Yes, delete it!',
      variant: 'danger'
    });
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const updateParagraph = (index, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setParagraphs(newParagraphs);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const removeParagraph = (index) => {
    setConfirmModal({
      isOpen: true,
      action: 'removeParagraph',
      index,
      title: 'Are you sure?',
      message: 'You want to remove this paragraph?',
      confirmText: 'Yes, delete it!',
      variant: 'danger'
    });
  };

  const handleConfirmAction = async () => {
     if (confirmModal.action === 'removeStat') {
      const index = confirmModal.index;
      const newStats = [...stats];
      newStats.splice(index, 1);
      setStats(newStats);

      setIsSaving(true);
      try {
        await api.put('/cms/about', {
          subheading, heading, paragraphs, imageUrl, stats: newStats,
          showSubheading, showHeading, showParagraphs, showImage, showStats
        });
        Toast.fire({ icon: 'success', title: 'Stat deleted successfully!' });
      } catch (error) {
        console.error('Error auto-saving after delete:', error);
        Toast.fire({ icon: 'error', title: 'Deleted locally, but failed to save to server.' });
      } finally {
        setIsSaving(false);
      }
    } else if (confirmModal.action === 'removeParagraph') {
      const index = confirmModal.index;
      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1);
      setParagraphs(newParagraphs);

      setIsSaving(true);
      try {
        await api.put('/cms/about', {
          subheading, heading, paragraphs: newParagraphs, imageUrl, stats,
          showSubheading, showHeading, showParagraphs, showImage, showStats
        });
        Toast.fire({ icon: 'success', title: 'Paragraph deleted successfully!' });
      } catch (error) {
        console.error('Error auto-saving after delete:', error);
        Toast.fire({ icon: 'error', title: 'Deleted locally, but failed to save to server.' });
      } finally {
        setIsSaving(false);
      }
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  
  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = {
        subheading, heading, paragraphs, imageUrl, stats,
        showSubheading, showHeading, showParagraphs, showImage, showStats,
        previewDevice: previewMode
      };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'about' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-about-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-about-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, subheading, heading, paragraphs, imageUrl, stats, showSubheading, showHeading, showParagraphs, showImage, showStats]);

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="About KSBM Settings"
        description="Manage the text, image, and stats on the About section."
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
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center p-4">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-full ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe 
                ref={iframeRef}
                src="/preview/about"
                className="w-full h-full border-0"
                title="About Preview"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">

        {/* Header Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2869] mb-4">Header Content</h3>
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
                maxLength={40}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. BUILDING EXCELLENCE SINCE 1995"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">
                {subheading.length}/40 characters
              </div>
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
                maxLength={60}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Shaping Tomorrow's Business Leaders"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-xs text-right mt-1 text-gray-500">
                {heading.length}/60 characters
              </div>
            </div>
          </div>
        </div>

        {/* Image Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1e2869]">Section Image</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showImage} onChange={(e) => setShowImage(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm font-semibold text-gray-500">Show Image</span>
            </label>
          </div>
          <LogoUploader
            currentLogoUrl={imageUrl || graduateImg}
            disableDelete={!imageUrl}
            deferredMode={true}
            onUploadSuccess={(url, file) => {
              if (file && imageUrl) markForDeletion(imageUrl);
              else if (url === '' && imageUrl) markForDeletion(imageUrl);
              setImageUrl(url);
              setImageFile(file);
            }}
            uploadEndpoint="/upload/home"
            title="Upload About Image"
            subtitle="Drag & drop an image or click to browse."
            helpText="Recommended format: vertical portrait image. Max 5MB (JPEG, PNG, WEBP)"
          />
        </div>

        {/* Paragraphs Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1e2869]">Paragraphs</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showParagraphs} onChange={(e) => setShowParagraphs(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Paragraphs</span>
              </label>
            </div>
            <button
              onClick={addParagraph}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Paragraph
            </button>
          </div>
          <div className="space-y-4">
            {paragraphs.map((para, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={para}
                    onChange={(e) => updateParagraph(index, e.target.value)}
                    rows="4"
                    maxLength={600}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-xs text-right mt-1 text-gray-500">
                    {para.length}/600 characters
                  </div>
                </div>
                <button
                  onClick={() => removeParagraph(index)}
                  className="p-2 h-fit text-gray-400 hover:text-[#FF3E1D] hover:bg-[#FF3E1D]/10 rounded-md transition-colors"
                  title="Remove Paragraph"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Builder */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1e2869]">Statistics</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Stats Section</span>
              </label>
            </div>
            <button
              onClick={addStat}
              disabled={stats.length >= 5}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl shadow-md transition-all ${stats.length >= 5 ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'text-white bg-primary hover:bg-[#151c48]'}`}
            >
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center gap-3 bg-[#F5F5F9] p-3 rounded-lg border border-gray-200 group transition-all"
              >
                <div className="cursor-move p-2 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={stat.value}
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9+]/g, '');
                        updateStat(index, 'value', val);
                      }}
                      placeholder="Value (e.g., 16+)"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <div className="text-xs text-right mt-1 text-gray-500">{stat.value?.length || 0}/10</div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={stat.label}
                      maxLength={30}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Label (e.g., YEARS OF EXCELLENCE)"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <div className="text-xs text-right mt-1 text-gray-500">{stat.label?.length || 0}/30</div>
                  </div>
                </div>

                <button
                  onClick={() => removeStat(index)}
                  className="p-2 text-gray-400 hover:text-[#FF3E1D] hover:bg-[#FF3E1D]/10 rounded-md transition-colors"
                  title="Remove Stat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {stats.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No stats added yet.</p>
            )}
          </div>
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

export default ManageAbout;

