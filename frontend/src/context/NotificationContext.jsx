"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Set up SSE
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let eventSource = null;
    let reconnectTimeout = null;

    const connectSSE = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        reconnectTimeout = setTimeout(connectSSE, 5000);
        return;
      }

      const sseUrl = `${api.defaults.baseURL}/notifications/stream?token=${token}`;
      eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'CONNECTED') return;

          // Add the new notification to the state immediately
          setNotifications(prev => [data, ...prev]);
          setUnreadCount(prev => prev + 1);

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
              toast.addEventListener('click', () => {
                markAsRead(data._id); // Mark read when clicking the toast
                if (data.link) {
                  router.push(data.link);
                }
                Swal.close();
              });
            }
          });

          Toast.fire({
            icon: 'info',
            title: data.title || 'New Notification',
            text: data.message || 'You have a new alert.',
            footer: '<span style="font-size: 12px; color: #697A8D;">Click to view</span>'
          });

        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.warn('SSE connection interrupted. Reconnecting with fresh token in 5s...');
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

  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      await api.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error('Error marking as read:', error);
      // Revert if error occurs by re-fetching
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      
      await api.put(`/notifications/read-all`);
    } catch (error) {
      console.error('Error marking all as read:', error);
      fetchNotifications();
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
