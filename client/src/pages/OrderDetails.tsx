import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  XCircle,
  MapPin,
  Phone,
  User,
  FileText,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useCart } from '@/context/CartContext';
import { orderAPI } from '@/services/api';
import { toast } from 'sonner';

/* =========================
   STATUS CONFIG
========================= */

const statusConfig = {
  PLACED: {
    label: 'Pending',
    icon: Clock,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  PREPARING: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
};

const cancellationReasons = [
  'Changed my mind',
  'Found better deal elsewhere',
  'Ordered by mistake',
  'Delivery time too long',
  'Item out of stock',
  'Other',
];

const refundReasons = [
  'Item not delivered',
  'Wrong item received',
  'Item damaged/spoiled',
  'Quality not as expected',
  'Missing items',
  'Other',
];

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  /* =========================
     FETCH ORDER
  ========================= */

  useEffect(() => {
    if (!id) return;

    orderAPI
      .getById(id)
      .then((res) => setOrder(res.data))
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">Order not found</h2>
          <Button onClick={() => navigate('/orders')}>View Orders</Button>
        </div>
      </Layout>
    );
  }

  const status = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  const handleRepeatOrder = () => {
    order.items.forEach((item: any) => {
      addItem(item.food, item.quantity);
    });

    toast.success('Items added to cart', {
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart'),
      },
    });
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  /* =========================
     UI
  ========================= */

  return (
    <Layout>
      <div className="min-h-screen py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Order #{order._id.slice(-6)}</h1>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${status.bg} mb-6`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl">
                <StatusIcon className={`w-7 h-7 ${status.color}`} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${status.color}`}>
                  {status.label}
                </h2>
              </div>
            </div>
          </motion.div>

          {/* Items */}
          <div className="bg-card rounded-2xl border p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex gap-4">
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.food.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ₹{item.food.price}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{item.food.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleRepeatOrder} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Repeat Order
            </Button>

            {order.status === 'DELIVERED' && (
              <Button
                variant="outline"
                onClick={() => navigate(`/orders/${order._id}/invoice`)}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Invoice
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
