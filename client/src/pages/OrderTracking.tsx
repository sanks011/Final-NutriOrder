import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  ChefHat,
  Bike,
  CheckCircle,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  User,
  Star,
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { mockOrders } from '@/data/mockData';

const orderSteps = [
  { id: 'confirmed', label: 'Order Confirmed', icon: Package, time: '12:00 PM' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, time: '12:05 PM' },
  { id: 'picked', label: 'Picked Up', icon: Bike, time: '12:25 PM' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle, time: '12:45 PM' },
];

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [driverLocation, setDriverLocation] = useState({ lat: 19.076, lng: 72.877 });

  const order = mockOrders.find((o) => o.id === id) || mockOrders[2]; // Default to preparing order

  // Simulate order progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setEstimatedTime((prev) => Math.max(prev - 5, 0));
      
      // Simulate driver movement
      setDriverLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.002,
        lng: prev.lng + (Math.random() - 0.5) * 0.002,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const driver = {
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    vehicle: 'Honda Activa',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-6">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Track Your <span className="text-gradient-warm">Order</span>
          </h1>
          <p className="text-muted-foreground mt-1">Order #{order.id}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estimated Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                  <p className="text-4xl font-display font-bold text-foreground mt-1">
                    {estimatedTime} <span className="text-lg font-normal text-muted-foreground">min</span>
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Clock className="w-10 h-10 text-primary" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl bg-card border border-border"
            >
              <h3 className="font-display font-bold text-lg mb-6">Order Status</h3>
              
              <div className="relative">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isComplete = index < currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={step.id} className="flex gap-4 mb-8 last:mb-0">
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.1 : 1,
                            backgroundColor: isComplete || isCurrent
                              ? 'hsl(var(--primary))'
                              : 'hsl(var(--muted))',
                          }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isComplete || isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                        {index < orderSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 mt-2 ${
                              isComplete ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className={`font-semibold ${isCurrent ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {isComplete || isCurrent ? step.time : 'Pending'}
                        </p>
                        {isCurrent && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-primary mt-1"
                          >
                            {step.id === 'preparing' && 'Chef is preparing your healthy meal...'}
                            {step.id === 'picked' && 'Driver has picked up your order...'}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl overflow-hidden border border-border h-64 md:h-80 relative bg-muted"
            >
              {/* Simulated Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-success/5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              
              {/* Delivery Path */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                <motion.path
                  d="M 50 250 Q 150 150 200 180 T 350 80"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
                {/* Restaurant marker */}
                <circle cx="50" cy="250" r="8" fill="hsl(var(--primary))" />
                {/* Destination marker */}
                <circle cx="350" cy="80" r="8" fill="hsl(var(--success))" />
              </svg>

              {/* Driver Marker */}
              <motion.div
                animate={{
                  left: `${30 + currentStep * 20}%`,
                  top: `${70 - currentStep * 15}%`,
                }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-full h-full rounded-full bg-primary shadow-lg flex items-center justify-center animate-pulse">
                  <Bike className="w-6 h-6 text-primary-foreground" />
                </div>
              </motion.div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  Restaurant
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  Your Location
                </span>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Driver Info */}
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-3xl bg-card border border-border"
              >
                <h3 className="font-display font-bold text-lg mb-4">Your Delivery Partner</h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={driver.image}
                    alt={driver.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{driver.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      {driver.rating} rating
                    </div>
                    <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-card border border-border"
            >
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Address
              </h3>
              <p className="text-foreground">{order.address}</p>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-3xl bg-card border border-border"
            >
              <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.food.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">₹{item.food.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{order.total}</span>
                </div>
              </div>
            </motion.div>

            {/* Nutrition Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
            >
              <h3 className="font-display font-bold text-lg mb-2">Health Score</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-success">{order.nutritionScore}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Calories</p>
                  <p className="font-semibold text-foreground">{order.totalCalories} kcal</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
