import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  AlertCircle,
  User,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FoodCard from '@/components/food/FoodCard';
import { useHealth } from '@/context/HealthContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockFoods } from '@/data/mockData';

const RecommendationsSection: React.FC = () => {
  const { profile, isProfileComplete, checkFoodSafety } = useHealth();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * ✅ NORMALIZE PROFILE (CRITICAL)
   * Prevents undefined access during first render
   */
  const safeProfile = useMemo(() => {
    if (!profile) return null;

    return {
      dietType: profile.dietType ?? 'balanced',
      calorieLimit: profile.calorieLimit ?? 2000,
      sugarLimit: profile.sugarLimit ?? 50,
      medicalConditions: Array.isArray(profile.medicalConditions)
        ? profile.medicalConditions
        : [],
    };
  }, [profile]);

  // AI-powered recommendations
  const recommendations = useMemo(() => {
    // Fallback for guests or incomplete profiles
    if (!isProfileComplete || !safeProfile) {
      return mockFoods.slice(0, 4);
    }

    const scoredFoods = mockFoods.map(food => {
      let score = 50;
      const safety = checkFoodSafety(food);

      if (!safety.isSafe) score -= 40;

      // Diet match
      if (safeProfile.dietType === 'vegan' && food.isVegan) score += 20;
      if (
        safeProfile.dietType === 'veg' &&
        (food.isVegan ||
          !food.ingredients?.some(i =>
            ['chicken', 'beef', 'pork', 'fish', 'salmon', 'meat'].includes(
              i.toLowerCase()
            )
          ))
      ) {
        score += 15;
      }

      if (food.isKeto) score += 5;

      // Medical conditions
      if (safeProfile.medicalConditions.includes('diabetes') && food.isDiabeticSafe) {
        score += 15;
      }

      if (
        safeProfile.medicalConditions.includes('blood-pressure') &&
        food.nutrition?.sodium < 400
      ) {
        score += 10;
      }

      if (
        safeProfile.medicalConditions.includes('heart') &&
        food.isHeartHealthy
      ) {
        score += 10;
      }

      // Calories
      const calorieRatio = food.nutrition.calories / safeProfile.calorieLimit;
      if (calorieRatio < 0.25) score += 10;
      if (calorieRatio > 0.4) score -= 5;

      // Protein
      if (food.nutrition.protein > 25) score += 8;

      // Sugar
      if (food.nutrition.sugar < safeProfile.sugarLimit * 0.2) score += 5;

      // Rating
      score += food.rating * 2;

      return { food, score, safety };
    });

    return scoredFoods
      .filter(item => item.safety.isSafe || item.safety.warnings.length < 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.food);
  }, [safeProfile, isProfileComplete, checkFoodSafety]);

  const profileStats = useMemo(() => {
    if (!safeProfile) return null;
    return {
      dailyCalories: safeProfile.calorieLimit,
      dietType: safeProfile.dietType,
      conditions: safeProfile.medicalConditions.length,
    };
  }, [safeProfile]);

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI-Powered</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-display font-bold mb-4">
            {isProfileComplete ? 'Personalized For You' : 'Recommended For You'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isProfileComplete
              ? `Based on your ${profileStats?.dietType} preferences and health goals`
              : 'Complete your health profile to get personalized meal recommendations'}
          </p>
        </motion.div>

        {/* Incomplete profile CTA */}
        {isAuthenticated && !isProfileComplete && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 flex items-center gap-6">
              <User className="w-10 h-10 text-primary" />
              <div>
                <h3 className="font-bold mb-1">Complete Your Health Profile</h3>
                <Button onClick={() => navigate('/preferences')} size="sm">
                  Set Up Profile
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((food, index) => (
            <motion.div key={food.id} transition={{ delay: index * 0.1 }}>
              {isProfileComplete && index === 0 && (
                <Badge className="mb-2">Best Match</Badge>
              )}
              <FoodCard food={food} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button onClick={() => navigate('/foods')} variant="outline">
            View All Dishes
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
