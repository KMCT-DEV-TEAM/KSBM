import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, GripVertical, AlertCircle, Eye, Monitor, Smartphone, Tablet, RefreshCw, X, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import LogoUploader from './components/LogoUploader';

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

const ManageHeader = () => {
  const iframeRef = useRef(null);
  
  const [navItems, setNavItems] = useState([]);
  const [actionButton, setActionButton] = useState({ text: 'Apply Now', isVisible: true });
  const [logoUrl, setLogoUrl] = useState('');
  const [alignment, setAlignment] = useState('center');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current === undefined || dragOverItem.current === undefined) return;
    if (dragItem.current === dragOverItem.current) return;

    const copyListItems = [...navItems];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = undefined;
    dragOverItem.current = undefined;
    setNavItems(copyListItems);
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
        setNavItems([
          { label: 'Home', link: '#home' },
          { label: 'About Us', link: '#about-us' },
          { label: 'Campus', link: '#campus' },
          { label: 'People', link: '#people' },
          { label: 'Placement', link: '#placement' },
          { label: 'Programs', link: '#programs' },
          { label: 'Events', link: '#events' },
          { label: 'Admission', link: '#admission' },
          { label: 'Examinations', link: '#examinations' },
        ]);
        setActionButton({ text: 'Apply Now', isVisible: true });
        setLogoUrl('');
        setAlignment('center');
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/header');
      setNavItems(data.navItems || []);
      setActionButton(data.actionButton || { text: 'Apply Now', isVisible: true });
      setLogoUrl(data.logoUrl || '');
      setAlignment(data.alignment || 'center');
    } catch (error) {
      console.error('Error fetching header settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load header settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/cms/header', { navItems, actionButton, alignment, logoUrl }, { hideLoader: true });
      Toast.fire({ icon: 'success', title: 'Header settings saved successfully!' });
    } catch (error) {
      console.error('Error saving header settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const addNavItem = () => {
    setNavItems([...navItems, { label: 'New Link', link: '#' }]);
  };

  const removeNavItem = (index) => {
    const newItems = [...navItems];
    newItems.splice(index, 1);
    setNavItems(newItems);
  };

  const updateNavItem = (index, field, value) => {
    const newItems = [...navItems];
    newItems[index][field] = value;
    setNavItems(newItems);
  };

  const previewData = {
    navItems,
    actionButton,
    logoUrl,
    alignment,
    previewDevice: previewMode
  };

  useEffect(() => {
    if (isPreviewModalOpen && iframeRef.current) {
      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: 'preview-header-data', payload: previewData },
            '*'
          );
        }
      }, 500);
      
      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'preview-header-data', payload: previewData },
          '*'
        );
      }
    }
  }, [previewData, isPreviewModalOpen]);

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
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">Header & Navbar Settings</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage navigation links, the call-to-action button, and layout alignment.</p>
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
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-[#696CFF] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-[#5b5eea] transition-colors shadow-[0_2px_4px_0_rgba(105,108,255,0.4)] disabled:opacity-70"
          >
            {isSaving || isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Changes'}
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
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center p-4">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-full ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe 
                ref={iframeRef}
                src="/preview/header"
                className="w-full h-full border-0"
                title="Header Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] p-6 md:p-8 max-w-5xl mx-auto">
        
        {/* Logo URL Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Header Logo</h3>
          <LogoUploader 
            currentLogoUrl={logoUrl} 
            onUploadSuccess={(url) => setLogoUrl(url)} 
            onUploadStateChange={(uploading) => setIsUploading(uploading)}
          />
        </div>

        {/* Alignment Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Navigation Alignment</h3>
          <div className="flex gap-4">
            {['left', 'center', 'right'].map((pos) => (
              <button
                key={pos}
                onClick={() => setAlignment(pos)}
                className={`px-6 py-2.5 rounded-md text-sm font-semibold capitalize transition-colors ${
                  alignment === pos 
                    ? 'bg-[#696CFF] text-white shadow-sm' 
                    : 'bg-[#F5F5F9] text-[#697A8D] hover:bg-gray-200'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Links Builder */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#566A7F]">Navigation Links</h3>
            <button 
              onClick={addNavItem}
              className="flex items-center gap-2 text-sm font-semibold text-[#696CFF] bg-[#E7E7FF] px-3 py-1.5 rounded-md hover:bg-[#d4d4ff] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          
          <div className="space-y-3">
            {navItems.map((item, index) => (
              <div 
                key={index} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center gap-3 bg-[#F5F5F9] p-3 rounded-lg border border-gray-200 group transition-all"
              >
                <div className="cursor-move p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input 
                      type="text" 
                      value={item.label}
                      onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                      placeholder="Display Name (e.g., Home)"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-[#696CFF]/20 focus:border-[#696CFF]"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={item.link}
                      onChange={(e) => updateNavItem(index, 'link', e.target.value)}
                      placeholder="Link/Anchor (e.g., #home or /page)"
                      className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-[#696CFF]/20 focus:border-[#696CFF]"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => removeNavItem(index)}
                  className="p-2 text-gray-400 hover:text-[#FF3E1D] hover:bg-[#FF3E1D]/10 rounded-md transition-colors"
                  title="Remove Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {navItems.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No navigation links added yet.</p>
            )}
          </div>
        </div>

        {/* Action Button Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#566A7F] mb-4">Action Button ("Apply Now")</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Button Text</label>
              <input 
                type="text" 
                value={actionButton.text}
                onChange={(e) => setActionButton({ ...actionButton, text: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-[#696CFF]/20 focus:border-[#696CFF]"
              />
            </div>
            
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={actionButton.isVisible}
                  onChange={(e) => setActionButton({ ...actionButton, isVisible: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#696CFF] focus:ring-[#696CFF]"
                />
                <span className="text-sm font-semibold text-[#566A7F]">Show Button in Navbar</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHeader;
