import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../features/home/Home';
import AdminLogin from '../features/admin/AdminLogin';
import DashboardOverview from '../features/admin/dashboard/DashboardOverview';
import ManageUsers from '../features/admin/dashboard/ManageUsers';
import GenericCmsPage from '../features/admin/cms/GenericCmsPage';
import ManageHeader from '../features/admin/cms/ManageHeader';
import ManageAbout from '../features/admin/cms/ManageAbout';
import ProtectedRoute from './ProtectedRoute';

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

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Default dashboard route */}
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="users" element={<ManageUsers />} />
          
          {/* CMS Stubs */}
          <Route path="cms/header" element={<ManageHeader />} />
          <Route path="cms/hero" element={<GenericCmsPage title="Hero Section" />} />
          <Route path="cms/about" element={<ManageAbout />} />
          <Route path="cms/academics" element={<GenericCmsPage title="Academic Programs" />} />
          <Route path="cms/accreditation" element={<GenericCmsPage title="Accreditation" />} />
          <Route path="cms/facilities" element={<GenericCmsPage title="Facilities" />} />
          <Route path="cms/placement" element={<GenericCmsPage title="Placement" />} />
          <Route path="cms/recruiters" element={<GenericCmsPage title="Recruiters" />} />
          <Route path="cms/testimonials" element={<GenericCmsPage title="Testimonials" />} />
          <Route path="cms/achievements" element={<GenericCmsPage title="Achievements" />} />
            <Route path="cms/news" element={<GenericCmsPage title="News" />} />
            <Route path="cms/life" element={<GenericCmsPage title="Life at KSBM" />} />
            <Route path="cms/footer" element={<GenericCmsPage title="Footer" />} />

            {/* Add future admin routes here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
