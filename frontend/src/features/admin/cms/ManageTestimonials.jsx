"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AdminSkeleton from './components/AdminSkeleton';
import TestimonialsPreview from '../../home/components/TestimonialsSection';
import LogoUploader from './components/LogoUploader';
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

const ManageTestimonials = () => {
  const [subheading, setSubheading] = useState('');
  const [heading, setHeading] = useState('');
  const [testimonials, setTestimonials] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = React.useRef(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger' });
  
  // Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState(-1);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/testimonials');
      setSubheading(data.subheading || '');
      setHeading(data.heading || '');
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load testimonials settings.' });
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
          const finalTestimonials = await Promise.all(testimonials.map(async (item) => {
            let newItem = { ...item };
            if (newItem.imageFile) {
              const url = await uploadFile(newItem.imageFile);
              newItem.image = url;
              delete newItem.imageFile;
            }
            if (newItem.avatarFile) {
              const url = await uploadFile(newItem.avatarFile);
              newItem.avatar = url;
              delete newItem.avatarFile;
            }
            return newItem;
          }));

          await api.put('/cms/testimonials', {
            subheading, heading, testimonials: finalTestimonials
          });

          await executeDeletions();
          setTestimonials(finalTestimonials);
          Toast.fire({ icon: 'success', title: 'Testimonials section saved successfully!' });
        } catch (error) {
          console.error('Error saving testimonials settings:', error);
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
      setSubheading('Testimonials');
      setHeading('Voices of Success');
      setTestimonials([
        {
          id: '1',
          name: 'Anjali Menon',
          course: 'MBA (2022-2024)',
          quote: '"KSBM transformed my potential into professional success."',
          body: 'From interactive classroom sessions to industry-oriented projects, every experience prepared me for real business challenges. The faculty, placement team, and supportive learning environment helped me grow both professionally and personally, giving me the confidence to excel in the corporate world.',
          image: '/assets/Images/Home/testimonial_1.jpg',
          avatar: '/assets/Images/Home/testimonial_1.jpg'
        },
        {
          id: '2',
          name: 'Rahul Sharma',
          course: 'BBA (2021-2024)',
          quote: '"The practical approach to learning is unmatched here."',
          body: 'The practical approach to learning and the amazing campus life made my time at KSBM unforgettable. The placement cell was instrumental in getting me my dream job right out of college, providing excellent mentorship.',
          image: '/assets/Images/Home/testimonial_2.jpg',
          avatar: '/assets/Images/Home/testimonial_2.jpg'
        },
        {
          id: '3',
          name: 'Priya Patel',
          course: 'MBA (2021-2023)',
          quote: '"A true stepping stone to global corporate opportunities."',
          body: 'KSBM gave me the platform to interact with industry leaders and participate in global competitions. The rigorous curriculum is exactly what the corporate world demands, making the transition seamless and rewarding.',
          image: '/assets/Images/Home/testimonial_3.jpg',
          avatar: '/assets/Images/Home/testimonial_3.jpg'
        }
      ]);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // Modal Handlers
  const openAddTestimonialModal = () => {
    setEditingTestimonialIndex(-1);
    setCurrentTestimonial({ id: `test-${Date.now()}`, name: '', course: '', quote: '', body: '', image: '', avatar: '' });
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonialModal = (index) => {
    setEditingTestimonialIndex(index);
    setCurrentTestimonial({ ...testimonials[index] });
    setIsTestimonialModalOpen(true);
  };

  const closeTestimonialModal = () => {
    setIsTestimonialModalOpen(false);
    setCurrentTestimonial(null);
  };

  const saveTestimonialFromModal = async () => {
    if (!currentTestimonial.name?.trim() || !currentTestimonial.course?.trim() || !currentTestimonial.quote?.trim() || !currentTestimonial.body?.trim() || !currentTestimonial.image || !currentTestimonial.avatar) {
      Toast.fire({ icon: 'error', title: 'All fields and both images are required' });
      return;
    }

    await confirmAction({
      title: editingTestimonialIndex === -1 ? 'Add Testimonial?' : 'Update Testimonial?',
      message: 'Are you sure you want to save these details?',
      confirmText: 'Yes, save it',
      variant: 'primary',
      action: async () => {
        const newItems = [...testimonials];
        if (editingTestimonialIndex === -1) {
          newItems.unshift(currentTestimonial);
        } else {
          newItems[editingTestimonialIndex] = currentTestimonial;
        }
        setTestimonials(newItems);
        closeTestimonialModal();
        Toast.fire({ icon: 'info', title: 'Testimonial updated locally. Click Save Changes to apply.' });
      }
    });
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (dragIndex === dropIndex) return;

    const newItems = [...testimonials];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setTestimonials(newItems);
  };

  const handleDeleteTestimonial = async (id) => {
    await confirmAction({
      title: 'Remove Testimonial?',
      message: 'Are you sure you want to remove this testimonial?',
      confirmText: 'Yes, remove it',
      variant: 'danger',
      action: async () => {
        const testimonialToDelete = testimonials.find(item => item.id === id);
        if (testimonialToDelete) {
          markForDeletion(testimonialToDelete.image);
          markForDeletion(testimonialToDelete.avatar);
        }

        let newTestimonials = testimonials.filter(item => item.id !== id);

        const defaultTestimonials = [
          {
            id: '1',
            name: 'Anjali Menon',
            course: 'MBA (2022-2024)',
            quote: '"KSBM transformed my potential into professional success."',
            body: 'From interactive classroom sessions to industry-oriented projects, every experience prepared me for real business challenges. The faculty, placement team, and supportive learning environment helped me grow both professionally and personally, giving me the confidence to excel in the corporate world.',
            image: '/assets/Images/Home/testimonial_1.jpg',
            avatar: '/assets/Images/Home/testimonial_1.jpg'
          },
          {
            id: '2',
            name: 'Rahul Sharma',
            course: 'BBA (2021-2024)',
            quote: '"The practical approach to learning is unmatched here."',
            body: 'The practical approach to learning and the amazing campus life made my time at KSBM unforgettable. The placement cell was instrumental in getting me my dream job right out of college, providing excellent mentorship.',
            image: '/assets/Images/Home/testimonial_2.jpg',
            avatar: '/assets/Images/Home/testimonial_2.jpg'
          },
          {
            id: '3',
            name: 'Priya Patel',
            course: 'MBA (2021-2023)',
            quote: '"A true stepping stone to global corporate opportunities."',
            body: 'KSBM gave me the platform to interact with industry leaders and participate in global competitions. The rigorous curriculum is exactly what the corporate world demands, making the transition seamless and rewarding.',
            image: '/assets/Images/Home/testimonial_3.jpg',
            avatar: '/assets/Images/Home/testimonial_3.jpg'
          }
        ];

        while (newTestimonials.length < 3) {
          const availableDefault = defaultTestimonials.find(
            defItem => !newTestimonials.some(t => t.id === defItem.id || t.name === defItem.name)
          );
          if (availableDefault) {
            newTestimonials.push(availableDefault);
          } else {
            break;
          }
        }

        setTestimonials(newTestimonials);
        Toast.fire({ icon: 'info', title: 'Testimonial deleted locally. Click Save Changes to apply.' });
      }
    });
  };

  useEffect(() => {
    if (isPreviewModalOpen) {
      const pData = {
        subheading, heading, testimonials,
        previewDevice: previewMode
      };
      const handleIframeReady = (e) => {
        if (e.data?.type === 'iframe-ready' && e.data?.source === 'testimonials' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-testimonials-data', payload: pData }, '*');
        }
      };
      window.addEventListener('message', handleIframeReady);
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-testimonials-data', payload: pData }, '*');
        }
      }, 500);
      return () => window.removeEventListener('message', handleIframeReady);
    }
  }, [isPreviewModalOpen, previewMode, subheading, heading, testimonials]);

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Testimonials Settings"
        description="Manage student voices and feedback displayed on the home page."
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
                src="/preview/testimonials"
                className="w-full h-full border-0"
                title="Testimonials Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Add/Edit Modal */}
      {isTestimonialModalOpen && currentTestimonial && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#566A7F]">
                {editingTestimonialIndex === -1 ? 'Add New Testimonial' : 'Edit Testimonial'}
              </h2>
              <button
                onClick={closeTestimonialModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Student Name</label>
                  <input
                    type="text"
                    value={currentTestimonial.name}
                    onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
                    placeholder="e.g. Priya Patel"
                    maxLength={25}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentTestimonial.name?.length || 0} / 25
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Course & Year</label>
                  <input
                    type="text"
                    value={currentTestimonial.course}
                    onChange={(e) => setCurrentTestimonial({...currentTestimonial, course: e.target.value})}
                    placeholder="e.g. MBA (2021-2023)"
                    maxLength={20}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentTestimonial.course?.length || 0} / 20
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Short Quote</label>
                  <input
                    type="text"
                    value={currentTestimonial.quote}
                    onChange={(e) => setCurrentTestimonial({...currentTestimonial, quote: e.target.value})}
                    placeholder="e.g. A true stepping stone to global corporate opportunities."
                    maxLength={70}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentTestimonial.quote?.length || 0} / 70
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Full Testimonial Body</label>
                  <textarea
                    value={currentTestimonial.body}
                    onChange={(e) => setCurrentTestimonial({...currentTestimonial, body: e.target.value})}
                    rows={3}
                    placeholder="Enter full testimonial here..."
                    maxLength={250}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentTestimonial.body?.length || 0} / 250
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Avatar (Thumbnail)</label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-[#D9DEE3]">
                      <LogoUploader
                        currentLogoUrl={currentTestimonial.avatar}
                        onUploadSuccess={(url, file) => {
                          if (file) {
                            if (currentTestimonial.avatar) markForDeletion(currentTestimonial.avatar);
                            setCurrentTestimonial({...currentTestimonial, avatar: url, avatarFile: file});
                          }
                        }}
                        deferredMode={true}
                        disableDelete={true}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Main Image (Hover)</label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-[#D9DEE3]">
                      <LogoUploader
                        currentLogoUrl={currentTestimonial.image}
                        onUploadSuccess={(url, file) => {
                          if (file) {
                            if (currentTestimonial.image) markForDeletion(currentTestimonial.image);
                            setCurrentTestimonial({...currentTestimonial, image: url, imageFile: file});
                          }
                        }}
                        deferredMode={true}
                        disableDelete={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeTestimonialModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveTestimonialFromModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2869] mb-4">Header Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Subheading</label>
              <input
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. Testimonials"
                maxLength={20}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {subheading?.length || 0} / 20
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Main Heading</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Voices of Success"
                maxLength={30}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {heading?.length || 0} / 30
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1e2869]">Testimonial Items</h3>
            <button
              onClick={openAddTestimonialModal}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="h-32 bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest font-semibold">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded cursor-move shadow-sm group-hover:bg-white transition-colors">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    {item.avatar ? (
                      <img src={item.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    )}
                    <div>
                      <h4 className="font-bold text-[#566A7F] text-sm line-clamp-1">{item.name || '(Unnamed)'}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.course}</p>
                    </div>
                  </div>
                  <p className="text-sm italic text-gray-600 line-clamp-3 flex-1">"{item.quote}"</p>
                  
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditTestimonialModal(index)}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {testimonials.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 mb-2">No testimonials added yet.</p>
                <button
                  onClick={openAddTestimonialModal}
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Click here to add your first testimonial
                </button>
              </div>
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

export default ManageTestimonials;
