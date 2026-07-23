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
        { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop', alt: 'Students in cafe' },
        { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1973&auto=format&fit=crop', alt: 'Students jumping' },
        { src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop', alt: 'Campus festival' },
        { src: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop', alt: 'Meeting room' },
        { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop', alt: 'Selfie' },
        { src: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1925&auto=format&fit=crop', alt: 'Dining hall' },
        { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop', alt: 'Outdoor gathering' },
        { src: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=2070&auto=format&fit=crop', alt: 'Campus gate' }
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

  const handleImageChange = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setImages(updatedImages);
  };

  const addImage = () => {
    setImages([...images, { src: '', alt: '' }]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
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
              <input type="text" value={subheading} onChange={e => setSubheading(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <input type="checkbox" checked={showHeading} onChange={e => setShowHeading(e.target.checked)} className="rounded text-primary focus:ring-primary" title="Show/Hide" />
              </div>
              <input type="text" value={heading} onChange={e => setHeading(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <input type="checkbox" checked={showDescription} onChange={e => setShowDescription(e.target.checked)} className="rounded text-primary focus:ring-primary" title="Show/Hide" />
            </div>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>
        </div>
      </SectionForm>

      <SectionForm title="Gallery Images">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Show Images Grid</span>
            <input type="checkbox" checked={showImages} onChange={e => setShowImages(e.target.checked)} className="rounded text-primary focus:ring-primary" />
          </div>
          <button onClick={addImage} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-600">Image {idx + 1}</h4>
                <button onClick={() => removeImage(idx)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Image URL</label>
                <input type="text" value={img.src} onChange={e => handleImageChange(idx, 'src', e.target.value)} placeholder="https://example.com/image.jpg" className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Alt Text</label>
                <input type="text" value={img.alt} onChange={e => handleImageChange(idx, 'alt', e.target.value)} placeholder="Description of image" className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              {img.src && (
                <div className="mt-2 h-32 w-full rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <img src={img.src} alt="Preview" className="h-full w-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionForm>

    </div>
  );
};

export default ManageLifeAtKsbm;
