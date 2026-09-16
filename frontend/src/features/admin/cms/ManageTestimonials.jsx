"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, GripVertical, User, Quote, GraduationCap, X, Check } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import SingleImageUploader from './components/SingleImageUploader';
import { useDeferredUpload } from '../../../hooks/useDeferredUpload';
import { DEFAULT_TESTIMONIALS } from './constants/defaultCmsData';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const ManageTestimonials = () => {
  const [subheading, setSubheading] = useState('Testimonials');
  const [heading, setHeading] = useState('Voices of Success');
  const [testimonials, setTestimonials] = useState([]);
  const [showSection, setShowSection] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    id: '',
    name: '',
    course: '',
    quote: '',
    body: '',
    image: '',
    avatar: ''
  });

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/testimonials');
      setSubheading(data.subheading || 'Testimonials');
      setHeading(data.heading || 'Voices of Success');
      setTestimonials(data.testimonials || []);
      setShowSection(data.showSection ?? true);
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
          const finalTestimonials = await Promise.all(
            testimonials.map(async (item) => {
              const newItem = { ...item };
              if (newItem.imageFile) {
                const url = await uploadFile(newItem.imageFile, '/upload/home');
                newItem.image = url;
                delete newItem.imageFile;
              }
              if (newItem.avatarFile) {
                const url = await uploadFile(newItem.avatarFile, '/upload/home');
                newItem.avatar = url;
                delete newItem.avatarFile;
              }
              return newItem;
            })
          );

          await api.put('/cms/testimonials', {
            subheading,
            heading,
            testimonials: finalTestimonials,
            showSection
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
      title: 'Reset to Default?',
      message: 'Are you sure you want to reset the Testimonials section to its default content and images? All unsaved modifications will be reverted.',
      confirmText: 'Yes, reset it!',
      variant: 'warning',
      action: () => {
        clearDeletions();
        setSubheading(DEFAULT_TESTIMONIALS.subheading || 'Testimonials');
        setHeading(DEFAULT_TESTIMONIALS.heading || 'Voices of Success');
        setTestimonials(JSON.parse(JSON.stringify(DEFAULT_TESTIMONIALS.testimonials || [])));
        setShowSection(DEFAULT_TESTIMONIALS.showSection ?? true);
        Toast.fire({ icon: 'success', title: 'Reset to default successfully! Click "Save Changes" to apply.' });
      }
    });
  };

  const openAddModal = () => {
    setEditingIndex(-1);
    setCurrentTestimonial({
      id: Date.now().toString(),
      name: '',
      course: '',
      quote: '',
      body: '',
      image: '',
      avatar: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setCurrentTestimonial({ ...testimonials[index] });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!currentTestimonial.name.trim() || !currentTestimonial.body.trim()) {
      Toast.fire({ icon: 'warning', title: 'Please provide at least a name and review body.' });
      return;
    }

    const updated = [...testimonials];
    if (editingIndex >= 0) {
      updated[editingIndex] = { ...currentTestimonial };
    } else {
      updated.push({
        ...currentTestimonial,
        id: currentTestimonial.id || Date.now().toString()
      });
    }

    setTestimonials(updated);
    setIsModalOpen(false);
  };

  const handleDelete = async (index) => {
    await confirmAction({
      title: 'Delete Testimonial?',
      message: 'Are you sure you want to remove this student testimonial?',
      confirmText: 'Yes, delete it!',
      variant: 'danger',
      action: () => {
        const item = testimonials[index];
        if (item.image) markForDeletion(item.image);
        if (item.avatar) markForDeletion(item.avatar);
        const updated = testimonials.filter((_, i) => i !== index);
        setTestimonials(updated);
        Toast.fire({ icon: 'success', title: 'Testimonial removed from list.' });
      }
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const items = [...testimonials];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    setTestimonials(items);
    setDraggedIndex(null);
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Testimonials"
        subtitle="Manage student testimonials, success stories, quotes, and profile images."
        onSave={handleSave}
        onReset={handleResetToDefault}
        previewUrl="/testimonials"
        isSaving={isSaving || isUploading}
      />

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
        {/* Visibility & Headers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Section Settings</h3>
            <p className="text-sm text-gray-500">Configure header text and section visibility.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Show Section</span>
            <button
              type="button"
              onClick={() => setShowSection(!showSection)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showSection ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showSection ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subheading</label>
            <input
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              placeholder="e.g. Testimonials"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Main Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold"
              placeholder="e.g. Voices of Success"
            />
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Student Testimonials ({testimonials.length})</h3>
            <p className="text-sm text-gray-500">Drag items to reorder how they appear on the homepage and testimonials page.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>

        <div className="space-y-4">
          {testimonials.map((item, index) => (
            <div
              key={item.id || index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-move ${
                draggedIndex === index
                  ? 'opacity-50 border-dashed border-primary bg-primary/5'
                  : 'bg-gray-50/50 border-gray-200/80 hover:bg-white hover:border-primary/40 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="pt-2 text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  {item.image || item.avatar ? (
                    <img
                      src={item.image || item.avatar}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-base">{item.name || 'Unnamed Student'}</h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {item.course || 'Student'}
                    </span>
                  </div>
                  {item.quote && (
                    <p className="text-xs font-semibold text-gray-600 italic line-clamp-1">
                      "{item.quote.replace(/^["“]|["”]$/g, '')}"
                    </p>
                  )}
                  <p className="text-xs text-gray-500 line-clamp-2">{item.body}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(index)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  title="Edit Testimonial"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Quote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No testimonials found.</p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-3 text-sm text-primary font-semibold hover:underline"
              >
                Add your first testimonial
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingIndex >= 0 ? 'Edit Testimonial' : 'Add Testimonial'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Fill in student details and quote</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={currentTestimonial.name}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm"
                    placeholder="e.g. Fathimathul Haifa"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Course / Batch *
                  </label>
                  <input
                    type="text"
                    value={currentTestimonial.course}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, course: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm"
                    placeholder="e.g. MBA (2025-2027)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Highlight Quote / Headline
                </label>
                <input
                  type="text"
                  value={currentTestimonial.quote}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, quote: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  placeholder="e.g. Learning today, building memories for a lifetime."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Detailed Story / Review *
                </label>
                <textarea
                  rows={4}
                  value={currentTestimonial.body}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, body: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                  placeholder="Share the full experience at KSBM..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Card Photo
                  </label>
                  <SingleImageUploader
                    imageUrl={currentTestimonial.image}
                    onUploadComplete={(url) => setCurrentTestimonial({ ...currentTestimonial, image: url })}
                    onUploadStateChange={setIsUploading}
                    uploadEndpoint="/upload/home"
                    label="Upload Photo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Avatar Thumbnail (Optional)
                  </label>
                  <SingleImageUploader
                    imageUrl={currentTestimonial.avatar}
                    onUploadComplete={(url) => setCurrentTestimonial({ ...currentTestimonial, avatar: url })}
                    onUploadStateChange={setIsUploading}
                    uploadEndpoint="/upload/home"
                    label="Upload Avatar"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm shadow-sm"
              >
                {editingIndex >= 0 ? 'Update Testimonial' : 'Add to List'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
