"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2, Eye, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import StatsSection from '../../about/components/StatsSection';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageAboutUsStats = () => {
  const [stats, setStats] = useState([]);
  const [showSection, setShowSection] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStatValue, setNewStatValue] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const iframeRef = useRef(null);

  const previewData = { stats };

  useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'preview-cms-data', componentName: 'StatsSection', payload: previewData }, '*');
        }
      };
      
      sendData();
      
      let count = 0;
      interval = setInterval(() => {
        sendData();
        count++;
        if (count > 10) clearInterval(interval);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [previewData, isPreviewModalOpen]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/about-us-stats');
      if (data && data.stats && data.stats.length > 0) {
        setStats(data.stats);
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
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/about-us-stats', { stats }, { hideLoader: true });
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
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all your settings to their original state. You still need to click "Save Changes" to apply them.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setStats([
          { value: '25+', label: 'Years of Excellence' },
          { value: '500+', label: 'Expert Faculties' },
          { value: '25,000+', label: 'Alumni Network' }
        ]);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };
  const handleAddStatSave = () => {
    if (stats.length >= 5) {
      Toast.fire({ icon: 'error', title: 'Maximum 5 stats allowed.' });
      return;
    }
    if (!newStatValue.trim() || !newStatLabel.trim()) {
      Toast.fire({ icon: 'error', title: 'Both Value and Label are required.' });
      return;
    }
    setStats([...stats, { value: newStatValue, label: newStatLabel }]);
    setNewStatValue('');
    setNewStatLabel('');
    setIsAddModalOpen(false);
  };

  const removeStat = async (index) => {
    await confirmAction({
      title: 'Remove Stat?',
      message: 'Are you sure you want to remove this statistic?',
      confirmText: 'Yes, remove it!',
      variant: 'danger',
      action: async () => {
        const newStats = [...stats];
        newStats.splice(index, 1);
        setStats(newStats);
      }
    });
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Stats Section"
        description="Manage the statistics displayed on the About Us page."
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
          <div className="flex-1 bg-gray-100 overflow-hidden relative flex justify-center items-center">
            <div className={`bg-white shadow-2xl transition-all duration-300 h-[85vh] ${previewMode === 'desktop' ? 'w-[100%] max-w-[1920px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <iframe
                ref={iframeRef}
                src="/preview/cms"
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-[#1e2869]">Stats List</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-semibold">{stats.length}/5 Stats Added</span>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                disabled={stats.length >= 5}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Add Stat
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-end gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Value (e.g. 25+)</label>
                    <span className="text-xs text-gray-500">{stat.value?.length || 0}/10</span>
                  </div>
                  <input type="text" maxLength={10} value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="flex-[2]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Label (e.g. Years of Excellence)</label>
                    <span className="text-xs text-gray-500">{stat.label?.length || 0}/30</span>
                  </div>
                  <input type="text" maxLength={30} value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <button onClick={() => removeStat(index)} className="p-2.5 text-red-500 bg-white border border-red-200 hover:bg-red-50 rounded-md mb-px transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {stats.length === 0 && <p className="text-gray-500 text-sm italic">No stats added yet.</p>}
          </div>
        </div>
      </div>

      {/* Add Stat Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1e2869]">Add New Stat</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5 hidden" /> {/* just for icon import trick if X not imported */}
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Value (e.g. 25+)</label>
                  <span className="text-xs text-gray-500">{newStatValue.length}/10</span>
                </div>
                <input 
                  type="text" 
                  maxLength={10} 
                  value={newStatValue} 
                  onChange={(e) => setNewStatValue(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. 25+"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Label (e.g. Years of Excellence)</label>
                  <span className="text-xs text-gray-500">{newStatLabel.length}/30</span>
                </div>
                <input 
                  type="text" 
                  maxLength={30} 
                  value={newStatLabel} 
                  onChange={(e) => setNewStatLabel(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. Years of Excellence"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddStatSave}
                className="px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-[#151c48] rounded-xl shadow-md transition-all"
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAboutUsStats;
