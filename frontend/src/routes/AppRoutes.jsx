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
import ManageClubDetails from '../features/admin/cms/ManageClubDetails';
import ClubPage from '../features/facilities/ClubPage';
import Faculty from '../features/faculty/Faculty';
import ManageFaculty from '../features/admin/cms/ManageFaculty';
import ProgramsLanding from '../features/programs/ProgramsLanding';
import MbaPage from '../features/programs/MbaPage';
import BbaPage from '../features/programs/BbaPage';
import ExaminationsLanding from '../features/examinations/ExaminationsLanding';
import AdmissionLanding from '../features/admission/AdmissionLanding';
import ContactLanding from '../features/contact/ContactLanding';
import ManageExaminationsPage from '../features/admin/cms/ManageExaminationsPage';
import ManageAdmissionsPage from '../features/admin/cms/ManageAdmissionsPage';
import ManagePlacementPage from '../features/admin/cms/ManagePlacementPage';
import ManageContactPage from '../features/admin/cms/ManageContactPage';
import ManageMbaPage from '../features/admin/cms/ManageMbaPage';
import ManageRecruiters from '../features/admin/cms/ManageRecruiters';
import ManageNews from '../features/admin/cms/ManageNews';
import ManageLifeAtKsbm from '../features/admin/cms/ManageLifeAtKsbm';
import ManageFooter from '../features/admin/cms/ManageFooter';
import ManageAlumni from '../features/admin/cms/ManageAlumni';
import ManageAboutUsHero from '../features/admin/cms/ManageAboutUsHero';
import ManageVisionMission from '../features/admin/cms/ManageVisionMission';
import ManageLeadership from '../features/admin/cms/ManageLeadership';
import ManageLegacy from '../features/admin/cms/ManageLegacy';
import ManageAboutUsStats from '../features/admin/cms/ManageAboutUsStats';
import ManageAdvisoryBoard from '../features/admin/cms/ManageAdvisoryBoard';
import ManageGoverningBody from '../features/admin/cms/ManageGoverningBody';
import ManageManagementDesk from '../features/admin/cms/ManageManagementDesk';
import ManageAboutCta from '../features/admin/cms/ManageAboutCta';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="facilities/club/:clubId" element={<ClubPage />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="people" element={<Faculty />} />
          <Route path="people/faculty" element={<Faculty />} />
          <Route path="programs" element={<ProgramsLanding />} />
          <Route path="programs/mba" element={<MbaPage />} />
          <Route path="programs/bba" element={<BbaPage />} />
          <Route path="program" element={<ProgramsLanding />} />
          <Route path="program/mba" element={<MbaPage />} />
          <Route path="program/bba" element={<BbaPage />} />
          <Route path="examinations" element={<ExaminationsLanding />} />
          <Route path="admission" element={<AdmissionLanding />} />
          <Route path="admissions" element={<AdmissionLanding />} />
          <Route path="contact" element={<ContactLanding />} />
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
          
          {/* CMS Pages */}
          <Route path="cms/header" element={<ManageHeader />} />
          <Route path="cms/hero" element={<ManageHero />} />
          <Route path="cms/about" element={<ManageAbout />} />
          <Route path="cms/academics" element={<ManagePrograms />} />
          <Route path="cms/accreditation" element={<ManageAccreditation />} />
          <Route path="cms/management" element={<ManageManagement />} />
          <Route path="cms/facilities" element={<ManageFacilities />} />
          <Route path="cms/placement" element={<ManagePlacement />} />
          <Route path="cms/recruiters" element={<ManageRecruiters />} />
          <Route path="cms/testimonials" element={<ManageTestimonials />} />
          <Route path="cms/achievements" element={<ManageAchievements />} />
          <Route path="cms/news" element={<ManageNews />} />
          <Route path="cms/life" element={<ManageLifeAtKsbm />} />
          <Route path="cms/footer" element={<ManageFooter />} />
          <Route path="cms/alumni" element={<ManageAlumni />} />
          
          {/* Programs CMS */}
          <Route path="cms/programs/mba" element={<ManageMbaPage isBba={false} />} />
          <Route path="cms/programs/bba" element={<ManageMbaPage isBba={true} />} />
          
          {/* About Us CMS */}
          <Route path="cms/about-us/hero" element={<ManageAboutUsHero />} />
          <Route path="cms/about-us/vision" element={<ManageVisionMission />} />
          <Route path="cms/about-us/leadership" element={<ManageLeadership />} />
          <Route path="cms/about-us/legacy" element={<ManageLegacy />} />
          <Route path="cms/about-us/stats" element={<ManageAboutUsStats />} />
          <Route path="cms/about-us/advisory" element={<ManageAdvisoryBoard />} />
          <Route path="cms/about-us/governing" element={<ManageGoverningBody />} />
          <Route path="cms/about-us/management-desk" element={<ManageManagementDesk />} />
          <Route path="cms/about-us/cta" element={<ManageAboutCta />} />
            
          {/* Facilities Page CMS */}
          <Route path="cms/facilities/hero" element={<ManageFacilitiesHero />} />
          <Route path="cms/facilities/institutional-resources" element={<ManageInstitutionalResources />} />
          <Route path="cms/facilities/clubs" element={<ManageClubs />} />
          <Route path="cms/facilities/clubs/:clubId" element={<ManageClubDetails />} />
          <Route path="cms/faculty" element={<ManageFaculty />} />
          <Route path="cms/people/faculty" element={<ManageFaculty />} />
          <Route path="cms/examinations" element={<ManageExaminationsPage />} />
          <Route path="cms/examinations-page" element={<ManageExaminationsPage />} />
          <Route path="cms/admissions" element={<ManageAdmissionsPage />} />
          <Route path="cms/admissions-page" element={<ManageAdmissionsPage />} />
          <Route path="cms/placement-page" element={<ManagePlacementPage />} />
          <Route path="cms/contact-page" element={<ManageContactPage />} />

            {/* Add future admin routes here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
