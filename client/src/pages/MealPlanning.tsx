import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Clock, Flame, ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealth } from '@/context/HealthContext';
import { mockFoods } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PlannedMeal {
  id: string;
  dayIndex: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: typeof mockFoods[0];
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

const MealPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isProfileComplete } = useHealth();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff));
  });
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() => {
    const saved = localStorage.getItem('fiteats_meal_plan');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedSlot, setSelectedSlot] = useState<{ dayIndex: number; mealType: typeof MEAL_TYPES[number] } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('fiteats_meal_plan', JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  const getWeekDates = () => {
    return DAYS.map((day, index) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + index);
      return { day, date };
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const addMealToPlan = (food: typeof mockFoods[0]) => {
    if (!selectedSlot) return;
    
    const newMeal: PlannedMeal = {
      id: `${Date.now()}`,
      dayIndex: selectedSlot.dayIndex,
      mealType: selectedSlot.mealType,
      food,
    };
    
    setPlannedMeals(prev => [...prev.filter(m => 
      !(m.dayIndex === selectedSlot.dayIndex && m.mealType === selectedSlot.mealType)
    ), newMeal]);
    
    setIsDialogOpen(false);
    setSelectedSlot(null);
    toast({ title: 'Meal added to plan!' });
  };

  const removeMealFromPlan = (mealId: string) => {
    setPlannedMeals(prev => prev.filter(m => m.id !== mealId));
    toast({ title: 'Meal removed from plan' });
  };

  const getMealForSlot = (dayIndex: number, mealType: typeof MEAL_TYPES[number]) => {
    return plannedMeals.find(m => m.dayIndex === dayIndex && m.mealType === mealType);
  };

  const getDayTotals = (dayIndex: number) => {
    const dayMeals = plannedMeals.filter(m => m.dayIndex === dayIndex);
    return {
      calories: dayMeals.reduce((sum, m) => sum + m.food.nutrition.calories, 0),
      protein: dayMeals.reduce((sum, m) => sum + m.food.nutrition.protein, 0),
    };
  };

  const getWeeklyTotals = () => {
    return {
      calories: plannedMeals.reduce((sum, m) => sum + m.food.nutrition.calories, 0),
      protein: plannedMeals.reduce((sum, m) => sum + m.food.nutrition.protein, 0),
      meals: plannedMeals.length,
    };
  };

  const getRecommendedFoods = () => {
    if (!profile) return mockFoods.slice(0, 8);
    
    return mockFoods
      .filter(food => {
        if (profile.dietType === 'vegan' && !food.isVegan) return false;
        if (profile.medicalConditions.includes('diabetes') && !food.isDiabeticSafe) return false;
        return true;
      })
      .slice(0, 8);
  };

  const weeklyTotals = getWeeklyTotals();
  const weekDates = getWeekDates();

  if (!isProfileComplete) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Set Up Your Health Profile
              </h1>
              <p className="text-muted-foreground mb-8">
                Complete your health profile to get personalized meal plans based on your goals and preferences.
              </p>
              <Button onClick={() => navigate('/preferences')} className="bg-gradient-primary text-white">
                Complete Profile
              </Button>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Meal Planning
              </h1>
              <p className="text-muted-foreground">
                Plan your meals for the week based on your health goals
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek('prev')}
                className="rounded-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-sm font-medium min-w-[180px] text-center">
                {weekDates[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek('next')}
                className="rounded-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Weekly Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <Card className="glass-card border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{weeklyTotals.meals}</div>
                <div className="text-xs text-muted-foreground">Meals Planned</div>
              </CardContent>
            </Card>
            <Card className="glass-card border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">{weeklyTotals.calories.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Weekly Calories</div>
              </CardContent>
            </Card>
            <Card className="glass-card border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{weeklyTotals.protein}g</div>
                <div className="text-xs text-muted-foreground">Weekly Protein</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meal Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto"
          >
            <div className="min-w-[800px]">
              {/* Day Headers */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="p-3"></div>
                {weekDates.map(({ day, date }, index) => {
                  const totals = getDayTotals(index);
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={day}
                      className={`p-3 text-center rounded-xl ${isToday ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/30'}`}
                    >
                      <div className="text-xs text-muted-foreground">{day.slice(0, 3)}</div>
                      <div className="text-lg font-bold text-foreground">{date.getDate()}</div>
                      <div className="text-xs text-primary mt-1">{totals.calories} cal</div>
                    </div>
                  );
                })}
              </div>

              {/* Meal Rows */}
              {MEAL_TYPES.map((mealType) => (
                <div key={mealType} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="p-3 flex items-center">
                    <span className="text-sm font-medium capitalize text-muted-foreground">
                      {mealType}
                    </span>
                  </div>
                  {weekDates.map((_, dayIndex) => {
                    const meal = getMealForSlot(dayIndex, mealType);
                    return (
                      <Dialog key={`${dayIndex}-${mealType}`} open={isDialogOpen && selectedSlot?.dayIndex === dayIndex && selectedSlot?.mealType === mealType} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setSelectedSlot(null);
                      }}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedSlot({ dayIndex, mealType })}
                            className={`p-2 rounded-xl min-h-[80px] cursor-pointer transition-all ${
                              meal 
                                ? 'bg-primary/5 border border-primary/20' 
                                : 'bg-secondary/20 border border-dashed border-border hover:border-primary/30 hover:bg-primary/5'
                            }`}
                          >
                            {meal ? (
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeMealFromPlan(meal.id);
                                  }}
                                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <img
                                  src={meal.food.image}
                                  alt={meal.food.name}
                                  className="w-full h-10 object-cover rounded-lg mb-1"
                                />
                                <div className="text-xs font-medium text-foreground truncate">
                                  {meal.food.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {meal.food.nutrition.calories} cal
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <Plus className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-primary" />
                              Select a Meal
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            {getRecommendedFoods().map((food) => (
                              <motion.div
                                key={food.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => addMealToPlan(food)}
                                className="p-3 rounded-xl bg-secondary/30 hover:bg-primary/10 cursor-pointer border border-transparent hover:border-primary/20 transition-all"
                              >
                                <img
                                  src={food.image}
                                  alt={food.name}
                                  className="w-full h-24 object-cover rounded-lg mb-2"
                                />
                                <h3 className="font-medium text-foreground text-sm">{food.name}</h3>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Flame className="w-3 h-3 text-orange-500" />
                                    {food.nutrition.calories}
                                  </span>
                                  <span>{food.nutrition.protein}g protein</span>
                                </div>
                                {food.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="inline-block mt-2 mr-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {tag}
                                  </span>
                                ))}
                              </motion.div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Health Goals Reminder */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="glass-card border-0 bg-gradient-to-r from-primary/5 to-orange-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Your Health Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Daily Calorie Target:</span>
                      <span className="font-medium text-foreground">{profile.calorieLimit} cal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Diet Type:</span>
                      <span className="font-medium text-foreground capitalize">{profile.dietType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Weight Goal:</span>
                      <span className="font-medium text-foreground capitalize">{profile.weightGoal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MealPlanning;
