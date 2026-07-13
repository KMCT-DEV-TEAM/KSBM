import React, { useState, useEffect } from 'react';
import { Eye, Save, Monitor, Tablet, Smartphone, X, RefreshCw, Upload, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import NewsSectionPreview from '../../home/components/NewsSection';
import SectionForm from './components/SectionForm';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageNews = () => {
  const [subheading, setSubheading] = useState('');
  const [heading, setHeading] = useState('');
  
  const [featuredArticle, setFeaturedArticle] = useState({
    tag: '', date: '', title: '', description: '', image: ''
  });
  
  const [sideArticles, setSideArticles] = useState([]);
  
  const [showSubheading, setShowSubheading] = useState(true);
  const [showHeading, setShowHeading] = useState(true);
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
      const { data } = await api.get('/cms/news');
      setSubheading(data.subheading || '');
      setHeading(data.heading || '');
      setFeaturedArticle(data.featuredArticle || { tag: '', date: '', title: '', description: '', image: '' });
      setSideArticles(data.sideArticles || []);
      
      setShowSubheading(data.showSubheading ?? true);
      setShowHeading(data.showHeading ?? true);
      setShowSection(data.showSection ?? true);
    } catch (error) {
      console.error('Error fetching News settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/cms/news', {
        subheading, heading, featuredArticle, sideArticles,
        showSubheading, showHeading, showSection
      }, { hideLoader: true });
      Toast.fire({ icon: 'success', title: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    const defaults = {
      subheading: 'News and Events',
      heading: 'Latest From KSBM',
      featuredArticle: {
        tag: 'FEATURED',
        date: 'OCTOBER 24, 2024',
        title: 'KSBM National Business Summit 2024: Navigating the AI Frontier',
        description: 'Over 50 industry experts converged at KSBM to discuss the transformative power of AI in modern business management.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'
      },
      sideArticles: [
        { date: 'OCTOBER 15, 2024', title: 'KSBM Students Win National HR Conclave 2024', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop' },
        { date: 'OCTOBER 08, 2024', title: "Inauguration of the 'Innovate KSBM' Incubation Lab", image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop' },
        { date: 'SEPTEMBER 28, 2024', title: 'New Global Faculty Partnership with Zurich School of Finance', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop' },
        { date: 'AUGUST 12, 2024', title: 'Annual Alumni Meet 2024: Bridging Generations', image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1973&auto=format&fit=crop' }
      ],
      showSubheading: true,
      showHeading: true,
      showSection: true,
    };
    setSubheading(defaults.subheading);
    setHeading(defaults.heading);
    setFeaturedArticle(defaults.featuredArticle);
    setSideArticles(defaults.sideArticles);
    setShowSubheading(defaults.showSubheading);
    setShowHeading(defaults.showHeading);
    setShowSection(defaults.showSection);
    Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
  };

  const handleSideArticleChange = (index, field, value) => {
    const updated = [...sideArticles];
    updated[index] = { ...updated[index], [field]: value };
    setSideArticles(updated);
  };

  const addSideArticle = () => {
    setSideArticles([...sideArticles, { date: '', title: '', image: '' }]);
  };

  const removeSideArticle = (index) => {
    const updated = [...sideArticles];
    updated.splice(index, 1);
    setSideArticles(updated);
  };

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader 
        title="News & Events Settings" 
        description="Manage the featured and side articles on the home page." 
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
              <NewsSectionPreview previewData={{ subheading, heading, featuredArticle, sideArticles, showSubheading, showHeading, showSection, previewDevice: previewMode }} />
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
                <input type="checkbox" checked={showSubheading} onChange={e => setShowSubheading(e.target.checked)} className="rounded text-primary focus:ring-primary" />
              </div>
              <input type="text" value={subheading} onChange={e => setSubheading(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <input type="checkbox" checked={showHeading} onChange={e => setShowHeading(e.target.checked)} className="rounded text-primary focus:ring-primary" />
              </div>
              <input type="text" value={heading} onChange={e => setHeading(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>
        </div>
      </SectionForm>

      <SectionForm title="Featured Article">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Tag (e.g., FEATURED)</label>
                <input type="text" value={featuredArticle.tag} onChange={e => setFeaturedArticle({...featuredArticle, tag: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Date</label>
                <input type="text" value={featuredArticle.date} onChange={e => setFeaturedArticle({...featuredArticle, date: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
             </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Title</label>
            <input type="text" value={featuredArticle.title} onChange={e => setFeaturedArticle({...featuredArticle, title: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Description</label>
            <textarea rows={3} value={featuredArticle.description} onChange={e => setFeaturedArticle({...featuredArticle, description: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Image URL</label>
            <input type="text" value={featuredArticle.image} onChange={e => setFeaturedArticle({...featuredArticle, image: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          </div>
          {featuredArticle.image && (
            <div className="mt-2 h-48 w-full md:w-1/2 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              <img src={featuredArticle.image} alt="Preview" className="h-full w-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>
      </SectionForm>

      <SectionForm title="Side Articles">
        <div className="flex justify-end mb-4">
          <button onClick={addSideArticle} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
            <Plus className="w-4 h-4" /> Add Article
          </button>
        </div>
        <div className="space-y-4">
          {sideArticles.map((article, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-600">Article {idx + 1}</h4>
                <button onClick={() => removeSideArticle(idx)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500">Date</label>
                  <input type="text" value={article.date} onChange={e => handleSideArticleChange(idx, 'date', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500">Title</label>
                  <input type="text" value={article.title} onChange={e => handleSideArticleChange(idx, 'title', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">Image URL</label>
                <input type="text" value={article.image} onChange={e => handleSideArticleChange(idx, 'image', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
          ))}
        </div>
      </SectionForm>

    </div>
  );
};

export default ManageNews;
