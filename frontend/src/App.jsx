import { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import Loader from './components/Loader';
import './App.css';

function App() {
  const [domLoaded, setDomLoaded] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const handleApiLoading = (e) => {
      setApiLoading(e.detail);
    };
    window.addEventListener('axios-loading', handleApiLoading);

    const handleLoad = () => {
      // Add a tiny delay to ensure smooth transition
      setTimeout(() => setDomLoaded(true), 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback in case load event gets stuck
      setTimeout(handleLoad, 5000);
    }

    return () => {
      window.removeEventListener('axios-loading', handleApiLoading);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const loading = !domLoaded || apiLoading;

  return (
    <>
      {loading && (
        <Loader fullScreen={true} theme="dark" text="Loading Experience" />
      )}
      
      {/* We keep the app mounted in the background but hidden so it can load its assets */}
      <div className={loading ? 'opacity-0 h-screen overflow-hidden w-full' : 'opacity-100 transition-opacity duration-700 ease-in-out w-full overflow-x-hidden'}>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
