import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from "@/services/api";
import { motion } from 'framer-motion';
import PageTransition from '@/components/common/PageTransition';
import {
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  ChevronRight,
  ShoppingBag,
  Flame,
  AlertTriangle,
  Leaf,
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useHealth } from '@/context/HealthContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import LoyaltyCheckout from '@/components/checkout/LoyaltyCheckout';
import { toast } from 'sonner';

const savedAddresses = [
  {
    id: '1',
    label: 'Home',
    address: '123 Health Street, Wellness City, 400001',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    address: '456 Fitness Lane, Business Park, 400002',
    isDefault: false,
  },
];

const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Pay via UPI apps',
    icon: Smartphone,
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with card',
    icon: CreditCard,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: Banknote,
  },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalNutrition, clearCart } = useCart();
  const { healthProfile, checkFoodSafety } = useHealth();
  const { appliedReward, calculateDiscount, clearAppliedReward, earnPoints } = useLoyalty();
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0].id);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    city: '',
    pincode: '',
  });

  const totalNutrition = getTotalNutrition();
  const subtotal = getTotalPrice();
  const deliveryFee = appliedReward?.name === 'Free Delivery' ? 0 : 40;
  const loyaltyDiscount = calculateDiscount(subtotal);
  const tax = Math.round((subtotal - loyaltyDiscount) * 0.05);
  const total = subtotal + deliveryFee + tax - loyaltyDiscount;

  const hasHealthWarnings = items.some((item) => !checkFoodSafety(item.food).isSafe);
  const hasHealthyItems = items.some((item) => item.food.isDiabeticSafe || item.food.isVegan);

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      // Real backend call
      await orderAPI.create();

      const orderId = `ord_${Date.now()}`;

      const orderData = {
        id: orderId,
        items: items.map((item) => ({
          food: item.food,
          quantity: item.quantity,
        })),
        total,
        createdAt: new Date().toISOString(),
      };

      const pointsEarned = earnPoints(orderId, subtotal, hasHealthyItems);

      if (appliedReward) clearAppliedReward();

      toast.success('Order placed successfully!', {
        description: `You earned ${pointsEarned} points`,
      });

      clearCart();

      navigate(`/orders/${orderId}/invoice`, {
        state: { orderData, pointsEarned },
      });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Nothing to checkout
            </h2>
            <p className="text-muted-foreground mb-6">
              Add items to your cart first
            </p>
            <Button onClick={() => navigate('/foods')} size="lg" className="rounded-full btn-soft">
              Browse Menu
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-10 md:py-14">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            Checkout
          </h1>
          <p className="text-white/80 mt-2">
            Complete your order • {items.length} item{items.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-card border border-border"
            >
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                Delivery Address
              </h2>

              <RadioGroup
                value={selectedAddress}
                onValueChange={setSelectedAddress}
                className="space-y-3"
              >
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedAddress === addr.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{addr.label}</span>
                        {addr.isDefault && (
                          <Badge variant="secondary" className="text-xs rounded-full">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {addr.address}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {!showNewAddress ? (
                <Button
                  variant="outline"
                  className="mt-4 w-full rounded-2xl"
                  onClick={() => setShowNewAddress(true)}
                >
                  + Add New Address
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 rounded-2xl border border-border space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        placeholder="Home, Office, etc."
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        placeholder="400001"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address, building, etc."
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewAddress(false)}
                      className="flex-1 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1 rounded-xl">Save Address</Button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl bg-card border border-border"
            >
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                Payment Method
              </h2>

              <RadioGroup
                value={selectedPayment}
                onValueChange={setSelectedPayment}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedPayment === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold">{method.name}</span>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </RadioGroup>
            </motion.div>

            {/* Order Items Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl bg-card border border-border"
            >
              <h2 className="font-display font-bold text-lg mb-4">
                Order Items ({items.length})
              </h2>

              <div className="space-y-3">
                {items.map((item) => {
                  const safety = checkFoodSafety(item.food);
                  return (
                    <div
                      key={item.food._id}
                      className={`flex items-center gap-4 p-3 rounded-2xl transition-colors ${
                        !safety.isSafe ? 'bg-destructive/5 border border-destructive/20' : 'bg-muted/50'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={item.food.image}
                          alt={item.food.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        {!safety.isSafe && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                            <AlertTriangle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-1">
                          {item.food.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-xs flex items-center gap-1 text-primary">
                            <Flame className="w-3 h-3" />
                            {item.food.nutrition.calories * item.quantity} kcal
                          </span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {item.food.isDiabeticSafe && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-success/30 text-success">
                              <Check className="w-2.5 h-2.5 mr-0.5" />
                              Safe
                            </Badge>
                          )}
                          {item.food.isVegan && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-success/30 text-success">
                              <Leaf className="w-2.5 h-2.5 mr-0.5" />
                              Vegan
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-primary">
                        ₹{item.food.price * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Nutrition Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20"
              >
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary" />
                  Order Nutrition
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-2xl bg-card/80 border border-border/50">
                    <p className="text-2xl font-bold text-primary">
                      {totalNutrition.calories}
                    </p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-card/80 border border-border/50">
                    <p className="text-2xl font-bold text-success">
                      {totalNutrition.protein}g
                    </p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-card/80 border border-border/50">
                    <p className="text-2xl font-bold text-purple">
                      {totalNutrition.carbs}g
                    </p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-card/80 border border-border/50">
                    <p className="text-2xl font-bold text-coral">
                      {totalNutrition.fat}g
                    </p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                </div>
                
                {/* Sugar & Sodium */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between p-2 rounded-xl bg-card/50">
                    <span className="text-muted-foreground">Sugar</span>
                    <span className="font-medium">{totalNutrition.sugar}g</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-card/50">
                    <span className="text-muted-foreground">Sodium</span>
                    <span className="font-medium">{totalNutrition.sodium}mg</span>
                  </div>
                </div>
              </motion.div>

              {/* Health Warning */}
              {hasHealthWarnings && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20"
                >
                  <h4 className="font-semibold text-destructive flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Health Notice
                  </h4>
                  <p className="text-xs text-destructive/80 mt-1">
                    Some items may conflict with your health profile.
                  </p>
                </motion.div>
              )}

              {/* Loyalty Section */}
              <LoyaltyCheckout subtotal={subtotal} />

              {/* Order Total */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-3xl bg-card border border-border"
              >
                <h3 className="font-display font-bold text-lg mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Loyalty Discount</span>
                      <span className="font-medium">-₹{loyaltyDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes (5%)</span>
                    <span className="font-medium">₹{tax}</span>
                  </div>
                  <div className="h-px bg-border my-3" />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">₹{total}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full mt-6 h-14 rounded-2xl btn-soft text-base font-semibold"
                  size="lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Place Order • ₹{total}
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      </PageTransition>
    </Layout>
  );
};

export default Checkout;
