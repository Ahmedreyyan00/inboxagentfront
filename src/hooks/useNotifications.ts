import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { SocketService, NotificationData } from '../services/socket.service';
import Api from '../lib/Api';
import toast from 'react-hot-toast';

export interface UseNotificationsResult {
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  isConnected: boolean;
}

export const useNotifications = (): UseNotificationsResult => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const socketService = SocketService.getInstance();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      const response = await Api.getNotifications();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  // Fetch unread count from API
  const fetchUnreadCount = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      const response = await Api.getUnreadNotificationCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [session?.accessToken]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!session?.accessToken) return;

    try {
      await Api.markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Acknowledge the notification via socket
      socketService.acknowledgeNotification(notificationId);
      
      // Refresh unread count
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  }, [session?.accessToken, socketService, fetchUnreadCount]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      await Api.markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  }, [session?.accessToken]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  // Handle new notifications from socket
  const handleNewNotification = useCallback((notification: NotificationData) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    toast.success(notification.title, {
      duration: 4000,
      position: 'top-right',
    });
  }, []);

  // Handle notification count updates from socket
  const handleNotificationCount = useCallback((data: { count: number }) => {
    setUnreadCount(data.count);
  }, []);

  // Setup socket connection and event handlers
  useEffect(() => {
    if (!session?.accessToken) return;

    // Connect to socket
    socketService.connect(session.accessToken);
    setIsConnected(socketService.isConnected());

    // Setup event handlers
    const unsubscribeNotification = socketService.onNotification(handleNewNotification);
    const unsubscribeCount = socketService.onNotificationCount(handleNotificationCount);

    // Check connection status periodically
    const connectionCheckInterval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 5000);

    // Cleanup
    return () => {
      unsubscribeNotification();
      unsubscribeCount();
      clearInterval(connectionCheckInterval);
    };
  }, [session?.accessToken, handleNewNotification, handleNotificationCount, socketService]);

  // Initial data fetch
  useEffect(() => {
    if (session?.accessToken) {
      refreshNotifications();
    }
  }, [session?.accessToken, refreshNotifications]);

  // Cleanup socket connection on unmount
  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, [socketService]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    isConnected,
  };
}; 