"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import { Eye, CheckCircle2, XCircle, Search, LayoutTemplate, Clock, X } from 'lucide-react';
import AdminSkeleton from '../cms/components/AdminSkeleton';
import PageHeader from '../cms/components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ViewGrievancesPage = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const response = await api.get('/grievances');
      setGrievances(response.data);
    } catch (error) {
      console.error('Error fetching grievances:', error);
      Toast.fire({ icon: 'error', title: 'Failed to fetch grievances.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await confirmAction({
      title: 'Update Ticket Status?',
      text: `Are you sure you want to mark this grievance ticket as '${newStatus}'?`,
      confirmButtonText: 'Yes, update it!',
      action: async () => {
        try {
          await api.put(`/grievances/${id}`, { status: newStatus });
          Toast.fire({ icon: 'success', title: `Ticket marked as ${newStatus}` });
          fetchGrievances(); // Refresh list
          if (selectedTicket && selectedTicket._id === id) {
            setSelectedTicket(prev => ({ ...prev, status: newStatus }));
          }
        } catch (error) {
          console.error('Error updating grievance status:', error);
          Toast.fire({ icon: 'error', title: 'Failed to update status.' });
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'In Progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> In Progress</span>;
      case 'Dismissed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Dismissed</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const filteredGrievances = grievances.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.complaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader 
        title="Grievance Tickets" 
        description="View and manage all student and staff grievances submitted through the portal."
      />

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {/* Search Bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, ID, or keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-gray-100">Date</th>
                <th className="px-6 py-4 font-medium border-b border-gray-100">Student / Staff</th>
                <th className="px-6 py-4 font-medium border-b border-gray-100">Department</th>
                <th className="px-6 py-4 font-medium border-b border-gray-100">Status</th>
                <th className="px-6 py-4 font-medium border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGrievances.length > 0 ? (
                filteredGrievances.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-primary">{ticket.name}</div>
                      <div className="text-xs text-gray-500">ID: {ticket.idNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{ticket.department}</div>
                      <div className="text-xs text-gray-500">{ticket.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <LayoutTemplate className="w-12 h-12 text-gray-300" />
                      <p>No grievance tickets found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Grievance Ticket Details</h3>
              <button onClick={() => setSelectedTicket(null)} className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-primary">{selectedTicket.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">ID: <span className="font-medium text-gray-700">{selectedTicket.idNumber}</span> • Email: <span className="font-medium text-gray-700">{selectedTicket.email}</span></p>
                </div>
                <div>{getStatusBadge(selectedTicket.status)}</div>
              </div>

              {/* Academic Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-sm font-medium text-gray-800">{selectedTicket.department}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Course / Semester</p>
                  <p className="text-sm font-medium text-gray-800">{selectedTicket.course}</p>
                </div>
              </div>

              {/* Committees */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Forwarded To Cells</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTicket.selectedCells.map((cell, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/5 border border-primary/10 text-primary rounded-lg text-sm font-medium">
                      {cell}
                    </span>
                  ))}
                </div>
              </div>

              {/* Complaint Text */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Detailed Complaint</p>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {selectedTicket.complaint}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Submitted: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
              <div className="flex gap-2">
                <select 
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(selectedTicket._id, e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-primary cursor-pointer shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewGrievancesPage;
