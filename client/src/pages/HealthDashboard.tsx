import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Flame, Droplets, Beef, Cookie, Target, 
  TrendingUp, Calendar, Apple, Award, ChevronRight,
  Settings
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHealth } from '@/context/HealthContext';
import { useNavigate } from 'react-router-dom';
import ProgressRing from '@/components/health/ProgressRing';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock meal history data
const generateMealHistory = () => {
  const meals = [];
  const foods = [
    { name: 'Grilled Chicken Bowl', calories: 420, protein: 35, carbs: 38, fat: 14 },
    { name: 'Salmon Poke', calories: 520, protein: 32, carbs: 42, fat: 26 },
    { name: 'Vegan Buddha Bowl', calories: 450, protein: 18, carbs: 58, fat: 16 },
    { name: 'Keto Steak Salad', calories: 580, protein: 42, carbs: 8, fat: 44 },
    { name: 'Thai Basil Chicken', calories: 520, protein: 28, carbs: 52, fat: 18 },
  ];
  
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const mealsPerDay = Math.floor(Math.random() * 2) + 2;
    
    for (let j = 0; j < mealsPerDay; j++) {
      const food = foods[Math.floor(Math.random() * foods.length)];
      meals.push({
        id: `${i}-${j}`,
        date: date.toISOString(),
        ...food,
        mealType: j === 0 ? 'Breakfast' : j === 1 ? 'Lunch' : 'Dinner',
      });
    }
  }
  return meals;
};

const HealthDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, dailyStats, isProfileComplete, getCalorieProgress, getRemainingCalories } = useHealth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const mealHistory = useMemo(() => generateMealHistory(), []);

  // Calculate weekly data for charts
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, index) => {
      const dayMeals = mealHistory.filter(m => new Date(m.date).getDay() === index);
      return {
        day,
        calories: dayMeals.reduce((sum, m) => sum + m.calories, 0) || Math.floor(Math.random() * 500) + 1500,
        protein: dayMeals.reduce((sum, m) => sum + m.protein, 0) || Math.floor(Math.random() * 30) + 60,
        target: profile?.calorieLimit || 2000,
      };
    });
  }, [mealHistory, profile]);

  const macroData = useMemo(() => {
    const totalProtein = dailyStats.proteinConsumed || 85;
    const totalCarbs = dailyStats.carbsConsumed || 120;
    const totalFat = dailyStats.fatConsumed || 45;
    const total = totalProtein + totalCarbs + totalFat;
    
    return [
      { name: 'Protein', value: totalProtein, color: 'hsl(var(--primary))' },
      { name: 'Carbs', value: totalCarbs, color: 'hsl(var(--chart-2))' },
      { name: 'Fat', value: totalFat, color: 'hsl(var(--chart-3))' },
    ];
  }, [dailyStats]);

  const chartConfig = {
    calories: { label: 'Calories', color: 'hsl(var(--primary))' },
    target: { label: 'Target', color: 'hsl(var(--muted))' },
    protein: { label: 'Protein', color: 'hsl(var(--chart-2))' },
  };

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
                <Activity className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Set Up Your Health Profile
              </h1>
              <p className="text-muted-foreground mb-8">
                Complete your health profile to track your nutrition and see personalized insights.
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
                Health Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track your daily nutrition and progress towards your goals
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigate('/preferences')}
              className="rounded-xl"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </motion.div>

          {/* Today's Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{dailyStats.caloriesConsumed || 1450}</div>
                    <div className="text-xs text-muted-foreground">Calories Today</div>
                  </div>
                </div>
                <Progress value={getCalorieProgress()} className="mt-3 h-1.5" />
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <Beef className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{dailyStats.proteinConsumed || 85}g</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{dailyStats.carbsConsumed || 120}g</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{dailyStats.sugarConsumed || 25}g</div>
                    <div className="text-xs text-muted-foreground">Sugar</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass-card border-0 p-1">
              <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
              <TabsTrigger value="progress" className="rounded-lg">Progress</TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg">Meal History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calorie Progress Ring */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Daily Calorie Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ProgressRing
                      progress={getCalorieProgress()}
                      size={180}
                      strokeWidth={12}
                      color="primary"
                    >
                      <div className="text-center">
                        <div className="text-3xl font-bold text-foreground">{getRemainingCalories()}</div>
                        <div className="text-xs text-muted-foreground">remaining</div>
                      </div>
                    </ProgressRing>
                  </CardContent>
                </Card>

                {/* Macro Distribution */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Apple className="w-5 h-5 text-green-500" />
                      Macro Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={macroData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {macroData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                      {macroData.map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">{item.value}g</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Health Goals */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Your Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                      <div>
                        <div className="text-sm font-medium text-foreground">Daily Calories</div>
                        <div className="text-xs text-muted-foreground">Target limit</div>
                      </div>
                      <div className="text-lg font-bold text-primary">{profile?.calorieLimit}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                      <div>
                        <div className="text-sm font-medium text-foreground">Diet Type</div>
                        <div className="text-xs text-muted-foreground">Preference</div>
                      </div>
                      <div className="text-lg font-bold text-foreground capitalize">{profile?.dietType}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                      <div>
                        <div className="text-sm font-medium text-foreground">Weight Goal</div>
                        <div className="text-xs text-muted-foreground">Target</div>
                      </div>
                      <div className="text-lg font-bold text-foreground capitalize">{profile?.weightGoal}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {/* Weekly Calorie Chart */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Weekly Calorie Intake
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Protein Trend */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Beef className="w-5 h-5 text-red-500" />
                    Protein Intake Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <LineChart data={weeklyData}>
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="protein" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Recent Meals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mealHistory.slice(0, 10).map((meal) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Apple className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{meal.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {meal.mealType} • {new Date(meal.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-foreground">{meal.calories} cal</div>
                          <div className="text-xs text-muted-foreground">
                            P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card 
              className="glass-card border-0 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate('/meal-planning')}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Plan Your Meals</div>
                    <div className="text-sm text-muted-foreground">Schedule your week</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card 
              className="glass-card border-0 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate('/foods')}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Apple className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Browse Menu</div>
                    <div className="text-sm text-muted-foreground">Find healthy meals</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthDashboard;
