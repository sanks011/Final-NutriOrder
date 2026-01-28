import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Leaf, Droplets, Heart } from 'lucide-react';
import ProgressRing from './ProgressRing';
import { useHealth } from '@/context/HealthContext';

const NutritionSummary: React.FC = () => {
  const { profile, dailyStats, getCalorieProgress, getRemainingCalories } = useHealth();

  const nutrients = [
    {
      icon: Flame,
      label: 'Calories',
      current: dailyStats.caloriesConsumed,
      limit: profile?.calorieLimit || 2000,
      unit: 'kcal',
      color: 'primary' as const,
    },
    {
      icon: Leaf,
      label: 'Protein',
      current: dailyStats.proteinConsumed,
      limit: 65,
      unit: 'g',
      color: 'success' as const,
    },
    {
      icon: Droplets,
      label: 'Carbs',
      current: dailyStats.carbsConsumed,
      limit: 300,
      unit: 'g',
      color: 'warning' as const,
    },
    {
      icon: Heart,
      label: 'Fat',
      current: dailyStats.fatConsumed,
      limit: 65,
      unit: 'g',
      color: 'destructive' as const,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 lg:p-8"
    >
      <h3 className="text-lg font-display font-semibold text-foreground mb-6">
        Today's Nutrition
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Main Calorie Ring */}
        <div className="flex-shrink-0">
          <ProgressRing
            progress={getCalorieProgress()}
            size={140}
            strokeWidth={10}
            color={getCalorieProgress() > 90 ? 'destructive' : 'primary'}
            value={getRemainingCalories()}
            label="kcal left"
          />
        </div>

        {/* Nutrient Bars */}
        <div className="flex-1 w-full space-y-4">
          {nutrients.map((nutrient) => {
            const progress = Math.min((nutrient.current / nutrient.limit) * 100, 100);
            const Icon = nutrient.icon;

            return (
              <div key={nutrient.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{nutrient.label}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {nutrient.current} / {nutrient.limit} {nutrient.unit}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      nutrient.color === 'primary'
                        ? 'bg-primary'
                        : nutrient.color === 'success'
                        ? 'bg-success'
                        : nutrient.color === 'warning'
                        ? 'bg-warning'
                        : 'bg-destructive'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default NutritionSummary;
