import React from 'react';

const ManageUsers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Users</h1>
        <p className="text-gray-500 mt-1">View and manage administrators, faculty, and students.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">User Directory</h3>
          <button className="bg-[#1a237e] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#283593] transition-colors">
            + Add User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Dummy User 1 */}
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-semibold text-gray-900">Admin User</td>
                <td className="px-6 py-4 text-gray-500">admin@ksbm.ac.in</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Admin</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#1a237e] hover:underline text-sm font-semibold">Edit</button>
                </td>
              </tr>
              {/* Dummy User 2 */}
              <tr className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-semibold text-gray-900">John Doe</td>
                <td className="px-6 py-4 text-gray-500">john@ksbm.ac.in</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Student</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#1a237e] hover:underline text-sm font-semibold">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
