import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Minus,
  Star,
  Flame,
  Clock,
  Users,
  AlertTriangle,
  Check,
  Leaf,
  Heart,
  ChefHat,
  ShoppingCart,
  Info,
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { foodAPI, Food } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useHealth } from '@/context/HealthContext';
import { toast } from 'sonner';
import ReviewSection from '@/components/reviews/ReviewSection';

const FoodDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { profile, checkFoodSafety } = useHealth();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await foodAPI.getById(id);
        setFood(response.data);
      } catch (error) {
        console.error('Failed to fetch food:', error);
        setFood(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading food details...</p>
        </div>
      </Layout>
    );
  }

  if (!food) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Food not found
          </h1>
          <Button onClick={() => navigate('/foods')}>Back to Menu</Button>
        </div>
      </Layout>
    );
  }

  const safety = checkFoodSafety(food);

  const handleAddToCart = () => {
    addItem(food, quantity);
    toast.success(`Added ${quantity}x ${food.name} to cart`);
  };

  const getRecommendationReasons = () => {
    const reasons: string[] = [];

    if (food.isDiabeticSafe && profile?.medicalConditions?.includes('diabetes')) {
      reasons.push('Low glycemic index, safe for diabetes management');
    }
    if (food.nutrition.protein >= 25) {
      reasons.push('High in protein for muscle building and satiety');
    }
    if (food.nutrition.fiber >= 5) {
      reasons.push('Good source of fiber for digestive health');
    }
    if (food.nutrition.calories <= 400) {
      reasons.push('Low calorie option for weight management');
    }
    if (food.isVegan && profile?.dietType === 'vegan') {
      reasons.push('Completely plant-based, aligns with your vegan diet');
    }
    if (food.nutrition.sodium <= 400) {
      reasons.push('Low sodium, heart-healthy choice');
    }

    return reasons.length > 0
      ? reasons
      : ['Balanced nutrition for a healthy lifestyle'];
  };

  const NutritionRow = ({
    label,
    value,
    unit,
    isWarning = false,
  }: {
    label: string;
    value: number;
    unit: string;
    isWarning?: boolean;
  }) => (
    <div
      className={`flex justify-between py-3 border-b border-border last:border-0 ${
        isWarning ? 'text-destructive' : ''
      }`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${isWarning ? 'text-destructive' : 'text-foreground'}`}>
        {value}
        {unit}
        {isWarning && <AlertTriangle className="inline w-4 h-4 ml-1" />}
      </span>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen pb-24">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-24 left-6 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Safety Warning Badge */}
          {!safety.isSafe && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-24 right-6 bg-destructive text-destructive-foreground px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Health Warning</span>
            </motion.div>
          )}
        </div>

        {/* Health Alerts Banner - Prominent Warning Section */}
        {!safety.isSafe && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-destructive/15 to-warning/15 border-y border-destructive/30"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-destructive text-lg mb-2">
                    ⚠️ This item conflicts with your health profile
                  </h3>
                  <ul className="space-y-1.5">
                    {safety.warnings.map((warning, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-destructive/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Based on your health profile settings. <Link to="/preferences" className="text-primary underline">Update preferences</Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {food.isDiabeticSafe && (
                    <Badge className="bg-success/20 text-success border-success/30">
                      <Check className="w-3 h-3 mr-1" /> Diabetic Safe
                    </Badge>
                  )}
                  {food.isVegan && (
                    <Badge className="bg-success/20 text-success border-success/30">
                      <Leaf className="w-3 h-3 mr-1" /> Vegan
                    </Badge>
                  )}
                  {food.isGlutenFree && (
                    <Badge variant="secondary">Gluten Free</Badge>
                  )}
                  {food.isKeto && (
                    <Badge className="bg-purple/20 text-purple border-purple/30">
                      Keto
                    </Badge>
                  )}
                  {food.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title & Restaurant */}
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  {food.name}
                </h1>
                <p className="text-muted-foreground mb-4">
                  by {food.restaurant.name}
                </p>

                {/* Rating & Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/10">
                      <Star className="w-4 h-4 text-success fill-success" />
                      <span className="font-semibold text-success">
                        {food.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({food.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Flame className="w-4 h-4 text-coral" />
                    <span>{food.nutrition.calories} kcal</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground/80 mt-4 leading-relaxed">
                  {food.description}
                </p>
              </motion.div>

              {/* Safety Warnings */}
              {!safety.isSafe && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20"
                >
                  <h3 className="font-semibold text-destructive flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    Health Warnings
                  </h3>
                  <ul className="space-y-2">
                    {safety.warnings.map((warning, index) => (
                      <li key={index} className="text-destructive/80 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Tabs Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Tabs defaultValue="nutrition" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-12 rounded-xl bg-muted">
                    <TabsTrigger value="nutrition" className="rounded-lg">
                      Nutrition
                    </TabsTrigger>
                    <TabsTrigger value="ingredients" className="rounded-lg">
                      Ingredients
                    </TabsTrigger>
                    <TabsTrigger value="recipe" className="rounded-lg">
                      <ChefHat className="w-4 h-4 mr-1" />
                      Recipe
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="nutrition" className="mt-6">
                    <div className="p-6 rounded-2xl bg-card border border-border">
                      <h3 className="font-display font-semibold text-lg mb-4">
                        Nutrition Facts
                      </h3>
                      <NutritionRow
                        label="Calories"
                        value={food.nutrition.calories}
                        unit=" kcal"
                        isWarning={
                          profile?.calorieLimit
                            ? food.nutrition.calories > profile.calorieLimit * 0.4
                            : false
                        }
                      />
                      <NutritionRow
                        label="Protein"
                        value={food.nutrition.protein}
                        unit="g"
                      />
                      <NutritionRow
                        label="Carbohydrates"
                        value={food.nutrition.carbs}
                        unit="g"
                      />
                      <NutritionRow
                        label="Fat"
                        value={food.nutrition.fat}
                        unit="g"
                      />
                      <NutritionRow
                        label="Fiber"
                        value={food.nutrition.fiber}
                        unit="g"
                      />
                      <NutritionRow
                        label="Sugar"
                        value={food.nutrition.sugar}
                        unit="g"
                        isWarning={
                          profile?.sugarLimit
                            ? food.nutrition.sugar > profile.sugarLimit * 0.3
                            : false
                        }
                      />
                      <NutritionRow
                        label="Sodium"
                        value={food.nutrition.sodium}
                        unit="mg"
                        isWarning={
                          profile?.sodiumLimit
                            ? food.nutrition.sodium > profile.sodiumLimit * 0.3
                            : false
                        }
                      />
                      <NutritionRow
                        label="Cholesterol"
                        value={food.nutrition.cholesterol}
                        unit="mg"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="ingredients" className="mt-6">
                    <div className="p-6 rounded-2xl bg-card border border-border">
                      <h3 className="font-display font-semibold text-lg mb-4">
                        Ingredients
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {food.ingredients.map((ingredient) => {
                          const isAllergen = profile?.allergies?.some(
                            (allergy) =>
                              ingredient.toLowerCase().includes(allergy.toLowerCase())
                          );
                          return (
                            <Badge
                              key={ingredient}
                              variant={isAllergen ? 'destructive' : 'secondary'}
                              className={`text-sm py-2 px-3 ${
                                isAllergen ? 'animate-pulse' : ''
                              }`}
                            >
                              {isAllergen && (
                                <AlertTriangle className="w-3 h-3 mr-1" />
                              )}
                              {ingredient}
                            </Badge>
                          );
                        })}
                      </div>
                      {profile?.allergies?.some((allergy) =>
                        food.ingredients.some((ing) =>
                          ing.toLowerCase().includes(allergy.toLowerCase())
                        )
                      ) && (
                        <div className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                          <AlertTriangle className="inline w-4 h-4 mr-1" />
                          Contains ingredients you're allergic to. Please order with
                          caution.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="recipe" className="mt-6">
                    <div className="p-6 rounded-2xl bg-card border border-border">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-semibold text-lg">
                          How to Make It
                        </h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {(food as any).recipe?.prepTime || '15 mins'} prep
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            {(food as any).recipe?.cookTime || '20 mins'} cook
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {(food as any).recipe?.servings || 2} servings
                          </span>
                        </div>
                      </div>

                      <ol className="space-y-4">
                        {((food as any).recipe?.instructions || [
                          'Recipe instructions coming soon...',
                        ]).map((step: string, index: number) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4"
                          >
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                              {index + 1}
                            </span>
                            <p className="text-foreground/80 leading-relaxed pt-1">
                              {step}
                            </p>
                          </motion.li>
                        ))}
                      </ol>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Add to Cart Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-primary">
                      ₹{food.price}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-muted-foreground">Quantity</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between py-4 border-t border-b border-border mb-6">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold text-foreground">
                      ₹{food.price * quantity}
                    </span>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full h-14 text-lg font-semibold"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>

                  {/* Nutrition Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-coral">
                          {food.nutrition.calories * quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {food.nutrition.protein * quantity}g
                        </p>
                        <p className="text-xs text-muted-foreground">Protein</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple">
                          {food.nutrition.carbs * quantity}g
                        </p>
                        <p className="text-xs text-muted-foreground">Carbs</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Why Recommended */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
                >
                  <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-primary" />
                    Why This is Good for You
                  </h3>
                  <ul className="space-y-3">
                    {getRecommendationReasons().map((reason, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="container mx-auto px-4 py-8 md:py-12">
            <ReviewSection foodId={food.id} foodName={food.name} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FoodDetails;
