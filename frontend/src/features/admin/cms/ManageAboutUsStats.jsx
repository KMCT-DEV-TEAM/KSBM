"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageAboutUsStats = () => {
  const [stats, setStats] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
  const addStat = () => setStats([...stats, { value: '', label: '' }]);
  const removeStat = (index) => setStats(stats.filter((_, i) => i !== index));

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Stats Section"
        description="Manage the statistics displayed on the About Us page."
        onPreview={() => window.open('/about', '_blank')}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-[#1e2869]">Stats List</h3>
            <button onClick={addStat} className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-colors">
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-end gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Value (e.g. 25+)</label>
                  <input type="text" value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="flex-[2]">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Label (e.g. Years of Excellence)</label>
                  <input type="text" value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <button onClick={() => removeStat(index)} className="p-2.5 text-red-500 bg-white border border-red-200 hover:bg-red-50 rounded-md mb-px transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {stats.length === 0 && <p className="text-gray-500 text-sm italic">No stats added yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAboutUsStats;
