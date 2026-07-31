"use client";
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export const useNotifications = () => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let eventSource = null;
    let reconnectTimeout = null;

    const connectSSE = () => {
      // Get the freshest token before connecting
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // If no token, wait and try again (maybe login is pending)
        reconnectTimeout = setTimeout(connectSSE, 5000);
        return;
      }

      const sseUrl = `${api.defaults.baseURL}/notifications/stream?token=${token}`;
      eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'CONNECTED') return;

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false, // Cleaner look without explicit button
            showCloseButton: true,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
              // Make entire toast body clickable for navigation
              toast.addEventListener('click', () => {
                if (data.type === 'NEW_GRIEVANCE') {
                  router.push('/admin/grievances');
                } else if (data.type === 'NEW_CONTACT') {
                  router.push('/admin/contact-submissions');
                }
                Swal.close();
              });
            }
          });

          Toast.fire({
            icon: 'info',
            title: data.title || 'New Notification',
            text: data.message || 'You have a new alert.',
            // Adding a small helper text
            footer: '<span style="font-size: 12px; color: #697A8D;">Click to view</span>'
          });

          setUnreadCount(prev => prev + 1);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error. Reconnecting with fresh token in 5s...', error);
        eventSource.close();
        reconnectTimeout = setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [router]);

  return { unreadCount, setUnreadCount };
};
