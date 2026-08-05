"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import SingleImageUploader from './components/SingleImageUploader';
import PageHeader from './components/PageHeader';
import AdminItemCard from './components/AdminItemCard';
import AdminModal from './components/AdminModal';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ManageInstitutionalResources = () => {
  const [institutionalResources, setInstitutionalResources] = useState({ heading: '', description: '', showSection: true });
  const [library, setLibrary] = useState({ heading: '', description: '', description2: '', mainImage: '', thumbnails: ['', '', ''] });
  const [otherResources, setOtherResources] = useState({ heading: '', items: [] });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, index: -1, data: null });
  
  // To switch between Main Resource and Other Resources forms
  const [activeTab, setActiveTab] = useState('heading');
  
  const iframeRef = React.useRef(null);

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      const payload = {
        type: 'LIVE_PREVIEW_UPDATE',
        data: {
          institutionalResources,
          library,
          otherResources
        },
        activeTab: 'resources'
      };
      
      const sendUpdate = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(payload, '*');
        }
      };

      sendUpdate();

      const handleMessage = (e) => {
        if (e.data?.type === 'iframe-ready') {
          sendUpdate();
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isPreviewModalOpen, institutionalResources, library, otherResources]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/facilities-page');
      if (data) {
        if (data.institutionalResources) {
          setInstitutionalResources({
            heading: data.institutionalResources.heading || 'Institutional Resources',
            description: data.institutionalResources.description || 'At KSBM, we believe that a great learning experience begins with an inspiring environment. Our modern campus is thoughtfully designed to support academic excellence, innovation, and holistic student development. From technology-enabled classrooms to dedicated learning spaces, every facility empowers students to learn, collaborate, and grow with confidence.'
          });
        } else {
          setInstitutionalResources({
            heading: 'Institutional Resources',
            description: 'At KSBM, we believe that a great learning experience begins with an inspiring environment. Our modern campus is thoughtfully designed to support academic excellence, innovation, and holistic student development. From technology-enabled classrooms to dedicated learning spaces, every facility empowers students to learn, collaborate, and grow with confidence.'
          });
        }
        if (data.library) {
          const thumbs = data.library.thumbnails || [];
          setLibrary({
            ...data.library,
            thumbnails: [thumbs[0] || '', thumbs[1] || '', thumbs[2] || '']
          });
        }
        if (data.otherResources) {
          setOtherResources(data.otherResources);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate that all items have required fields
    const invalidItems = otherResources.items.filter(item => !item.title || item.title.trim() === '');
    if (invalidItems.length > 0) {
      Toast.fire({ icon: 'error', title: 'Validation Error', text: 'All resource items must have a title.' });
      return;
    }

    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          const processImage = async (imgObj) => {
            if (!imgObj) return '';
            if (typeof imgObj === 'string') return imgObj;
            if (imgObj.file) {
              const formData = new FormData();
              formData.append('image', imgObj.file);
              const res = await api.post('/upload/facilities', formData, { 
                headers: { 'Content-Type': 'multipart/form-data' }, 
                hideLoader: true 
              });
              return res.data.url;
            }
            if (imgObj.isDeleted) {
              if (imgObj.oldUrl && typeof imgObj.oldUrl === 'string' && imgObj.oldUrl !== imgObj.previewUrl && !imgObj.oldUrl.startsWith('blob:') && !imgObj.oldUrl.startsWith('http')) {
                try {
                  await api.delete('/upload', { data: { fileUrl: imgObj.oldUrl }, hideLoader: true });
                } catch(err) {
                  console.warn('Failed to delete physical image', err);
                }
              }
              return imgObj.previewUrl || '';
            }
            return '';
          };

          const finalLibrary = {
            ...library,
            mainImage: await processImage(library.mainImage),
            thumbnails: await Promise.all((library.thumbnails || []).map(processImage))
          };

          const finalOtherResources = {
            ...otherResources,
            items: await Promise.all(otherResources.items.map(async (item) => {
              return {
                ...item,
                image: await processImage(item.image),
                thumbnails: await Promise.all((item.thumbnails || []).map(processImage))
              };
            }))
          };

          await api.put('/cms/facilities-page', { institutionalResources, library: finalLibrary, otherResources: finalOtherResources });
          
          setLibrary(finalLibrary);
          setOtherResources(finalOtherResources);
          
          Toast.fire({ icon: 'success', title: 'Institutional Resources saved successfully!' });
        } catch (error) {
          const errMsg = error.response?.data?.error || error.response?.data?.message || error.message;
          console.warn('Error saving settings: ' + errMsg);
          Toast.fire({ icon: 'error', title: 'Failed to save settings: ' + errMsg });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset your settings to original state. You still need to click "Save Changes".',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setInstitutionalResources({
          heading: 'Institutional Resources',
          description: 'At KSBM, we believe that a great learning experience begins with an inspiring environment. Our modern campus is thoughtfully designed to support academic excellence, innovation, and holistic student development. From technology-enabled classrooms to dedicated learning spaces, every facility empowers students to learn, collaborate, and grow with confidence.'
        });
        setLibrary({
          heading: 'Library',
          description: 'The KSBM Library serves as a dynamic hub, supporting students, faculty, and researchers with a rich collection of academic resources.',
          description2: 'With an extensive collection of books, journals, and digital resources, the library provides a conducive environment.',
          mainImage: '/assets/Images/fecilities/library_main.jpg',
          thumbnails: [
            '/assets/Images/fecilities/facility_1.jpg',
            '/assets/Images/fecilities/facility_2.jpg',
            '/assets/Images/fecilities/facility_3.jpg'
          ]
        });
        setOtherResources({
          heading: 'Other Resources',
          items: [
            { 
              title: 'Classrooms', 
              image: '/assets/Images/fecilities/classrooms_main.jpg',
              thumbnails: ['/assets/Images/fecilities/facility_4.jpg', '/assets/Images/fecilities/facility_5.jpg', '/assets/Images/fecilities/facility_6.jpg']
            },
            { 
              title: 'Cafeteria', 
              image: '/assets/Images/fecilities/cafeteria_main.jpg',
              thumbnails: ['/assets/Images/fecilities/life_1.jpg', '/assets/Images/fecilities/life_2.jpg', '/assets/Images/fecilities/life_3.jpg']
            },
            { 
              title: 'Hostel', 
              image: '/assets/Images/fecilities/hostel_main.jpg',
              thumbnails: ['/assets/Images/fecilities/life_4.jpg', '/assets/Images/fecilities/life_5.jpg', '/assets/Images/fecilities/life_6.jpg']
            },
            { 
              title: 'Computer Lab', 
              image: '/assets/Images/fecilities/computer_lab_main.jpg',
              thumbnails: ['/assets/Images/fecilities/life_7.jpg', '/assets/Images/fecilities/life_8.jpg', '/assets/Images/fecilities/facility_1.jpg']
            }
          ]
        });
        Toast.fire({ icon: 'info', title: 'Settings reset to default.' });
      }
    });
  };

  // Other Resources Handlers
  const openModal = (index = -1) => {
    if (index >= 0) {
      setModalConfig({ isOpen: true, index, data: { ...otherResources.items[index] } });
    } else {
      setModalConfig({ isOpen: true, index: -1, data: { title: '', image: '', description: '', description2: '', thumbnails: ['', '', ''] } });
    }
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, index: -1, data: null });
  };

  const saveModal = () => {
    const { index, data } = modalConfig;
    const newItems = [...otherResources.items];
    
    if (index >= 0) newItems[index] = data;
    else newItems.push(data);
    
    setOtherResources({ ...otherResources, items: newItems });
    closeModal();
  };

  const removeItem = async (index) => {
    await confirmAction({
      title: 'Remove Resource?',
      message: 'Are you sure you want to remove this resource item?',
      confirmText: 'Yes, remove it',
      variant: 'danger',
      action: async () => {
        const newItems = [...otherResources.items];
        newItems.splice(index, 1);
        setOtherResources({ ...otherResources, items: newItems });
      }
    });
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Institutional Resources"
        description="Manage the Library and Other Resources sections."
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
              <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <Monitor className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <Tablet className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <div 
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
                previewMode === 'mobile' ? 'w-[375px] h-[812px]' :
                previewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
                'w-full h-full'
              }`}
            >
              <iframe
                ref={iframeRef}
                src="/facilities"
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('heading')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'heading'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          Section Heading
        </button>
        <button
          onClick={() => setActiveTab('main')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'main'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          Main Resource (Library)
        </button>
        <button
          onClick={() => setActiveTab('others')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'others'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          Other Resources Grid
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        {activeTab === 'heading' ? (
          <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1e2869]">Visibility Settings</h3>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={institutionalResources.showSection !== false}
                    onChange={(e) => setInstitutionalResources({ ...institutionalResources, showSection: e.target.checked })}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${institutionalResources.showSection !== false ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${institutionalResources.showSection !== false ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {institutionalResources.showSection !== false ? 'Visible' : 'Hidden'}
                </span>
              </label>
            </div>
            
            <h3 className="text-lg font-bold text-[#1e2869] mb-6">Section Heading Content</h3>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  maxLength={50}
                  value={institutionalResources.heading || ''}
                  onChange={(e) => setInstitutionalResources({ ...institutionalResources, heading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{(institutionalResources.heading || '').length}/50 characters</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows="5"
                  maxLength={360}
                  value={institutionalResources.description || ''}
                  onChange={(e) => setInstitutionalResources({ ...institutionalResources, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{(institutionalResources.description || '').length}/360 characters</div>
              </div>
            </div>
          </div>
        ) : activeTab === 'main' ? (
          <div>
            <h3 className="text-lg font-bold text-[#1e2869] mb-6">Main Resource (Library) Content</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Heading</label>
                <input
                  type="text"
                  maxLength={50}
                  value={library.heading}
                  onChange={(e) => setLibrary({ ...library, heading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{(library.heading || '').length}/50 characters</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description Paragraph 1</label>
                  <textarea
                    rows="4"
                    maxLength={400}
                    value={library.description}
                    onChange={(e) => setLibrary({ ...library, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{(library.description || '').length}/400 characters</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description Paragraph 2</label>
                  <textarea
                    rows="4"
                    maxLength={400}
                    value={library.description2}
                    onChange={(e) => setLibrary({ ...library, description2: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{(library.description2 || '').length}/400 characters</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Image</label>
                <SingleImageUploader 
                  imageUrl={library.mainImage} 
                  defaultImage="/assets/Images/fecilities/library_main.jpg"
                  deferredUpload={true}
                  uploadEndpoint="/upload/facilities"
                  onUploadComplete={(url) => setLibrary({ ...library, mainImage: url })}
                  onUploadStateChange={setIsUploading}
                  label="Upload Main Image"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Thumbnail Images (3 required)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map(idx => (
                    <div key={idx} className="space-y-2">
                      <SingleImageUploader 
                        imageUrl={library.thumbnails[idx]} 
                        defaultImage={`/assets/Images/fecilities/facility_${idx + 1}.jpg`}
                        deferredUpload={true}
                        uploadEndpoint="/upload/facilities"
                        onUploadComplete={(url) => {
                          const newThumbs = [...library.thumbnails];
                          newThumbs[idx] = url;
                          setLibrary({ ...library, thumbnails: newThumbs });
                        }}
                        onUploadStateChange={setIsUploading}
                        label={`Thumbnail ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-[#1e2869] mb-6">Other Resources Grid</h3>
            <div className="space-y-6">
              <div className="max-w-2xl">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Grid Heading</label>
                <input
                  type="text"
                  maxLength={50}
                  value={otherResources.heading}
                  onChange={(e) => setOtherResources({ ...otherResources, heading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  placeholder="e.g. Other Resources"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{(otherResources.heading || '').length}/50 characters</div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">Resource Items</label>
                  <button onClick={() => openModal()} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all">
                    <Plus className="w-4 h-4 mr-1" /> Add Resource
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {otherResources.items.map((item, idx) => (
                      <AdminItemCard
                        key={idx}
                        title={item.title || `Resource #${idx + 1}`}
                        onDelete={() => removeItem(idx)}
                      >
                        <div className="flex gap-4 p-4 items-start">
                          {item.image ? (
                            <img src={typeof item.image === 'object' ? item.image.previewUrl : item.image} alt={item.title} className="w-16 h-16 rounded object-cover border border-gray-200" />
                          ) : (
                            <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">No Image</div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-xs text-gray-500 line-clamp-2">{item.description || 'No description provided.'}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-200/60 flex gap-2">
                          <button
                            onClick={() => openModal(idx)}
                            className="flex-1 inline-flex items-center justify-center text-primary hover:bg-primary/10 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-primary/20"
                          >
                            Edit Details
                          </button>
                        </div>
                      </AdminItemCard>
                    ))}
                  </div>
                  {otherResources.items.length === 0 && (
                    <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No resources added yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AdminModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.index >= 0 ? 'Edit Resource' : 'Add Resource'}
        onSave={saveModal}
        isSaveDisabled={
          !modalConfig.data?.title?.trim() ||
          !modalConfig.data?.description?.trim() ||
          !modalConfig.data?.image
        }
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title / Heading <span className="text-red-500">*</span></label>
              <input
                type="text"
                maxLength={50}
                value={modalConfig.data?.title || ''}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, title: e.target.value } })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Classrooms"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{(modalConfig.data?.title || '').length}/50 characters</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description Paragraph 1 <span className="text-red-500">*</span></label>
              <textarea
                rows="3"
                maxLength={400}
                value={modalConfig.data?.description || ''}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, description: e.target.value } })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{(modalConfig.data?.description || '').length}/400 characters</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description Paragraph 2 (Optional)</label>
              <textarea
                rows="3"
                maxLength={400}
                value={modalConfig.data?.description2 || ''}
                onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, description2: e.target.value } })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{(modalConfig.data?.description2 || '').length}/400 characters</div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Main Image <span className="text-red-500">*</span></label>
              <SingleImageUploader 
                imageUrl={modalConfig.data?.image || ''} 
                defaultImage={modalConfig.data?.title === 'Classrooms' ? '/assets/Images/fecilities/classrooms_main.jpg' : 
                              modalConfig.data?.title === 'Cafeteria' ? '/assets/Images/fecilities/cafeteria_main.jpg' : 
                              modalConfig.data?.title === 'Hostel' ? '/assets/Images/fecilities/hostel_main.jpg' : 
                              modalConfig.data?.title === 'Computer Lab' ? '/assets/Images/fecilities/computer_lab_main.jpg' : '/assets/Images/fecilities/facility_1.jpg'}
                deferredUpload={true}
                uploadEndpoint="/upload/facilities"
                onUploadComplete={(url) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, image: url } })}
                onUploadStateChange={setIsUploading}
                label="Upload Main Image"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Thumbnails</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[0, 1, 2].map(thumbIdx => {
                  const defaultThumbs = modalConfig.data?.title === 'Classrooms' ? ['/assets/Images/fecilities/facility_4.jpg', '/assets/Images/fecilities/facility_5.jpg', '/assets/Images/fecilities/facility_6.jpg'] :
                                        modalConfig.data?.title === 'Cafeteria' ? ['/assets/Images/fecilities/life_1.jpg', '/assets/Images/fecilities/life_2.jpg', '/assets/Images/fecilities/life_3.jpg'] :
                                        modalConfig.data?.title === 'Hostel' ? ['/assets/Images/fecilities/life_4.jpg', '/assets/Images/fecilities/life_5.jpg', '/assets/Images/fecilities/life_6.jpg'] :
                                        modalConfig.data?.title === 'Computer Lab' ? ['/assets/Images/fecilities/life_7.jpg', '/assets/Images/fecilities/life_8.jpg', '/assets/Images/fecilities/facility_1.jpg'] :
                                        ['/assets/Images/fecilities/facility_1.jpg', '/assets/Images/fecilities/facility_2.jpg', '/assets/Images/fecilities/facility_3.jpg'];
                  return (
                    <SingleImageUploader 
                      key={thumbIdx}
                      imageUrl={(modalConfig.data?.thumbnails || ['', '', ''])[thumbIdx]} 
                      defaultImage={defaultThumbs[thumbIdx]}
                      deferredUpload={true}
                      uploadEndpoint="/upload/facilities"
                      onUploadComplete={(url) => {
                        const newThumbs = [...(modalConfig.data?.thumbnails || ['', '', ''])];
                        newThumbs[thumbIdx] = url;
                        setModalConfig({ ...modalConfig, data: { ...modalConfig.data, thumbnails: newThumbs } });
                      }}
                      onUploadStateChange={setIsUploading}
                      label={`Thumb ${thumbIdx + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default ManageInstitutionalResources;
