"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import { Eye, CheckCircle2, Clock, Search, X } from 'lucide-react';
import AdminSkeleton from '../cms/components/AdminSkeleton';
import PageHeader from '../cms/components/PageHeader';
import confirmAction from '../../../utils/confirmAction';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ViewContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/contact');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      Toast.fire({ icon: 'error', title: 'Failed to fetch submissions.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await confirmAction({
      title: 'Update Status?',
      message: `Are you sure you want to mark this submission as '${newStatus}'?`,
      confirmText: 'Yes, update it!',
      action: async () => {
        try {
          await api.put(`/contact/${id}/status`, { status: newStatus });
          Toast.fire({ icon: 'success', title: `Submission marked as ${newStatus}` });
          fetchSubmissions(); // Refresh list
          if (selectedSubmission && selectedSubmission._id === id) {
            setSelectedSubmission(prev => ({ ...prev, status: newStatus }));
          }
        } catch (error) {
          console.error('Error updating status:', error);
          Toast.fire({ icon: 'error', title: 'Failed to update status.' });
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'Read':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Eye className="w-3 h-3" /> Read</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> New</span>;
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader 
        title="Contact Form Submissions" 
        description="View and manage inquiries submitted through the contact page."
      />

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {/* Search Bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Sender</th>
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">{new Date(submission.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(submission.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-primary">{submission.name}</div>
                      <div className="text-xs text-gray-500">{submission.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-700">{submission.service || 'General Inquiry'}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedSubmission(submission)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <p>No submissions found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Submission Details</h3>
              <button onClick={() => setSelectedSubmission(null)} className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-bold text-primary">{selectedSubmission.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Email: <span className="font-medium text-gray-700">{selectedSubmission.email}</span></p>
                  {selectedSubmission.phone && <p className="text-sm text-gray-500 mt-1">Phone: <span className="font-medium text-gray-700">{selectedSubmission.phone}</span></p>}
                </div>
                <div>{getStatusBadge(selectedSubmission.status)}</div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Needed</h5>
                  <p className="text-sm font-medium text-gray-800">{selectedSubmission.service || 'General Inquiry'}</p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</h5>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-medium">Submitted: {new Date(selectedSubmission.createdAt).toLocaleString()}</span>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedSubmission.status}
                  onChange={(e) => handleUpdateStatus(selectedSubmission._id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="New">Mark as New</option>
                  <option value="Read">Mark as Read</option>
                  <option value="Resolved">Mark as Resolved</option>
                </select>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewContactSubmissions;
