import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../features/home/Home';
import AdminLogin from '../features/admin/AdminLogin';
import DashboardOverview from '../features/admin/dashboard/DashboardOverview';
import ManageUsers from '../features/admin/dashboard/ManageUsers';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* Add more routes here later (e.g., /about, /campus) */}
        </Route>

        {/* Admin Login Route (No Layout Wrapper) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard Routes (Wrapped in AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default dashboard route */}
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="users" element={<ManageUsers />} />
          {/* Add future admin routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
