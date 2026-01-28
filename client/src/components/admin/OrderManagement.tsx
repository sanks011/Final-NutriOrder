import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  Package,
  XCircle,
  Phone,
  MapPin,
  User,
  Calendar,
  Search,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  food: {
    name: string;
    image: string;
    price: number;
    nutrition: {
      calories: number;
    };
  };
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  nutritionScore: number;
  totalCalories: number;
  address: string;
  customer?: {
    name: string;
    phone: string;
    email: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
}

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  preparing: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    icon: Truck,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
};

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

// Extended mock orders with customer details
const initialOrders: Order[] = [
  {
    id: 'ord1',
    items: [
      { id: '1', food: { name: 'Grilled Chicken Quinoa Bowl', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', price: 299, nutrition: { calories: 420 } }, quantity: 2 },
      { id: '2', food: { name: 'Salmon Avocado Poke Bowl', image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=500', price: 449, nutrition: { calories: 520 } }, quantity: 1 },
    ],
    total: 1047,
    status: 'delivered',
    createdAt: '2024-12-20T14:30:00Z',
    nutritionScore: 85,
    totalCalories: 1360,
    address: '123 Health Street, Wellness City',
    customer: { name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@example.com' },
  },
  {
    id: 'ord2',
    items: [
      { id: '3', food: { name: 'Vegan Buddha Bowl', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500', price: 279, nutrition: { calories: 450 } }, quantity: 1 },
    ],
    total: 279,
    status: 'out_for_delivery',
    createdAt: '2024-12-24T10:00:00Z',
    nutritionScore: 78,
    totalCalories: 450,
    address: '456 Green Avenue, Eco Town',
    customer: { name: 'Priya Patel', phone: '+91 87654 32109', email: 'priya@example.com' },
    driver: { name: 'Vijay Kumar', phone: '+91 76543 21098' },
  },
  {
    id: 'ord3',
    items: [
      { id: '4', food: { name: 'Mediterranean Veggie Wrap', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500', price: 199, nutrition: { calories: 380 } }, quantity: 2 },
      { id: '5', food: { name: 'Keto Steak Salad', image: 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=500', price: 399, nutrition: { calories: 580 } }, quantity: 1 },
    ],
    total: 797,
    status: 'preparing',
    createdAt: '2024-12-24T12:00:00Z',
    nutritionScore: 72,
    totalCalories: 1340,
    address: '789 Fitness Lane, Health District',
    customer: { name: 'Amit Singh', phone: '+91 65432 10987', email: 'amit@example.com' },
  },
  {
    id: 'ord4',
    items: [
      { id: '6', food: { name: 'Green Detox Smoothie Bowl', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500', price: 229, nutrition: { calories: 340 } }, quantity: 2 },
    ],
    total: 458,
    status: 'pending',
    createdAt: '2024-12-24T13:30:00Z',
    nutritionScore: 88,
    totalCalories: 680,
    address: '321 Organic Street, Fresh Town',
    customer: { name: 'Sneha Gupta', phone: '+91 54321 09876', email: 'sneha@example.com' },
  },
  {
    id: 'ord5',
    items: [
      { id: '7', food: { name: 'Spicy Thai Basil Chicken', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500', price: 329, nutrition: { calories: 520 } }, quantity: 1 },
    ],
    total: 329,
    status: 'confirmed',
    createdAt: '2024-12-24T14:00:00Z',
    nutritionScore: 65,
    totalCalories: 520,
    address: '555 Spice Road, Flavor City',
    customer: { name: 'Karan Mehta', phone: '+91 43210 98765', email: 'karan@example.com' },
  },
];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order #${orderId.toUpperCase()} status updated to ${statusConfig[newStatus].label}`);
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= statusFlow.length - 1) return null;
    return statusFlow[currentIndex + 1];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing' || o.status === 'confirmed').length,
    outForDelivery: orders.filter((o) => o.status === 'out_for_delivery').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold">{orderStats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-yellow-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
        </div>
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-orange-600">Preparing</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{orderStats.preparing}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-purple-600">Out for Delivery</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{orderStats.outForDelivery}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600">Delivered</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] h-12 rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const nextStatus = getNextStatus(order.status);
            const isExpanded = expandedOrders.has(order.id);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center`}>
                        <StatusIcon className={`w-6 h-6 ${status.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Order #{order.id.toUpperCase()}</span>
                          <Badge className={`${status.bg} ${status.color} border-0`}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {order.customer?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{order.total}</p>
                        <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="p-4 space-y-4">
                        {/* Customer & Delivery Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-muted">
                            <h4 className="font-medium text-sm mb-2">Customer Details</h4>
                            <div className="space-y-1 text-sm">
                              <p className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                {order.customer?.name}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                {order.customer?.phone}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                {order.address}
                              </p>
                            </div>
                          </div>

                          {order.driver && (
                            <div className="p-3 rounded-lg bg-muted">
                              <h4 className="font-medium text-sm mb-2">Delivery Driver</h4>
                              <div className="space-y-1 text-sm">
                                <p className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  {order.driver.name}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  {order.driver.phone}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Order Items</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 p-2 rounded-lg bg-muted"
                              >
                                <img
                                  src={item.food.image}
                                  alt={item.food.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm line-clamp-1">{item.food.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.quantity} × ₹{item.food.price}
                                  </p>
                                </div>
                                <p className="font-medium text-sm">₹{item.quantity * item.food.price}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Update Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground mr-2">Update Status:</span>
                          {statusFlow.map((s) => {
                            const config = statusConfig[s];
                            const isActive = order.status === s;
                            return (
                              <Button
                                key={s}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, s)}
                                className={isActive ? '' : `${config.color} hover:${config.bg}`}
                              >
                                <config.icon className="w-4 h-4 mr-1" />
                                {config.label}
                              </Button>
                            );
                          })}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>

                        {/* Quick Action */}
                        {nextStatus && order.status !== 'cancelled' && (
                          <div className="flex justify-end">
                            <Button
                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                              className="gap-2"
                            >
                              Mark as {statusConfig[nextStatus].label}
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id.toUpperCase()}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <p>Order details would go here...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
