"use client";
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Edit2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import LogoUploader from './components/LogoUploader';
import ProgramsPreview from '../../home/components/AcademicPrograms';

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

const ManagePrograms = () => {
  const [subheading, setSubheading] = useState('');
  const [showSubheading, setShowSubheading] = useState(true);

  const [heading, setHeading] = useState('');
  const [showHeading, setShowHeading] = useState(true);

  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(true);

  const [programs, setPrograms] = useState([]);
  const [showPrograms, setShowPrograms] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Program Modal State
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgramIndex, setEditingProgramIndex] = useState(-1);
  const [currentProgram, setCurrentProgram] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/programs');
      setSubheading(data.subheading || '');
      setShowSubheading(data.showSubheading ?? true);

      setHeading(data.heading || '');
      setShowHeading(data.showHeading ?? true);

      setDescription(data.description || '');
      setShowDescription(data.showDescription ?? true);

      setPrograms(data.programs || []);
      setShowPrograms(data.showPrograms ?? true);
    } catch (error) {
      console.error('Error fetching programs settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load programs settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/cms/programs', {
        subheading, heading, description, programs,
        showSubheading, showHeading, showDescription, showPrograms
      });
      Toast.fire({ icon: 'success', title: 'Programs section saved successfully!' });
    } catch (error) {
      console.error('Error saving programs settings:', error);
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
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: '#8592A3',
      confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSubheading('Our Courses');
        setShowSubheading(true);
        setHeading('Academic Programs');
        setShowHeading(true);
        setDescription('Discover our MBA and BBA programmes, crafted to develop future-ready professionals through innovative learning, industry engagement, and leadership-focused education.');
        setShowDescription(true);
        setPrograms([
          {
            id: 'mba',
            title: 'MBA',
            subtitle: 'Master of Business Administration. 2 - Year Full-time immersive leadership journey.',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
            tag: 'GRADUATE'
          },
          {
            id: 'bba',
            title: 'BBA',
            subtitle: 'Bachelor of Business Administration. Building the foundation for corporate excellence.',
            image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
            tag: 'UNDERGRADUATE'
          }
        ]);
        setShowPrograms(true);
        Toast.fire({ icon: 'info', title: 'Settings reset to default. Click Save Changes to apply.' });
      }
    });
  };

  // Program Modal Handlers
  const openAddProgramModal = () => {
    setEditingProgramIndex(-1);
    setCurrentProgram({ id: `prog-${Date.now()}`, title: '', subtitle: '', image: '', tag: '' });
    setIsProgramModalOpen(true);
  };

  const openEditProgramModal = (index) => {
    setEditingProgramIndex(index);
    setCurrentProgram({ ...programs[index] });
    setIsProgramModalOpen(true);
  };

  const closeProgramModal = () => {
    setIsProgramModalOpen(false);
    setCurrentProgram(null);
  };

  const saveProgramFromModal = async () => {
    if (!currentProgram.title) {
      Toast.fire({ icon: 'error', title: 'Title is required' });
      return;
    }
    const newPrograms = [...programs];
    if (editingProgramIndex === -1) {
      newPrograms.push(currentProgram);
    } else {
      newPrograms[editingProgramIndex] = currentProgram;
    }
    setPrograms(newPrograms);
    closeProgramModal();

    // Auto-save to database immediately
    setIsSaving(true);
    try {
      await api.put('/cms/programs', {
        subheading, heading, description, programs: newPrograms,
        showSubheading, showHeading, showDescription, showPrograms
      });
      Toast.fire({ icon: 'success', title: 'Program saved successfully!' });
    } catch (error) {
      console.error('Error saving program:', error);
      Toast.fire({ icon: 'error', title: 'Failed to save program to database.' });
    } finally {
      setIsSaving(false);
    }
  };

  const removeProgram = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This program will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#8592A3',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newPrograms = [...programs];
        newPrograms.splice(index, 1);
        setPrograms(newPrograms);

        // Auto-save deletion to database immediately
        setIsSaving(true);
        try {
          await api.put('/cms/programs', {
            subheading, heading, description, programs: newPrograms,
            showSubheading, showHeading, showDescription, showPrograms
          });
          Toast.fire({ icon: 'success', title: 'Program deleted!' });
        } catch (error) {
          console.error('Error deleting program:', error);
          Toast.fire({ icon: 'error', title: 'Failed to delete program from database.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">Academic Programs Settings</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the text and programs in the Academic Programs section.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-md font-semibold text-sm border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-colors shadow-sm"
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
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_2px_4px_0_var(--color-primary)] disabled:opacity-70"
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

      {/* Preview Modal */}
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
          <div className="flex-1 bg-gray-100 overflow-x-auto relative p-4 flex justify-center">
            <div className={`bg-white shadow-xl min-h-[500px] transition-all duration-300 ${previewMode === 'desktop' ? 'w-full min-w-[1280px] max-w-[1600px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
              <ProgramsPreview previewData={{
                subheading, heading, description, programs,
                showSubheading, showHeading, showDescription, showPrograms,
                previewDevice: previewMode
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Program Add/Edit Modal */}
      {isProgramModalOpen && currentProgram && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#566A7F]">
                {editingProgramIndex === -1 ? 'Add New Program' : 'Edit Program'}
              </h2>
              <button
                onClick={closeProgramModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Title</label>
                  <input
                    type="text"
                    value={currentProgram.title}
                    onChange={(e) => setCurrentProgram({...currentProgram, title: e.target.value})}
                    placeholder="e.g. MBA"
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Subtitle / Description</label>
                  <textarea
                    value={currentProgram.subtitle}
                    onChange={(e) => setCurrentProgram({...currentProgram, subtitle: e.target.value})}
                    rows="3"
                    placeholder="e.g. Master of Business Administration..."
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Tag (Vertical Text)</label>
                  <input
                    type="text"
                    value={currentProgram.tag}
                    onChange={(e) => setCurrentProgram({...currentProgram, tag: e.target.value})}
                    placeholder="e.g. GRADUATE"
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Program Image</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-[#D9DEE3]">
                    <LogoUploader
                      currentLogoUrl={currentProgram.image}
                      onUploadSuccess={(url) => setCurrentProgram({...currentProgram, image: url})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeProgramModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveProgramFromModal}
                className="px-5 py-2 rounded-md font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Program
              </button>
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
                  <input type="checkbox" checked={showSubheading} onChange={(e) => setShowSubheading(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <input
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. Our Courses"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Main Heading</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showHeading} onChange={(e) => setShowHeading(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Academic Programs"
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">Description</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showDescription} onChange={(e) => setShowDescription(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-gray-500">Show</span>
                </label>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                placeholder="Description text..."
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Programs Builder */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#566A7F]">Programs</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showPrograms} onChange={(e) => setShowPrograms(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Programs</span>
              </label>
            </div>
            <button
              onClick={openAddProgramModal}
              className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Program
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                {/* Program Header Image / Placeholder */}
                <div className="h-32 bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {program.image ? (
                    <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest font-semibold">
                      No Image
                    </div>
                  )}
                  {program.tag && (
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded">
                      {program.tag}
                    </div>
                  )}
                </div>
                
                {/* Program Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-[#566A7F] text-lg mb-1">{program.title || '(Untitled Program)'}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{program.subtitle}</p>
                  
                  {/* Actions */}
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditProgramModal(index)}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => removeProgram(index)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {programs.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 mb-2">No programs added yet.</p>
                <button
                  onClick={openAddProgramModal}
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Click here to add your first program
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagePrograms;

