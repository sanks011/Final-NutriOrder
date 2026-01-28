import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  MapPin,
  Phone,
  Navigation,
  Clock,
  CheckCircle2,
  Truck,
  ChefHat,
  User,
  DollarSign,
  Flame,
  ExternalLink,
  RefreshCw,
  LogOut,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface DeliveryOrder {
  id: string;
  status: 'ready' | 'picked_up' | 'on_the_way' | 'delivered';
  customer: {
    name: string;
    phone: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  restaurant: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  items: { name: string; quantity: number }[];
  total: number;
  estimatedTime: string;
  distance: string;
  earnings: number;
}

const initialOrders: DeliveryOrder[] = [
  {
    id: 'del1',
    status: 'ready',
    customer: {
      name: 'John Doe',
      phone: '+91 98765 43210',
      address: '123 Health Street, Wellness City, 400001',
      coordinates: { lat: 19.0760, lng: 72.8777 },
    },
    restaurant: {
      name: 'Health Hub Kitchen',
      address: '45 Nutrition Plaza, Mumbai',
      coordinates: { lat: 19.0896, lng: 72.8656 },
    },
    items: [
      { name: 'Grilled Chicken Quinoa Bowl', quantity: 2 },
      { name: 'Salmon Avocado Poke Bowl', quantity: 1 },
    ],
    total: 1047,
    estimatedTime: '15-20 min',
    distance: '2.3 km',
    earnings: 65,
  },
  {
    id: 'del2',
    status: 'picked_up',
    customer: {
      name: 'Priya Sharma',
      phone: '+91 98123 45678',
      address: '456 Fitness Lane, Business Park, 400002',
      coordinates: { lat: 19.1136, lng: 72.8697 },
    },
    restaurant: {
      name: 'Green Bites',
      address: '78 Organic Street, Mumbai',
      coordinates: { lat: 19.1064, lng: 72.8782 },
    },
    items: [
      { name: 'Vegan Buddha Bowl', quantity: 1 },
      { name: 'Mediterranean Veggie Wrap', quantity: 2 },
    ],
    total: 677,
    estimatedTime: '10-15 min',
    distance: '1.5 km',
    earnings: 50,
  },
  {
    id: 'del3',
    status: 'on_the_way',
    customer: {
      name: 'Rahul Verma',
      phone: '+91 99876 54321',
      address: '789 Protein Avenue, Gym Complex, 400003',
      coordinates: { lat: 19.0821, lng: 72.8416 },
    },
    restaurant: {
      name: 'Protein Bar',
      address: '12 Muscle Street, Mumbai',
      coordinates: { lat: 19.0728, lng: 72.8347 },
    },
    items: [
      { name: 'Keto Steak Salad', quantity: 1 },
      { name: 'Protein-Packed Egg White Omelette', quantity: 2 },
    ],
    total: 777,
    estimatedTime: '5-8 min',
    distance: '0.8 km',
    earnings: 40,
  },
];

const statusConfig = {
  ready: { label: 'Ready for Pickup', color: 'bg-yellow-500', icon: ChefHat },
  picked_up: { label: 'Picked Up', color: 'bg-blue-500', icon: Package },
  on_the_way: { label: 'On the Way', color: 'bg-primary', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-success', icon: CheckCircle2 },
};

const DeliveryDashboard: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>(initialOrders);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  const todayEarnings = orders
    .filter((o) => o.status === 'delivered')
    .reduce((acc, o) => acc + o.earnings, 0);

  const totalDeliveries = completedOrders.length;

  const updateOrderStatus = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;

        const statusFlow: DeliveryOrder['status'][] = ['ready', 'picked_up', 'on_the_way', 'delivered'];
        const currentIndex = statusFlow.indexOf(order.status);
        const nextStatus = statusFlow[currentIndex + 1];

        if (nextStatus) {
          const statusMessages = {
            picked_up: 'Order picked up from restaurant',
            on_the_way: 'Heading to customer location',
            delivered: 'Order delivered successfully!',
          };
          toast.success(statusMessages[nextStatus] || 'Status updated');
          return { ...order, status: nextStatus };
        }
        return order;
      })
    );
  };

  const openNavigation = (coords: { lat: number; lng: number }, address: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    window.open(url, '_blank');
    toast.info('Opening navigation', { description: address });
  };

  const callCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getNextActionLabel = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'ready':
        return 'Mark Picked Up';
      case 'picked_up':
        return 'Start Delivery';
      case 'on_the_way':
        return 'Complete Delivery';
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg">Delivery Partner</h1>
                <p className="text-xs text-muted-foreground">Welcome back, Driver</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isOnline ? 'text-success' : 'text-muted-foreground'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={(checked) => {
                    setIsOnline(checked);
                    toast.info(checked ? 'You are now online' : 'You are now offline');
                  }}
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-2xl bg-card/80 border border-border/50">
              <div className="flex items-center justify-center gap-1 text-success mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xl font-bold">₹{todayEarnings}</span>
              </div>
              <p className="text-xs text-muted-foreground">Today's Earnings</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-card/80 border border-border/50">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Package className="w-4 h-4" />
                <span className="text-xl font-bold">{totalDeliveries}</span>
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-card/80 border border-border/50">
              <div className="flex items-center justify-center gap-1 text-coral mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xl font-bold">{activeOrders.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2 p-1 rounded-full bg-muted w-fit mx-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed ({completedOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'active' ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {activeOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">No active orders</h3>
                  <p className="text-muted-foreground text-sm">
                    New orders will appear here when assigned
                  </p>
                </div>
              ) : (
                activeOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  const nextAction = getNextActionLabel(order.status);

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-3xl bg-card border border-border"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${status.color} flex items-center justify-center`}>
                            <StatusIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Order #{order.id.toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">{status.label}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-success font-bold">
                          +₹{order.earnings}
                        </Badge>
                      </div>

                      {/* Restaurant Info */}
                      <div className="p-4 rounded-2xl bg-muted/50 mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ChefHat className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{order.restaurant.name}</p>
                            <p className="text-xs text-muted-foreground">{order.restaurant.address}</p>
                          </div>
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openNavigation(order.restaurant.coordinates, order.restaurant.address)}
                              className="gap-1 rounded-full text-xs"
                            >
                              <Navigation className="w-3 h-3" />
                              Navigate
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{order.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{order.customer.address}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => callCustomer(order.customer.phone)}
                            className="gap-1 rounded-full text-xs flex-1"
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </Button>
                          {(order.status === 'picked_up' || order.status === 'on_the_way') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openNavigation(order.customer.coordinates, order.customer.address)}
                              className="gap-1 rounded-full text-xs flex-1"
                            >
                              <Navigation className="w-3 h-3" />
                              Navigate
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Order Items</p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {item.quantity}× {item.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {order.estimatedTime}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {order.distance}
                          </span>
                        </div>
                        <span className="font-bold text-primary">₹{order.total}</span>
                      </div>

                      {/* Action Button */}
                      {nextAction && (
                        <Button
                          onClick={() => updateOrderStatus(order.id)}
                          className="w-full rounded-2xl h-12 btn-soft"
                        >
                          {nextAction}
                        </Button>
                      )}
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {completedOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">No completed orders</h3>
                  <p className="text-muted-foreground text-sm">
                    Your completed deliveries will appear here
                  </p>
                </div>
              ) : (
                completedOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-3xl bg-card border border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-semibold">Order #{order.id.toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-success font-bold">
                          +₹{order.earnings}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Completed</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
