import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../features/home/Home';
import Hero from '../features/home/components/Hero';
import Header from '../components/Header';
import AdminLogin from '../features/admin/AdminLogin';
import DashboardOverview from '../features/admin/dashboard/DashboardOverview';
import ManageUsers from '../features/admin/dashboard/ManageUsers';
import GenericCmsPage from '../features/admin/cms/GenericCmsPage';
import ManageHeader from '../features/admin/cms/ManageHeader';
import ManageAbout from '../features/admin/cms/ManageAbout';
import ManageHero from '../features/admin/cms/ManageHero';
import ManagePrograms from '../features/admin/cms/ManagePrograms';
import ManageAccreditation from '../features/admin/cms/ManageAccreditation';
import ManageManagement from '../features/admin/cms/ManageManagement';
import ManageFacilities from '../features/admin/cms/ManageFacilities';
import ManagePlacement from '../features/admin/cms/ManagePlacement';
import ManageTestimonials from '../features/admin/cms/ManageTestimonials';
import ManageAchievements from '../features/admin/cms/ManageAchievements';
import ProtectedRoute from './ProtectedRoute';

import AboutUs from '../features/about/AboutUs';
import Facilities from '../features/facilities/Facilities';
import ManageFacilitiesHero from '../features/admin/cms/ManageFacilitiesHero';
import ManageInstitutionalResources from '../features/admin/cms/ManageInstitutionalResources';
import ManageClubs from '../features/admin/cms/ManageClubs';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="facilities" element={<Facilities />} />
          {/* Add more routes here later (e.g., /campus) */}
        </Route>

        {/* Admin Login Route (No Layout Wrapper) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Live Preview Routes for Iframe */}
        <Route path="/preview/header" element={<Header />} />
        <Route path="/preview/hero" element={<Hero />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Default dashboard route */}
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="users" element={<ManageUsers />} />
          
          {/* CMS Stubs */}
          <Route path="cms/header" element={<ManageHeader />} />
          <Route path="cms/hero" element={<ManageHero />} />
          <Route path="cms/about" element={<ManageAbout />} />
          <Route path="cms/academics" element={<ManagePrograms />} />
          <Route path="cms/accreditation" element={<ManageAccreditation />} />
          <Route path="cms/management" element={<ManageManagement />} />
          <Route path="cms/facilities" element={<ManageFacilities />} />
          <Route path="cms/placement" element={<ManagePlacement />} />
          <Route path="cms/recruiters" element={<GenericCmsPage title="Recruiters" />} />
          <Route path="cms/testimonials" element={<ManageTestimonials />} />
          <Route path="cms/achievements" element={<ManageAchievements />} />
            <Route path="cms/news" element={<GenericCmsPage title="News" />} />
            <Route path="cms/life" element={<GenericCmsPage title="Life at KSBM" />} />
            <Route path="cms/footer" element={<GenericCmsPage title="Footer" />} />
            
            {/* Facilities Page CMS */}
            <Route path="cms/facilities/hero" element={<ManageFacilitiesHero />} />
            <Route path="cms/facilities/institutional-resources" element={<ManageInstitutionalResources />} />
            <Route path="cms/facilities/clubs" element={<ManageClubs />} />

            {/* Add future admin routes here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
