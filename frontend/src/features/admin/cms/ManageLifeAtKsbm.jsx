import React, { useState, useEffect } from 'react';
import { Eye, Save, Monitor, Tablet, Smartphone, X, RefreshCw, Upload, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import LifeAtKSBMSectionPreview from '../../home/components/LifeAtKSBMSection';
import SectionForm from './components/SectionForm';
import PageHeader from './components/PageHeader';
import confirmAction from '../../../utils/confirmAction';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageLifeAtKsbm = () => {
  const [subheading, setSubheading] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  
  const [showSubheading, setShowSubheading] = useState(true);
  const [showHeading, setShowHeading] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [showSection, setShowSection] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/life-at-ksbm');
      setSubheading(data.subheading || '');
      setHeading(data.heading || '');
      setDescription(data.description || '');
      setImages(data.images || []);
      
      setShowSubheading(data.showSubheading ?? true);
      setShowHeading(data.showHeading ?? true);
      setShowDescription(data.showDescription ?? true);
      setShowImages(data.showImages ?? true);
      setShowSection(data.showSection ?? true);
    } catch (error) {
      console.error('Error fetching Life at KSBM settings:', error);
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
      await api.put('/cms/life-at-ksbm', {
        subheading, heading, description, images,
        showSubheading, showHeading, showDescription, showImages, showSection
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
    // Reset to defaults...
    const defaults = {
      subheading: 'Life at KSBM',
      heading: 'Beyond the Classroom',
      description: 'Experience a vibrant campus life that nurtures leadership, creativity, and lifelong connections through diverse clubs, cultural festivals, and community initiatives.',
      images: [
        { src: '/assets/Images/Home/life_at_ksbm_1.jpg', alt: 'Students in cafe' },
        { src: '/assets/Images/Home/life_at_ksbm_2.jpg', alt: 'Students jumping' },
        { src: '/assets/Images/Home/life_at_ksbm_3.jpg', alt: 'Campus festival' },
        { src: '/assets/Images/Home/life_at_ksbm_4.jpg', alt: 'Meeting room' },
        { src: '/assets/Images/Home/life_at_ksbm_5.jpg', alt: 'Selfie' },
        { src: '/assets/Images/Home/life_at_ksbm_6.jpg', alt: 'Dining hall' },
        { src: '/assets/Images/Home/life_at_ksbm_7.jpg', alt: 'Outdoor gathering' },
        { src: '/assets/Images/Home/life_at_ksbm_8.jpg', alt: 'Campus gate' }
      ],
      showSubheading: true,
      showHeading: true,
      showDescription: true,
      showImages: true,
      showSection: true,
    };
    setSubheading(defaults.subheading);
    setHeading(defaults.heading);
    setDescription(defaults.description);
    setImages(defaults.images);
    setShowSubheading(defaults.showSubheading);
    setShowHeading(defaults.showHeading);
    setShowDescription(defaults.showDescription);
    setShowImages(defaults.showImages);
    setShowSection(defaults.showSection);
    Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
  };

  const handleNewImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/home', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.url) {
        setImages([...images, { src: response.data.url, alt: 'Gallery Image' }]);
        Toast.fire({ icon: 'success', title: 'Image uploaded successfully' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Toast.fire({ icon: 'error', title: 'Failed to upload image' });
    }
  };

  const removeImage = async (index) => {
    const imgToRemove = images[index];
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    if (imgToRemove.src && imgToRemove.src.startsWith('/assets/Images/Home/')) {
      try {
        await api.delete('/upload', { data: { fileUrl: imgToRemove.src } });
      } catch (error) {
        console.error('Failed to delete image from server', error);
      }
    }
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader 
        title="Life at KSBM Settings" 
        description="Manage the Life at KSBM grid content and images." 
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
              <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-400'}`}><Monitor className="w-4 h-4" /></button>
              <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-400'}`}><Tablet className="w-4 h-4" /></button>
              <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-400'}`}><Smartphone className="w-4 h-4" /></button>
            </div>
            <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center">
            <div className={`bg-white shadow-xl min-h-[500px] transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <LifeAtKSBMSectionPreview previewData={{ subheading, heading, description, images, showSubheading, showHeading, showDescription, showImages, showSection, previewDevice: previewMode }} />
            </div>
          </div>
        </div>
      )}

      <SectionForm title="Header Content">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Show Section Entirely</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={showSection} onChange={(e) => setShowSection(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Subheading</label>
                <input type="checkbox" checked={showSubheading} onChange={e => setShowSubheading(e.target.checked)} className="rounded text-primary focus:ring-primary" title="Show/Hide" />
              </div>
              <input type="text" value={subheading} onChange={e => setSubheading(e.target.value)} maxLength={30} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              <div className="text-right text-xs text-gray-400 mt-1">
                {subheading?.length || 0} / 30
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <input type="checkbox" checked={showHeading} onChange={e => setShowHeading(e.target.checked)} className="rounded text-primary focus:ring-primary" title="Show/Hide" />
              </div>
              <input type="text" value={heading} onChange={e => setHeading(e.target.value)} maxLength={50} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              <div className="text-right text-xs text-gray-400 mt-1">
                {heading?.length || 0} / 50
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <input type="checkbox" checked={showDescription} onChange={e => setShowDescription(e.target.checked)} className="rounded text-primary focus:ring-primary" title="Show/Hide" />
            </div>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} maxLength={250} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            <div className="text-right text-xs text-gray-400 mt-1">
              {description?.length || 0} / 250
            </div>
          </div>
        </div>
      </SectionForm>

      <SectionForm title="Gallery Images">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Show Images Grid</span>
            <input type="checkbox" checked={showImages} onChange={e => setShowImages(e.target.checked)} className="rounded text-primary focus:ring-primary" />
          </div>
          <label className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Add Image
            <input type="file" className="hidden" accept="image/*" onChange={handleNewImageUpload} />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 h-40 bg-gray-100">
               <img src={img.src} alt={img.alt} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => removeImage(idx)} className="text-white hover:text-red-400 p-2 rounded-full transition-colors bg-red-500/20 hover:bg-red-500/40">
                   <Trash2 className="w-6 h-6" />
                 </button>
               </div>
            </div>
          ))}
        </div>
      </SectionForm>

    </div>
  );
};

export default ManageLifeAtKsbm;
