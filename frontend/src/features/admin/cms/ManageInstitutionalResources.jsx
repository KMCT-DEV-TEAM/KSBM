"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import InstitutionalResourcesSection from '../../facilities/components/InstitutionalResourcesSection';
import confirmAction from '../../../utils/confirmAction';
import SingleImageUploader from './components/SingleImageUploader';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ManageInstitutionalResources = () => {
  const [institutionalResources, setInstitutionalResources] = useState({ heading: '', description: '' });
  const [library, setLibrary] = useState({ heading: '', description: '', description2: '', mainImage: '', thumbnails: ['', '', ''] });
  const [otherResources, setOtherResources] = useState({ heading: '', items: [] });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  // To switch between Main Resource and Other Resources forms
  const [activeTab, setActiveTab] = useState('heading');

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
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/facilities-page', { institutionalResources, library, otherResources });
          Toast.fire({ icon: 'success', title: 'Institutional Resources saved successfully!' });
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
          mainImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2030&auto=format&fit=crop',
          thumbnails: ['', '', '']
        });
        setOtherResources({
          heading: 'Other Resources',
          items: [
            { title: 'Classrooms', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop' },
            { title: 'Cafeteria', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop' },
            { title: 'Hostel', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop' },
            { title: 'Computer Lab', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' }
          ]
        });
        Toast.fire({ icon: 'info', title: 'Settings reset to default.' });
      }
    });
  };

  // Other Resources Handlers
  const handleItemChange = (index, field, value) => {
    const newItems = [...otherResources.items];
    newItems[index][field] = value;
    setOtherResources({ ...otherResources, items: newItems });
  };

  const addItem = () => {
    setOtherResources({ ...otherResources, items: [...otherResources.items, { title: '', image: '', description: '', description2: '', thumbnails: ['', '', ''] }] });
  };

  const removeItem = (index) => {
    const newItems = [...otherResources.items];
    newItems.splice(index, 1);
    setOtherResources({ ...otherResources, items: newItems });
  };

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

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
          <div className="flex-1 bg-white overflow-x-auto relative p-4 flex justify-center py-12">
            <div className={`transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <InstitutionalResourcesSection headerData={institutionalResources} libraryData={library} otherResourcesData={otherResources} />
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
            <h3 className="text-lg font-bold text-[#1e2869] mb-6">Section Heading Content</h3>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={institutionalResources.heading || ''}
                  onChange={(e) => setInstitutionalResources({ ...institutionalResources, heading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows="5"
                  value={institutionalResources.description || ''}
                  onChange={(e) => setInstitutionalResources({ ...institutionalResources, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                />
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
                  value={library.heading}
                  onChange={(e) => setLibrary({ ...library, heading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description Paragraph 1</label>
                  <textarea
                    rows="4"
                    value={library.description}
                    onChange={(e) => setLibrary({ ...library, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description Paragraph 2</label>
                  <textarea
                    rows="4"
                    value={library.description2}
                    onChange={(e) => setLibrary({ ...library, description2: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Image</label>
                <SingleImageUploader 
                  imageUrl={library.mainImage} 
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
                  value={otherResources.heading}
                  onChange={(e) => setOtherResources({ ...otherResources, heading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  placeholder="e.g. Other Resources"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">Resource Items</label>
                  <button onClick={addItem} className="text-sm font-semibold text-primary flex items-center bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                    <Plus className="w-4 h-4 mr-1" /> Add Resource
                  </button>
                </div>
                
                <div className="space-y-6">
                  {otherResources.items.map((item, idx) => (
                    <div key={idx} className="p-6 border border-gray-200 rounded-xl bg-gray-50 relative group transition-colors hover:border-gray-300">
                      <button onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors bg-white rounded p-1 shadow-sm">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title / Heading</label>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary/20"
                              placeholder="e.g. Classrooms"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description Paragraph 1</label>
                            <textarea
                              rows="3"
                              value={item.description || ''}
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description Paragraph 2</label>
                            <textarea
                              rows="3"
                              value={item.description2 || ''}
                              onChange={(e) => handleItemChange(idx, 'description2', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Main Image</label>
                            <SingleImageUploader 
                              imageUrl={item.image || ''} 
                              onUploadComplete={(url) => handleItemChange(idx, 'image', url)}
                              onUploadStateChange={setIsUploading}
                              label="Upload Main Image"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Thumbnails</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {[0, 1, 2].map(thumbIdx => (
                                <SingleImageUploader 
                                  key={thumbIdx}
                                  imageUrl={(item.thumbnails || ['', '', ''])[thumbIdx]} 
                                  onUploadComplete={(url) => {
                                    const newItems = [...otherResources.items];
                                    const newThumbs = [...(newItems[idx].thumbnails || ['', '', ''])];
                                    newThumbs[thumbIdx] = url;
                                    newItems[idx].thumbnails = newThumbs;
                                    setOtherResources({ ...otherResources, items: newItems });
                                  }}
                                  onUploadStateChange={setIsUploading}
                                  label={`Thumb ${thumbIdx + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
    </div>
  );
};

export default ManageInstitutionalResources;
