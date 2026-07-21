"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageLegacy = () => {
  const [subheading, setSubheading] = useState('OUR LEGACY');
  const [heading, setHeading] = useState('A Journey of Educational Excellence');
  const [description, setDescription] = useState('Founded by the visionary leader...');
  const [cards, setCards] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/legacy');
      if (data) {
        if (data.subheading) setSubheading(data.subheading);
        if (data.heading) setHeading(data.heading);
        if (data.description) setDescription(data.description);
        if (data.cards && data.cards.length > 0) setCards(data.cards);
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
          await api.put('/cms/legacy', { 
            subheading, heading, description, cards
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
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset all your settings to their original state. You still need to click "Save Changes" to apply them.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setSubheading('OUR LEGACY');
        setHeading('A Journey of Educational Excellence');
        setDescription('Founded by the visionary leader...');
        setCards([
          {
            year: "1994",
            title: "Foundation",
            description: "Established the first educational institution.",
            image: "/assets/Images/image 35.png"
          }
        ]);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };
  const addCard = () => setCards([...cards, { year: '', title: '', description: '', image: '' }]);
  const removeCard = (index) => setCards(cards.filter((_, i) => i !== index));

  if (isLoading) return <Loader theme="light" text="Loading Settings..." />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Legacy Section"
        description="Manage the timeline and history cards."
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Subheading</label>
              <input type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Heading</label>
              <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 md:col-span-2">
              <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-[#1e2869]">Legacy Cards (Timeline)</h3>
              <button onClick={addCard} className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4" /> Add Card
              </button>
            </div>
            <div className="space-y-6">
              {cards.map((card, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
                  <button onClick={() => removeCard(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1.5 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-10">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Year</label>
                        <input type="text" value={card.year} onChange={(e) => updateCard(index, 'year', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Title</label>
                        <input type="text" value={card.title} onChange={(e) => updateCard(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1">Description</label>
                        <textarea value={card.description} onChange={(e) => updateCard(index, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">Card Image</label>
                      <SingleImageUploader 
                        imageUrl={card.image} 
                        onUploadComplete={(url) => updateCard(index, 'image', url)}
                        onUploadStateChange={setIsUploading}
                        label="Upload Card Image"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {cards.length === 0 && <p className="text-gray-500 text-sm italic">No legacy cards added yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLegacy;
