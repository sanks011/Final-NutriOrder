import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  XCircle,
  RefreshCw,
  Flame,
  Star,
  Calendar,
  FileText,
  ShoppingBag,
} from 'lucide-react';

import Layout from '@/components/common/Layout';
import PageTransition from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { orderAPI } from '@/services/api';
import { toast } from 'sonner';

/* =========================
   STATUS CONFIG (BACKEND)
========================= */

const statusConfig: any = {
  PLACED: {
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  CONFIRMED: {
    label: 'Confirmed',
    icon: CheckCircle2,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  PREPARING: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
  },
};

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH REAL ORDERS
  ========================= */

  useEffect(() => {
    orderAPI
      .getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleRepeatOrder = (order: any) => {
    order.items.forEach((item: any) => {
      addItem(item.food, item.quantity);
    });

    toast.success('Items added to cart!', {
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart'),
      },
    });
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <Layout>
        <PageTransition>
          <div className="min-h-[70vh] flex items-center justify-center">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  /* =========================
     EMPTY STATE
  ========================= */

  if (orders.length === 0) {
    return (
      <Layout>
        <PageTransition>
          <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start ordering healthy meals today!
            </p>
            <Button onClick={() => navigate('/foods')} className="rounded-full">
              Browse Menu
            </Button>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <Layout>
      <PageTransition>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary via-primary to-accent py-10">
          <div className="container mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm mb-3">
              <ShoppingBag className="w-4 h-4" />
              {orders.length} order{orders.length > 1 ? 's' : ''}
            </div>
            <h1 className="text-3xl font-bold text-white">Order History</h1>
            <p className="text-white/80 mt-2">
              Track your orders and nutrition journey
            </p>
          </div>
        </section>

        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4 space-y-6">
            {orders.map((order, index) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-3xl bg-card border"
                >
                  {/* Header */}
                  <div className="flex justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-lg">
                          Order #{order._id.slice(-6)}
                        </span>
                        <Badge className={`${status.bg} ${status.color} ${status.border} border`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                        <span>•</span>
                        {order.items.length} items
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {order.items.map((item: any) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50"
                      >
                        <img
                          src={item.food.image}
                          alt={item.food.name}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.food.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × ₹{item.food.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-wrap gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="rounded-full"
                    >
                      View Details
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleRepeatOrder(order)}
                      className="gap-2 rounded-full"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Repeat Order
                    </Button>

                    {order.status === 'DELIVERED' && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(`/orders/${order._id}/invoice`)
                        }
                        className="gap-2 rounded-full"
                      >
                        <FileText className="w-4 h-4" />
                        Invoice
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Orders;
