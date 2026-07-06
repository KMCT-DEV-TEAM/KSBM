import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 
        If you later want the Header to appear on ALL pages, 
        you can move <Header /> from the Home component to right here, above <main> 
      */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
