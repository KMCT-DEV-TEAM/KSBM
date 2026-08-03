"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../../../api/axios';
import { Plus, Edit2, Trash2, Save, GripVertical, CheckCircle2, MessageCircle, Phone, Mail, Globe, ArrowRight, ArrowUpRight, Download, User, Info, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

const ICONS = {
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  ArrowRight: <ArrowRight className="w-5 h-5" />,
  ArrowUpRight: <ArrowUpRight className="w-5 h-5" />,
  Download: <Download className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Info: <Info className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
};

const COLORS = [
  { label: 'Primary (Blue)', value: 'bg-primary text-white' },
  { label: 'Green', value: 'bg-green-600 text-white' },
  { label: 'Red', value: 'bg-red-600 text-white' },
  { label: 'Yellow', value: 'bg-yellow-500 text-white' },
  { label: 'Dark', value: 'bg-gray-900 text-white' },
  { label: 'Light', value: 'bg-white text-gray-900 border border-gray-200' },
];

export default function GlobalButtonsPage() {
  const [buttons, setButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    identifier: '',
    label: '',
    link: '',
    icon: 'MessageCircle',
    color: 'bg-primary text-white',
    isActive: true,
  });

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    try {
      const { data } = await api.get('/cms/global-buttons');
      setButtons(data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch global buttons', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (btn = null) => {
    if (btn) {
      setEditingId(btn._id);
      setFormData({
        identifier: btn.identifier || '',
        label: btn.label,
        link: btn.link,
        icon: btn.icon,
        color: btn.color,
        isActive: btn.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        identifier: '',
        label: '',
        link: '',
        icon: 'MessageCircle',
        color: 'bg-primary text-white',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/cms/global-buttons/${id}`);
        Swal.fire('Deleted!', 'Button has been deleted.', 'success');
        fetchButtons();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete button', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/cms/global-buttons/${editingId}`, formData);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Button updated', showConfirmButton: false, timer: 3000 });
      } else {
        await api.post('/cms/global-buttons', formData);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Button created', showConfirmButton: false, timer: 3000 });
      }
      setShowModal(false);
      fetchButtons();
    } catch (error) {
      Swal.fire('Error', 'Failed to save button. Make sure the identifier is unique.', 'error');
    }
  };

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Global Action Buttons</h1>
          <p className="text-sm text-gray-500 mt-1">Manage buttons that appear globally on your website (e.g. hero_apply, hero_brochure)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : buttons.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No buttons found</h3>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Button</th>
                <th className="px-6 py-4 font-medium">Link</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {buttons.map((btn) => (
                <tr key={btn._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${btn.color}`}>
                      {ICONS[btn.icon] || <MessageCircle className="w-3.5 h-3.5" />}
                      {btn.label}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{btn.link}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${btn.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {btn.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(btn)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(btn._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Button' : 'Add New Button'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identifier Key</label>
                <input
                  type="text"
                  required
                  value={formData.identifier}
                  onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. hero_apply, hero_brochure"
                />
                <p className="text-xs text-gray-500 mt-1">Used to identify this button in the codebase.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Apply Now"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="text"
                  required
                  value={formData.link}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. /admissions or https://wa.me/123456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {Object.keys(ICONS).map(iconName => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                  <select
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {COLORS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Button is active and visible</label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Button
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
