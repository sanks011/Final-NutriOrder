import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'order' | 'promo' | 'loyalty' | 'system' | 'health';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered!',
    message: 'Your order #ORD123 has been delivered. Enjoy your healthy meal!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    actionUrl: '/orders',
    icon: '🎉',
  },
  {
    id: '2',
    type: 'promo',
    title: '20% Off Today!',
    message: 'Use code HEALTHY20 for 20% off your next order. Valid today only!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    icon: '🏷️',
  },
  {
    id: '3',
    type: 'loyalty',
    title: 'Points Earned!',
    message: 'You earned 150 loyalty points from your last order. Keep ordering healthy!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    actionUrl: '/rewards',
    icon: '⭐',
  },
  {
    id: '4',
    type: 'health',
    title: 'Weekly Health Summary',
    message: 'You stayed within your calorie goal 5 out of 7 days this week. Great job!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    actionUrl: '/health-dashboard',
    icon: '💪',
  },
  {
    id: '5',
    type: 'system',
    title: 'New Restaurant Added',
    message: 'Check out "Green Garden Kitchen" - specializing in organic vegan dishes!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
    actionUrl: '/restaurants',
    icon: '🍽️',
  },
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('nutriorder-notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const saveToStorage = (items: Notification[]) => {
    localStorage.setItem('nutriorder-notifications', JSON.stringify(items));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };
      const updated = [newNotification, ...notifications];
      setNotifications(updated);
      saveToStorage(updated);
    },
    [notifications]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('nutriorder-notifications');
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
