"use client";
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, RefreshCw, Eye, Monitor, Smartphone, Tablet, X, Edit2, GripVertical } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import LogoUploader from './components/LogoUploader';
import ProgramsPreview from '../../home/components/AcademicPrograms';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';
import { useDeferredUpload } from '../../../hooks/useDeferredUpload';

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

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();

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
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          const finalPrograms = await Promise.all(programs.map(async (program) => {
            let newProgram = { ...program };
            if (newProgram.imageFile) {
              const url = await uploadFile(newProgram.imageFile);
              newProgram.image = url;
              delete newProgram.imageFile;
            }
            return newProgram;
          }));

          await api.put('/cms/programs', {
            subheading, heading, description, programs: finalPrograms,
            showSubheading, showHeading, showDescription, showPrograms
          });
          
          await executeDeletions();
          setPrograms(finalPrograms);
          Toast.fire({ icon: 'success', title: 'Programs section saved successfully!' });
        } catch (error) {
          console.error('Error saving programs settings:', error);
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
            subtitle: 'Master of Business Administration is a postgraduate degree...',
            image: '/assets/Images/Home/academic_mba.jpg',
            tag: 'GRADUATE'
          },
          {
            id: 'bba',
            title: 'BBA',
            subtitle: 'Bachelor of Business Administration is an undergraduate program...',
            image: '/assets/Images/Home/academic_bba.jpg',
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
    if (!currentProgram.title?.trim() || !currentProgram.subtitle?.trim() || !currentProgram.tag?.trim() || !currentProgram.image) {
      Toast.fire({ icon: 'error', title: 'All fields and an image are required' });
      return;
    }

    await confirmAction({
      title: editingProgramIndex === -1 ? 'Add Program?' : 'Update Program?',
      message: 'Are you sure you want to save these details?',
      confirmText: 'Yes, save it',
      variant: 'primary',
      action: async () => {
        const newPrograms = [...programs];
        if (editingProgramIndex === -1) {
          newPrograms.push(currentProgram);
        } else {
          newPrograms[editingProgramIndex] = currentProgram;
        }
        setPrograms(newPrograms);
        closeProgramModal();
        Toast.fire({ icon: 'info', title: 'Program updated locally. Click Save Changes to apply.' });
      }
    });
  };

  const removeProgram = async (index) => {
    await confirmAction({
      title: 'Are you sure?',
      message: 'This program will be permanently deleted.',
      confirmText: 'Yes, delete it!',
      variant: 'danger',
      action: async () => {
        const deletedProgram = programs[index];
        const deletedImageUrl = deletedProgram?.image;

        let newPrograms = [...programs];
        newPrograms.splice(index, 1);
        
        const defaultPrograms = [
          {
            id: 'mba',
            title: 'MBA',
            subtitle: 'Master of Business Administration is a postgraduate degree...',
            image: '/assets/Images/Home/academic_mba.jpg',
            tag: 'GRADUATE'
          },
          {
            id: 'bba',
            title: 'BBA',
            subtitle: 'Bachelor of Business Administration is an undergraduate program...',
            image: '/assets/Images/Home/academic_bba.jpg',
            tag: 'UNDERGRADUATE'
          }
        ];

        while (newPrograms.length < 2) {
          const availableDefault = defaultPrograms.find(
            defProg => !newPrograms.some(p => p.id === defProg.id || p.title === defProg.title)
          );
          if (availableDefault) {
            newPrograms.push(availableDefault);
          } else {
            break;
          }
        }

        setPrograms(newPrograms);

        if (deletedImageUrl) {
          markForDeletion(deletedImageUrl);
        }

        Toast.fire({ icon: 'info', title: 'Program deleted locally. Click Save Changes to apply.' });
      }
    });
  };

  const moveProgramUp = async (index) => {
    if (index === 0) return;
    const newPrograms = [...programs];
    [newPrograms[index - 1], newPrograms[index]] = [newPrograms[index], newPrograms[index - 1]];
    setPrograms(newPrograms);
  };

  const moveProgramDown = async (index) => {
    if (index === programs.length - 1) return;
    const newPrograms = [...programs];
    [newPrograms[index + 1], newPrograms[index]] = [newPrograms[index], newPrograms[index + 1]];
    setPrograms(newPrograms);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      handleDragEnd();
      return;
    }
    
    const newPrograms = [...programs];
    const draggedProgram = newPrograms[draggedIndex];
    
    newPrograms.splice(draggedIndex, 1);
    newPrograms.splice(index, 0, draggedProgram);
    
    setPrograms(newPrograms);
    handleDragEnd();
  };

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Academic Programs Settings"
        description="Manage the text and programs in the Academic Programs section."
        onPreview={() => setIsPreviewModalOpen(true)}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving}
      />

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
                    maxLength={50}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentProgram.title.length} / 50
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Subtitle / Description</label>
                  <textarea
                    value={currentProgram.subtitle}
                    onChange={(e) => setCurrentProgram({...currentProgram, subtitle: e.target.value})}
                    rows="3"
                    placeholder="e.g. Master of Business Administration..."
                    maxLength={200}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentProgram.subtitle?.length || 0} / 200
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Tag (Vertical Text)</label>
                  <input
                    type="text"
                    value={currentProgram.tag}
                    onChange={(e) => setCurrentProgram({...currentProgram, tag: e.target.value})}
                    placeholder="e.g. GRADUATE"
                    maxLength={15}
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {currentProgram.tag?.length || 0} / 15
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">Program Image</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-[#D9DEE3]">
                    <LogoUploader
                      currentLogoUrl={currentProgram.image}
                      onUploadSuccess={(url, file) => {
                        if (file) {
                          if (currentProgram.image) {
                            markForDeletion(currentProgram.image);
                          }
                          setCurrentProgram({...currentProgram, image: url, imageFile: file});
                        }
                      }}
                      deferredMode={true}
                      disableDelete={true}
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">

        {/* Header Text Settings */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1e2869] mb-4">Header Content</h3>
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
                maxLength={60}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {subheading.length} / 60
              </div>
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
                maxLength={60}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {heading.length} / 60
              </div>
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
                maxLength={300}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {description.length} / 300
              </div>
            </div>
          </div>
        </div>

        {/* Programs Builder */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1e2869]">Programs</h3>
              <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 pl-4">
                <input type="checkbox" checked={showPrograms} onChange={(e) => setShowPrograms(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-gray-500">Show Programs</span>
              </label>
            </div>
            <button
              onClick={openAddProgramModal}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Program
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((program, index) => (
              <div
                key={program.id || program._id || index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, index)}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col cursor-move ${draggedIndex === index ? 'opacity-50' : 'opacity-100'} ${dragOverIndex === index ? 'border-primary border-2 scale-105 shadow-lg' : 'border-gray-200'}`}
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
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded cursor-move shadow-sm group-hover:bg-white transition-colors">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                
                {/* Program Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-[#566A7F] text-lg mb-1">{program.title || '(Untitled Program)'}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{program.subtitle}</p>
                  
                  {/* Actions */}
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => moveProgramUp(index)}
                      disabled={index === 0}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveProgramDown(index)}
                      disabled={index === programs.length - 1}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      ↓
                    </button>
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

