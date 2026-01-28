import React, { useState } from 'react';
import Layout from '@/components/common/Layout';
import { useSubscription, subscriptionPlans, DeliveryDay } from '@/context/SubscriptionContext';
import { mockFoods } from '@/data/mockData';
import { Food } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Check, 
  ChevronRight, 
  Clock, 
  Crown, 
  Leaf, 
  Minus, 
  Pause, 
  Play, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  Star, 
  Trash2, 
  Utensils, 
  X,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const days: { key: DeliveryDay; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

const mealTypes = [
  { key: 'breakfast' as const, label: 'Breakfast', icon: '🌅', time: '7-9 AM' },
  { key: 'lunch' as const, label: 'Lunch', icon: '☀️', time: '12-2 PM' },
  { key: 'dinner' as const, label: 'Dinner', icon: '🌙', time: '7-9 PM' },
];

const MealSubscription: React.FC = () => {
  const {
    subscription,
    draftMeals,
    selectedPlan,
    setSelectedPlan,
    addMealToSlot,
    removeMealFromSlot,
    createSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getWeeklyTotal,
    getMealCount,
  } = useSubscription();

  const [selectedSlot, setSelectedSlot] = useState<{ day: DeliveryDay; mealType: 'breakfast' | 'lunch' | 'dinner' } | null>(null);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<DeliveryDay>('monday');

  const { original, discounted, saved } = getWeeklyTotal();
  const mealCount = getMealCount();

  const getMealForSlot = (day: DeliveryDay, mealType: 'breakfast' | 'lunch' | 'dinner'): Food | null => {
    const slot = draftMeals.find(s => s.day === day && s.mealType === mealType);
    return slot?.food || null;
  };

  const handleSelectMeal = (food: Food) => {
    if (selectedSlot) {
      addMealToSlot(selectedSlot.day, selectedSlot.mealType, food);
      setMealDialogOpen(false);
      setSelectedSlot(null);
    }
  };

  const openMealSelector = (day: DeliveryDay, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedSlot({ day, mealType });
    setMealDialogOpen(true);
  };

  if (subscription) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Active Subscription Header */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                      <Crown className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">
                          {typeof subscription.plan === 'string' ? subscription.plan : subscription.plan.name} Plan
                        </h2>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {typeof subscription.plan !== 'string' && (
                          <>
                            {subscription.plan.mealsPerWeek} meals/week • {subscription.plan.discountPercent}% off
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">₹{subscription.totalWeeklyPrice.toFixed(0)}</p>
                    <p className="text-sm text-green-600">Saving ₹{subscription.savedAmount.toFixed(0)}/week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Delivery */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Delivery</p>
                    <p className="text-lg font-semibold">
                      {new Date(subscription.nextDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Meals Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Your Weekly Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {subscription.meals.filter(m => m.food).slice(0, 8).map((meal, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <img 
                        src={meal.food!.image} 
                        alt={meal.food!.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{meal.food!.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{meal.day}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Actions */}
            <div className="flex gap-3 flex-wrap">
              {subscription.status === 'active' ? (
                <Button variant="outline" onClick={pauseSubscription}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Subscription
                </Button>
              ) : (
                <Button onClick={resumeSubscription}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume Subscription
                </Button>
              )}
              <Button variant="destructive" onClick={cancelSubscription}>
                <X className="h-4 w-4 mr-2" />
                Cancel Subscription
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            New Feature
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meal Subscription
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Set up recurring weekly orders with your favorite healthy meals and save up to 20%
          </p>
        </motion.div>

        {/* Plans Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {subscriptionPlans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden",
                    selectedPlan?.id === plan.id 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.id === 'balanced' && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className={cn(
                      "h-12 w-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                      plan.id === 'starter' && "bg-blue-100 text-blue-600",
                      plan.id === 'balanced' && "bg-primary/20 text-primary",
                      plan.id === 'complete' && "bg-amber-100 text-amber-600"
                    )}>
                      {plan.id === 'starter' && <Leaf className="h-6 w-6" />}
                      {plan.id === 'balanced' && <Zap className="h-6 w-6" />}
                      {plan.id === 'complete' && <Crown className="h-6 w-6" />}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground">/week</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{plan.mealsPerWeek} meals per week</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{plan.discountPercent}% discount</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Free delivery</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Flexible scheduling</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={selectedPlan?.id === plan.id ? "default" : "outline"} 
                      className="w-full"
                    >
                      {selectedPlan?.id === plan.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        'Select Plan'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Meal Planner */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold">Plan Your Meals</h2>
                <p className="text-muted-foreground">
                  Select at least {selectedPlan.mealsPerWeek} meals for your weekly subscription
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg py-2 px-4">
                  {mealCount}/{selectedPlan.mealsPerWeek} meals selected
                </Badge>
              </div>
            </div>

            {/* Day Tabs */}
            <Tabs value={activeDay} onValueChange={(v) => setActiveDay(v as DeliveryDay)}>
              <TabsList className="grid grid-cols-7 mb-6">
                {days.map(day => (
                  <TabsTrigger 
                    key={day.key} 
                    value={day.key}
                    className="relative"
                  >
                    <span className="hidden sm:inline">{day.label}</span>
                    <span className="sm:hidden">{day.short}</span>
                    {draftMeals.filter(m => m.day === day.key && m.food).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center">
                        {draftMeals.filter(m => m.day === day.key && m.food).length}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {days.map(day => (
                <TabsContent key={day.key} value={day.key}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {mealTypes.map(mealType => {
                      const meal = getMealForSlot(day.key, mealType.key);
                      return (
                        <Card key={mealType.key} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{mealType.icon}</span>
                                <div>
                                  <CardTitle className="text-lg">{mealType.label}</CardTitle>
                                  <CardDescription className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {mealType.time}
                                  </CardDescription>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {meal ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative group"
                              >
                                <img 
                                  src={meal.image} 
                                  alt={meal.name}
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h4 className="font-medium text-sm mb-1">{meal.name}</h4>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="text-xs">{meal.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs line-through text-muted-foreground">
                                      ₹{meal.price}
                                    </span>
                                    <span className="text-sm font-semibold text-primary">
                                      ₹{(meal.price * (1 - selectedPlan.discountPercent / 100)).toFixed(0)}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeMealFromSlot(day.key, mealType.key)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </motion.div>
                            ) : (
                              <button
                                onClick={() => openMealSelector(day.key, mealType.key)}
                                className="w-full h-40 border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                              >
                                <Plus className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Add meal</span>
                              </button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Summary & Create */}
            <Card className="mt-8 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Weekly Total</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">₹{discounted.toFixed(0)}</span>
                      {saved > 0 && (
                        <>
                          <span className="text-lg line-through text-muted-foreground">₹{original.toFixed(0)}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Save ₹{saved.toFixed(0)}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    onClick={createSubscription}
                    disabled={mealCount < selectedPlan.mealsPerWeek}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Start Subscription
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {mealCount < selectedPlan.mealsPerWeek && (
                  <p className="text-sm text-amber-600 mt-3">
                    Please select {selectedPlan.mealsPerWeek - mealCount} more meal{selectedPlan.mealsPerWeek - mealCount > 1 ? 's' : ''} to start your subscription
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Meal Selection Dialog */}
        <Dialog open={mealDialogOpen} onOpenChange={setMealDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                Select a Meal for {selectedSlot && (
                  <span className="text-primary capitalize">
                    {selectedSlot.day} {selectedSlot.mealType}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="grid grid-cols-2 gap-4">
                {mockFoods.map((food) => (
                  <Card 
                    key={food.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                    onClick={() => handleSelectMeal(food as Food)}
                  >
                    <img 
                      src={food.image} 
                      alt={food.name}
                      className="w-full h-24 object-cover"
                    />
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-1 line-clamp-1">{food.name}</h4>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{food.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="line-through text-muted-foreground">₹{food.price}</span>
                          <span className="font-semibold text-primary">
                            ₹{selectedPlan ? (food.price * (1 - selectedPlan.discountPercent / 100)).toFixed(0) : food.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {food.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MealSubscription;
