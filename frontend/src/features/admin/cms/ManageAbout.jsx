import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, RefreshCw, Eye, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import LogoUploader from './components/LogoUploader';
import graduateImg from '../../../assets/Images/graduate.png';
import AboutPreview from '../../home/components/AboutSection';

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
  const [showImage, setShowImage] = useState(true);

  const [stats, setStats] = useState([]);
  const [showStats, setShowStats] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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
    setIsSaving(true);
    try {
      await api.put('/cms/about', {
        subheading, heading, paragraphs, imageUrl, stats,
        showSubheading, showHeading, showParagraphs, showImage, showStats
      });
      Toast.fire({ icon: 'success', title: 'About section saved successfully!' });
    } catch (error) {
      console.error('Error saving about settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    Swal.fire({
      title: 'Reset to Defaults?',
      text: 'This will reset all your settings to their original state. You still need to click "Save Changes" to apply them.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#696CFF',
      cancelButtonColor: '#8592A3',
      confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
      if (result.isConfirmed) {
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
    setStats([...stats, { value: '', label: '' }]);
  };

  const removeStat = (index) => {
    const newStats = [...stats];
    newStats.splice(index, 1);
    setStats(newStats);
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
    const newParagraphs = [...paragraphs];
    newParagraphs.splice(index, 1);
    setParagraphs(newParagraphs);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#696CFF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">About KSBM Settings</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the text, image, and stats on the About section.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-md font-semibold text-sm border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 bg-white text-[#697A8D] px-4 py-2.5 rounded-md font-semibold text-sm border border-[#D9DEE3] hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#696CFF] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-[#5b5eea] transition-colors shadow-[0_2px_4px_0_rgba(105,108,255,0.4)] disabled:opacity-70"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#697A8D] uppercase tracking-wider">
              <Eye className="w-5 h-5" /> Live Preview
            </div>

            <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'desktop' ? 'bg-[#E7E7FF] text-[#696CFF]' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'tablet' ? 'bg-[#E7E7FF] text-[#696CFF]' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${previewMode === 'mobile' ? 'bg-[#E7E7FF] text-[#696CFF]' : 'text-gray-400 hover:text-gray-600'}`}
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
              <AboutPreview previewData={{
                subheading, heading, paragraphs, imageUrl, stats,
                showSubheading, showHeading, showParagraphs, showImage, showStats,
                previewDevice: previewMode
              }} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto">

        {/* Header Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Header Content</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Subheading</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showSubheading} onChange={(e) => setShowSubheading(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-[#696CFF] focus:ring-[#696CFF]" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <input
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. BUILDING EXCELLENCE SINCE 1995"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-[#696CFF]/20 focus:border-[#696CFF]"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Main Heading</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showHeading} onChange={(e) => setShowHeading(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-[#696CFF] focus:ring-[#696CFF]" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Shaping Tomorrow's Business Leaders"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-[#696CFF]/20 focus:border-[#696CFF]"
              />
            </div>
          </div>
        </div>

        {/* Image Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#566A7F]">About Image</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showImage} onChange={(e) => setShowImage(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#696CFF] focus:ring-[#696CFF]" />
              <span className="text-sm font-semibold text-gray-500">Show Image</span>
            </label>
          </div>
          <LogoUploader
            currentLogoUrl={imageUrl || graduateImg}
            onUploadSuccess={(url) => setImageUrl(url)}
          />
        </div>

        {/* Paragraphs Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#566A7F]">Paragraphs</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showParagraphs} onChange={(e) => setShowParagraphs(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#696CFF] focus:ring-[#696CFF]" />
                <span className="text-sm font-semibold text-gray-500">Show Paragraphs</span>
              </label>
            </div>
            <button
              onClick={addParagraph}
              className="flex items-center gap-2 text-sm font-semibold text-[#696CFF] bg-[#E7E7FF] px-3 py-1.5 rounded-md hover:bg-[#d4d4ff] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Paragraph
            </button>
          </div>
          <div className="space-y-4">
            {paragraphs.map((para, index) => (
              <div key={index} className="flex gap-3">
                <textarea
                  value={para}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-[#696CFF]/20 focus:border-[#696CFF]"
                />
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
              <h3 className="text-lg font-bold text-[#566A7F]">Statistics</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#696CFF] focus:ring-[#696CFF]" />
                <span className="text-sm font-semibold text-gray-500">Show Stats Section</span>
              </label>
            </div>
            <button
              onClick={addStat}
              className="flex items-center gap-2 text-sm font-semibold text-[#696CFF] bg-[#E7E7FF] px-3 py-1.5 rounded-md hover:bg-[#d4d4ff] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-[#F5F5F9] p-3 rounded-lg border border-gray-200"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="Value (e.g., 16+)"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-[#696CFF]/20 focus:border-[#696CFF]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Label (e.g., YEARS OF EXCELLENCE)"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-[#696CFF]/20 focus:border-[#696CFF]"
                    />
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
    </div>
  );
};

export default ManageAbout;
