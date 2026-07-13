import React, { useState, useEffect } from 'react';
import { Eye, Save, Monitor, Tablet, Smartphone, X, RefreshCw, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import FooterPreview from '../../../components/Footer';
import SectionForm from './components/SectionForm';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageFooter = () => {
  const [description, setDescription] = useState('');
  const [socialLinks, setSocialLinks] = useState({ instagram: '', facebook: '', whatsapp: '' });
  const [programs, setPrograms] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState({ address: '', email: '', phone: '' });
  const [copyrightText, setCopyrightText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/footer');
      setDescription(data.description || '');
      setSocialLinks(data.socialLinks || { instagram: '', facebook: '', whatsapp: '' });
      setPrograms(data.programs || []);
      setQuickLinks(data.quickLinks || []);
      setContactInfo(data.contactInfo || { address: '', email: '', phone: '' });
      setCopyrightText(data.copyrightText || '');
    } catch (error) {
      console.error('Error fetching Footer settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/cms/footer', {
        description, socialLinks, programs, quickLinks, contactInfo, copyrightText
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
      description: 'Empowering global leaders through intellectual rigor and strategic excellence since 1998.',
      socialLinks: { instagram: '#', facebook: '#', whatsapp: '#' },
      programs: [
        { label: 'MBA Full-time', url: '#' },
        { label: 'Executive MBA', url: '#' },
        { label: 'BBA Program', url: '#' },
        { label: 'PhD in Management', url: '#' }
      ],
      quickLinks: [
        { label: 'Programs', url: '#' },
        { label: 'Accreditations', url: '#' },
        { label: 'Gallery', url: '#' },
        { label: 'News & Events', url: '#' }
      ],
      contactInfo: {
        address: 'KMCT Hills, Kerala, India',
        email: 'admissions@ksbm.ac.in',
        phone: '+91 495 2211 444'
      },
      copyrightText: '© 2024 KMCT School of Business. All rights reserved. Accredited by AACSB & AMBA.'
    };
    setDescription(defaults.description);
    setSocialLinks(defaults.socialLinks);
    setPrograms(defaults.programs);
    setQuickLinks(defaults.quickLinks);
    setContactInfo(defaults.contactInfo);
    setCopyrightText(defaults.copyrightText);
    Toast.fire({ icon: 'info', title: 'Reset to default values. Click Save to apply.' });
  };

  const handleLinkChange = (array, setArray, index, field, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [field]: value };
    setArray(updated);
  };

  const addLink = (array, setArray) => {
    setArray([...array, { label: '', url: '' }]);
  };

  const removeLink = (array, setArray, index) => {
    const updated = [...array];
    updated.splice(index, 1);
    setArray(updated);
  };

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader 
        title="Footer Settings" 
        description="Manage the footer contact info, social links, and menus." 
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
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center items-end">
            <div className={`bg-white shadow-xl w-full mt-auto transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <FooterPreview previewData={{ description, socialLinks, programs, quickLinks, contactInfo, copyrightText, previewDevice: previewMode }} />
            </div>
          </div>
        </div>
      )}

      <SectionForm title="General & Social">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Short Description</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Instagram URL</label>
              <input type="text" value={socialLinks.instagram} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Facebook URL</label>
              <input type="text" value={socialLinks.facebook} onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">WhatsApp URL</label>
              <input type="text" value={socialLinks.whatsapp} onChange={e => setSocialLinks({...socialLinks, whatsapp: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>
        </div>
      </SectionForm>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionForm title="Programs Links">
          <div className="flex justify-end mb-4">
            <button onClick={() => addLink(programs, setPrograms)} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          <div className="space-y-3">
            {programs.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" placeholder="Label" value={link.label} onChange={e => handleLinkChange(programs, setPrograms, idx, 'label', e.target.value)} className="w-1/2 p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                <input type="text" placeholder="URL" value={link.url} onChange={e => handleLinkChange(programs, setPrograms, idx, 'url', e.target.value)} className="w-1/2 p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                <button onClick={() => removeLink(programs, setPrograms, idx)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </SectionForm>

        <SectionForm title="Quick Links">
          <div className="flex justify-end mb-4">
            <button onClick={() => addLink(quickLinks, setQuickLinks)} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          <div className="space-y-3">
            {quickLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" placeholder="Label" value={link.label} onChange={e => handleLinkChange(quickLinks, setQuickLinks, idx, 'label', e.target.value)} className="w-1/2 p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                <input type="text" placeholder="URL" value={link.url} onChange={e => handleLinkChange(quickLinks, setQuickLinks, idx, 'url', e.target.value)} className="w-1/2 p-2 bg-white border border-gray-200 rounded-md text-sm outline-none" />
                <button onClick={() => removeLink(quickLinks, setQuickLinks, idx)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </SectionForm>
      </div>

      <SectionForm title="Contact Info & Copyright">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Address</label>
              <input type="text" value={contactInfo.address} onChange={e => setContactInfo({...contactInfo, address: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Email</label>
              <input type="text" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Phone</label>
              <input type="text" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Copyright Text</label>
            <input type="text" value={copyrightText} onChange={e => setCopyrightText(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none" />
          </div>
        </div>
      </SectionForm>

    </div>
  );
};

export default ManageFooter;
