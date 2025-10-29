import React, { useState } from 'react';
import { FaTimes, FaCheck, FaCheckDouble, FaSpinner } from 'react-icons/fa';
import { NotificationData } from '../../services/socket.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ModalTranslations } from '@/transalations/CommonTransaltion';
import { isValidLanguageCode } from '@/Utils/languageUtils';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onRefresh,
}) => {
  const [markingAsRead, setMarkingAsRead] = useState<Set<string>>(new Set());
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = ModalTranslations[currentLanguage];

  if (!isOpen) return null;

  const handleMarkAsRead = async (notificationId: string) => {
    setMarkingAsRead(prev => new Set(prev).add(notificationId));
    try {
      await onMarkAsRead(notificationId);
    } finally {
      setMarkingAsRead(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAllAsRead(true);
    try {
      await onMarkAllAsRead();
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'successful_extraction':
        return '✅';
      case 'failed_scan':
        return '❌';
      case 'forwarding_error':
        return '⚠️';
      default:
        return '📨';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'successful_extraction':
        return 'text-green-600';
      case 'failed_scan':
        return 'text-red-600';
      case 'forwarding_error':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Glass backdrop overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-white/10 transition-all duration-300"
        onClick={onClose}
      />
      <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col border border-gray-200/50 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-900">{t.notifications}</h2>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {markingAllAsRead ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  t.markAllAsRead
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">{t.loading}</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <p className="text-gray-400">{t.noNotifications}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id || notification._id || `notification-${index}-${notification.createdAt}`}
                  className={`p-4 ${
                    notification.isRead ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium text-sm ${getNotificationColor(notification.type)}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {formatDate(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id || notification._id || '')}
                            disabled={markingAsRead.has(notification.id || notification._id || '')}
                            className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            {markingAsRead.has(notification.id || '') ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              "Mark as read"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onRefresh}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 