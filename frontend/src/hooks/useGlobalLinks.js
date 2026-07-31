import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useGlobalLinks = () => {
  const [links, setLinks] = useState({});

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data } = await api.get('/cms/global-buttons');
        const linkMap = {};
        if (Array.isArray(data)) {
          data.forEach(btn => {
            linkMap[btn.identifier] = btn;
          });
        }
        setLinks(linkMap);
      } catch (error) {
        console.error('Failed to fetch global links', error);
      }
    };
    fetchLinks();
  }, []);

  return links;
};
