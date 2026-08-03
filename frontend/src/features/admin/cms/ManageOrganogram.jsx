"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import confirmAction from '../../../utils/confirmAction';
import { FileText, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageOrganogram = () => {
  const [loading, setLoading] = useState(true);
  const [organograms, setorganograms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [neworganogram, setNeworganogram] = useState({ title: '', file: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchorganograms();
  }, []);

  const fetchorganograms = async () => {
    try {
      const { data } = await api.get('/cms/organogram');
      setorganograms(data || []);
    } catch (error) {
      console.error('Error fetching organograms:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (fileObj) => {
    const fileData = new FormData();
    fileData.append('image', fileObj); // using same field name as other endpoints
    const res = await api.post('/upload/downloads', fileData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      hideLoader: true
    });
    return res.data.url;
  };

  const handleAddorganogram = async (e) => {
    e.preventDefault();
    if (!neworganogram.title || !neworganogram.file) {
      Toast.fire({ icon: 'warning', title: 'Please provide title and select a PDF file' });
      return;
    }
    setUploading(true);
    try {
      const fileUrl = await uploadFile(neworganogram.file);
      const payload = {
        title: neworganogram.title,
        pdfUrl: fileUrl,
        isDefault: organograms.length === 0 // Make default if it's the first one
      };
      await api.post('/cms/organogram', payload);
      Toast.fire({ icon: 'success', title: 'organogram added successfully' });
      setIsAddModalOpen(false);
      setNeworganogram({ title: '', file: null });
      fetchorganograms();
    } catch (error) {
      console.error('Error adding organogram:', error);
      Toast.fire({ icon: 'error', title: 'Failed to add organogram' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await confirmAction({
      title: 'Delete organogram?',
      message: 'Are you sure you want to delete this Organogram?',
      confirmText: 'Yes, delete it!',
      variant: 'danger',
      action: async () => {
        try {
          await api.delete(`/cms/organogram/${id}`);
          Toast.fire({ icon: 'success', title: 'organogram deleted successfully' });
          fetchorganograms();
        } catch (error) {
          Toast.fire({ icon: 'error', title: 'Failed to delete organogram' });
        }
      }
    });
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/cms/organogram/${id}/default`);
      Toast.fire({ icon: 'success', title: 'Default organogram updated' });
      fetchorganograms();
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Failed to set default organogram' });
    }
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Organogram"
        subtitle="Manage Organogram PDFs and set the default one."
        onSave={() => {}} // No global save needed
        isSaving={false}
        hidePreview
      />
      
      <div className="p-6 w-full mt-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Uploaded organograms</h3>
              <p className="text-sm text-gray-500 mt-1">Select one as default to appear in the header.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add organogram
            </button>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {organograms.map((doc) => (
                <div key={doc._id} className={`flex items-center justify-between p-4 rounded-xl border ${doc.isDefault ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <a href={doc.pdfUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">View PDF</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleSetDefault(doc._id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${doc.isDefault ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {doc.isDefault ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      {doc.isDefault ? 'Default' : 'Set Default'}
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {organograms.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No Organograms uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900">Add New organogram</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddorganogram} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={neworganogram.title}
                  onChange={(e) => setNeworganogram({ ...neworganogram, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Organogram 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setNeworganogram({ ...neworganogram, file: e.target.files[0] })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? 'Uploading...' : 'Save organogram'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrganogram;
