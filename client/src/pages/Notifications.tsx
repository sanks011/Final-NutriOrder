import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  ShoppingBag,
  Tag,
  Star,
  Settings,
  Heart,
  Trash2,
  CheckCheck,
  BellOff,
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications, Notification } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  switch (type) {
    case 'order':
      return <ShoppingBag className="w-5 h-5" />;
    case 'promo':
      return <Tag className="w-5 h-5" />;
    case 'loyalty':
      return <Star className="w-5 h-5" />;
    case 'health':
      return <Heart className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getTypeColor = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return 'bg-primary/10 text-primary';
    case 'promo':
      return 'bg-warning/10 text-warning';
    case 'loyalty':
      return 'bg-purple/10 text-purple';
    case 'health':
      return 'bg-success/10 text-success';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground">
                <span className="text-gradient-warm">Notifications</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="rounded-full gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="rounded-full gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear all</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {notifications.length > 0 ? (
          <div className="space-y-3 max-w-3xl mx-auto">
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    notification.read
                      ? 'bg-card border-border hover:border-primary/30'
                      : 'bg-primary/5 border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                      {notification.icon ? (
                        <span className="text-lg md:text-xl">{notification.icon}</span>
                      ) : (
                        <NotificationIcon type={notification.type} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-semibold ${notification.read ? 'text-foreground' : 'text-foreground'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge className="bg-primary/20 text-primary text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 md:py-20"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <BellOff className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
              No notifications
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base max-w-sm mx-auto">
              You're all caught up! We'll notify you when there's something new.
            </p>
            <Button onClick={() => navigate('/foods')} className="rounded-full">
              Browse Menu
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
