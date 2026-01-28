import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  ArrowRight,
  Flame,
  ShoppingBag,
  Leaf,
  Check,
  ChefHat,
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import PageTransition from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useHealth } from '@/context/HealthContext';
import ProgressRing from '@/components/health/ProgressRing';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalNutrition,
  } = useCart();
  const { healthProfile, checkFoodSafety } = useHealth();

  const totalNutrition = getTotalNutrition();
  const calorieLimit = healthProfile?.calorieLimit || 2000;
  const caloriePercentage = Math.min(
    (totalNutrition.calories / calorieLimit) * 100,
    100
  );
  const isOverCalorieLimit = totalNutrition.calories > calorieLimit;
  const isSugarHigh = healthProfile?.sugarLimit
    ? totalNutrition.sugar > healthProfile.sugarLimit * 0.5
    : false;
  const isSodiumHigh = healthProfile?.sodiumLimit
    ? totalNutrition.sodium > healthProfile.sodiumLimit * 0.5
    : false;

  if (items.length === 0) {
    return (
      <Layout>
        <PageTransition>
          <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-background">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Add some healthy dishes to get started!
              </p>
              <Button onClick={() => navigate('/foods')} size="lg" className="rounded-full btn-soft">
                Explore Menu
              </Button>
            </motion.div>
          </div>
        </PageTransition>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-3">
                  <ShoppingCart className="w-4 h-4" />
                  {items.length} item{items.length > 1 ? 's' : ''} in cart
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  Your Cart
                </h1>
                <p className="text-white/80 mt-2">
                  Review your healthy selection
                </p>
              </div>
              <Button 
                variant="secondary" 
                onClick={clearCart} 
                className="rounded-full bg-white/20 text-white hover:bg-white/30 border-0"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 bg-background">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 || !items.some(item => item && item.food) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No items in cart or still loading...</p>
                </div>
              ) : (
                <AnimatePresence>
                  {items
                    .filter(item => item && item.food)
                    .map((item, index) => {
                      if (!item.food) return null;
                      const safety = checkFoodSafety(item.food);
                      const foodId = item.food._id || item.food.id || `item-${index}`;
                    return (
                      <motion.div
                        key={foodId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`p-4 md:p-5 rounded-3xl bg-card border-2 transition-all ${
                          !safety.isSafe 
                            ? 'border-destructive/30 bg-destructive/5' 
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="relative">
                            {item.food.image && (
                              <img
                                src={item.food.image}
                                alt={item.food.name || 'Food'}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover"
                              />
                            )}
                          {!safety.isSafe && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display font-semibold text-foreground line-clamp-1 text-lg">
                                {item.food.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.food.restaurant?.name || 'Restaurant'}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(foodId)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.food.isDiabeticSafe && (
                              <Badge className="bg-success/15 text-success border-success/30 text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Diabetic Safe
                              </Badge>
                            )}
                            {item.food.isVegan && (
                              <Badge className="bg-success/15 text-success border-success/30 text-xs">
                                <Leaf className="w-3 h-3 mr-1" />
                                Vegan
                              </Badge>
                            )}
                          </div>

                          {/* Nutrition Info */}
                          {item.food.nutrition ? (
                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                <Flame className="w-3 h-3" />
                                {item.food.nutrition.calories} kcal
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                                P: {item.food.nutrition.protein}g
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                                C: {item.food.nutrition.carbs}g
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                                F: {item.food.nutrition.fat}g
                              </span>
                            </div>
                          ) : (
                            <div className="mt-3 p-2 rounded-xl bg-muted/50 text-xs text-muted-foreground">
                              Nutrition info not available
                            </div>
                          )}

                          {/* Warning */}
                          {!safety.isSafe && (
                            <div className="mt-3 p-2 rounded-xl bg-destructive/10 text-xs text-destructive">
                              <AlertTriangle className="inline w-3 h-3 mr-1" />
                              {safety.warnings[0]}
                            </div>
                          )}

                          {/* Quantity & Price */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(foodId, item.quantity - 1)}
                                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-bold text-lg w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(foodId, item.quantity + 1)}
                                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-xl font-bold text-primary">
                              ₹{(item.food.price || 0) * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              )}
              <div className="sticky top-28 space-y-6">
                {/* Nutrition Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 border-2 border-primary/20"
                >
                  <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-primary" />
                    Nutrition Summary
                  </h3>

                  {/* Calorie Progress */}
                  <div className="flex items-center justify-center mb-6">
                    <ProgressRing
                      progress={caloriePercentage}
                      size={130}
                      strokeWidth={12}
                      color={isOverCalorieLimit ? 'destructive' : 'primary'}
                    >
                      <div className="text-center">
                        <p
                          className={`text-2xl font-bold ${
                            isOverCalorieLimit ? 'text-destructive' : 'text-foreground'
                          }`}
                        >
                          {totalNutrition.calories}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          / {calorieLimit} kcal
                        </p>
                      </div>
                    </ProgressRing>
                  </div>

                  {/* Macro Breakdown */}
                  <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    <div className="p-3 rounded-2xl bg-card border border-border">
                      <p className="text-lg font-bold text-primary">
                        {totalNutrition.protein}g
                      </p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-card border border-border">
                      <p className="text-lg font-bold text-accent-foreground">
                        {totalNutrition.carbs}g
                      </p>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-card border border-border">
                      <p className="text-lg font-bold text-primary">
                        {totalNutrition.fat}g
                      </p>
                      <p className="text-xs text-muted-foreground">Fat</p>
                    </div>
                  </div>

                  {/* Additional Nutrients */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 rounded-xl bg-card">
                      <span className="text-muted-foreground">Sugar</span>
                      <span
                        className={`font-medium ${isSugarHigh ? 'text-destructive' : 'text-foreground'}`}
                      >
                        {totalNutrition.sugar}g
                        {isSugarHigh && <AlertTriangle className="inline w-3 h-3 ml-1" />}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-card">
                      <span className="text-muted-foreground">Sodium</span>
                      <span
                        className={`font-medium ${isSodiumHigh ? 'text-destructive' : 'text-foreground'}`}
                      >
                        {totalNutrition.sodium}mg
                        {isSodiumHigh && <AlertTriangle className="inline w-3 h-3 ml-1" />}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Health Warnings */}
                {(isOverCalorieLimit || isSugarHigh || isSodiumHigh) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/20"
                  >
                    <h4 className="font-semibold text-destructive flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Health Alert
                    </h4>
                    <ul className="text-sm text-destructive/80 space-y-1">
                      {isOverCalorieLimit && <li>• Exceeds daily calorie limit</li>}
                      {isSugarHigh && <li>• High sugar - may affect blood sugar</li>}
                      {isSodiumHigh && <li>• High sodium - may affect blood pressure</li>}
                    </ul>
                  </motion.div>
                )}

                {/* Order Total */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-3xl bg-card border-2 border-border"
                >
                  <h3 className="font-display font-bold text-lg mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-medium">₹40</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes (5%)</span>
                      <span className="font-medium">₹{Math.round(getTotalPrice() * 0.05)}</span>
                    </div>
                    <div className="h-px bg-border my-3" />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">
                        ₹{getTotalPrice() + 40 + Math.round(getTotalPrice() * 0.05)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/checkout')}
                    className="w-full mt-6 h-14 rounded-2xl btn-soft text-base font-semibold"
                    size="lg"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
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

export default Cart;
