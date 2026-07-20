"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Loader from '../../../components/Loader';
import TestimonialsPreview from '../../home/components/TestimonialsSection';
import LogoUploader from './components/LogoUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

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
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '', confirmText: '', variant: 'danger' });

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
      await api.put('/cms/testimonials', {
        subheading, heading, testimonials
      });
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
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
        },
        {
          id: '2',
          name: 'Rahul Sharma',
          course: 'BBA (2021-2024)',
          quote: '"The practical approach to learning is unmatched here."',
          body: 'The practical approach to learning and the amazing campus life made my time at KSBM unforgettable. The placement cell was instrumental in getting me my dream job right out of college, providing excellent mentorship.',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop'
        },
        {
          id: '3',
          name: 'Priya Patel',
          course: 'MBA (2021-2023)',
          quote: '"A true stepping stone to global corporate opportunities."',
          body: 'KSBM gave me the platform to interact with industry leaders and participate in global competitions. The rigorous curriculum is exactly what the corporate world demands, making the transition seamless and rewarding.',
          image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop',
          avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop'
        }
      ]);
      Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
    }
    });
  };

  const handleConfirmAction = async () => {
    
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        id: Date.now().toString(),
        name: 'New Student',
        course: 'COURSE (YEAR)',
        quote: '"Short impactful quote"',
        body: 'Full testimonial body...',
        image: '',
        avatar: ''
      }
    ]);
  };

  const handleUpdateTestimonial = (id, field, value) => {
    setTestimonials(testimonials.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteTestimonial = async (id) => {
    const updatedTestimonials = testimonials.filter(item => item.id !== id);
    setTestimonials(updatedTestimonials);
    
    try {
      await api.put('/cms/testimonials', {
        subheading, heading, testimonials: updatedTestimonials
      });
      Toast.fire({ icon: 'success', title: 'Testimonial deleted from database.' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      Toast.fire({ icon: 'error', title: 'Failed to delete testimonial from database.' });
      setTestimonials(testimonials); // revert on failure
    }
  };

  if (isLoading) {
    return <Loader theme="light" text="Loading Settings..." />;
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
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center">
            <div className={`bg-white shadow-xl min-h-[500px] transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <TestimonialsPreview previewData={{
                subheading, heading, testimonials
              }} />
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
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Main Heading</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Voices of Success"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1e2869]">Testimonial Items</h3>
            <button
              onClick={handleAddTestimonial}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.map((item, index) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-6 relative group">
                <button
                  onClick={() => handleDeleteTestimonial(item.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-4 w-full md:w-40 shrink-0">
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Main Image</label>
                    <LogoUploader
                      currentLogoUrl={item.image || 'https://via.placeholder.com/150'}
                      onUploadSuccess={(url) => handleUpdateTestimonial(item.id, 'image', url)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Avatar (Thumbnail)</label>
                    <LogoUploader
                      currentLogoUrl={item.avatar || 'https://via.placeholder.com/150'}
                      onUploadSuccess={(url) => handleUpdateTestimonial(item.id, 'avatar', url)}
                    />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Student Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateTestimonial(item.id, 'name', e.target.value)}
                      placeholder="e.g. Priya Patel"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Course & Year</label>
                    <input
                      type="text"
                      value={item.course}
                      onChange={(e) => handleUpdateTestimonial(item.id, 'course', e.target.value)}
                      placeholder="e.g. MBA (2021-2023)"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Short Quote</label>
                    <input
                      type="text"
                      value={item.quote}
                      onChange={(e) => handleUpdateTestimonial(item.id, 'quote', e.target.value)}
                      placeholder="e.g. A true stepping stone to global corporate opportunities."
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Full Testimonial Body</label>
                    <textarea
                      value={item.body}
                      onChange={(e) => handleUpdateTestimonial(item.id, 'body', e.target.value)}
                      rows={3}
                      placeholder="Enter full testimonial here..."
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No testimonials added yet. Click "Add Testimonial" to create one.
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
