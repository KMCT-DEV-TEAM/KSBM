import { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Add a tiny delay to ensure smooth transition
      setTimeout(() => setLoading(false), 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback in case load event gets stuck
      setTimeout(handleLoad, 5000);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#1e2869] border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-[#1e2869] font-bold tracking-widest uppercase text-sm animate-pulse">Loading</p>
        </div>
      )}
      
      {/* We keep the app mounted in the background but hidden so it can load its assets */}
      <div className={loading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100 transition-opacity duration-700 ease-in-out'}>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
