import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, Flame, AlertTriangle, Leaf, Check, Heart, Sparkles, Clock } from 'lucide-react';
import { Food } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useHealth } from '@/context/HealthContext';
import { useWishlist } from '@/context/WishlistContext';

interface FoodCardProps {
  food: Food;
  showNutrition?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const FoodCard: React.FC<FoodCardProps> = ({ food, showNutrition = true, variant = 'default' }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { checkFoodSafety } = useHealth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const foodId = food._id || food.id;
  const safety = checkFoodSafety(food);
  const isWishlisted = isInWishlist(foodId);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(food);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(food);
  };

  // Compact variant for sidebars/lists
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        onClick={() => navigate(`/foods/${foodId}`)}
        className="warm-card cursor-pointer p-3 flex gap-3 group"
      >
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-sage-light">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{food.restaurant.name}</p>
          <h3 className="font-semibold text-foreground truncate mt-0.5">{food.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-primary font-bold">₹{food.price}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="w-3 h-3 text-primary" />
              {food.nutrition.calories} kcal
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Featured variant with sage background
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        onClick={() => navigate(`/foods/${foodId}`)}
        className={`food-card-sage cursor-pointer group overflow-hidden ${
          !safety.isSafe ? 'ring-2 ring-destructive/30' : ''
        }`}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Safety Warning Overlay */}
          {!safety.isSafe && (
            <div className="absolute inset-0 bg-destructive/20 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-destructive/90 px-4 py-2 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Health Warning</span>
              </div>
            </div>
          )}

          {/* Top Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {food.isDiabeticSafe && (
              <span className="nutrition-badge-safe">
                <Check className="w-3 h-3" />
                Diabetic Safe
              </span>
            )}
            {food.isVegan && (
              <span className="nutrition-badge-safe">
                <Leaf className="w-3 h-3" />
                Vegan
              </span>
            )}
          </div>

          {/* Featured Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3">
            <span className="price-tag text-lg">₹{food.price}</span>
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className={`w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg ${
                isWishlisted ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {food.restaurant.name}
          </p>
          <h3 className="font-display font-semibold text-foreground text-lg mt-1 line-clamp-1">
            {food.name}
          </h3>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-sm font-semibold">{food.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">20-30 min</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant - Warm earthy style
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/foods/${foodId}`)}
      className={`food-card cursor-pointer group ${
        !safety.isSafe ? 'ring-2 ring-destructive/30' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-sage-light">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Safety Warning Overlay */}
        {!safety.isSafe && (
          <div className="absolute inset-0 bg-destructive/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-destructive/90 px-4 py-2 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Health Warning</span>
            </div>
          </div>
        )}

        {/* Top Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {food.isDiabeticSafe && (
            <span className="nutrition-badge-safe">
              <Check className="w-3 h-3" />
              Diabetic Safe
            </span>
          )}
          {food.isVegan && (
            <span className="nutrition-badge-safe">
              <Leaf className="w-3 h-3" />
              Vegan
            </span>
          )}
          {food.isKeto && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sage text-sage-dark backdrop-blur-sm border border-sage-dark/20">
              Keto
            </span>
          )}
        </div>

        {/* AI Recommended Badge */}
        {food.rating >= 4.7 && (
          <div className="absolute top-3 right-3">
            <span className="ai-badge">
              <Sparkles className="w-3 h-3" />
              AI Pick
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-md ${
              isWishlisted ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md glow-primary"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Restaurant */}
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {food.restaurant.name}
        </p>

        {/* Title & Price */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold text-foreground line-clamp-2 text-lg leading-snug">
            {food.name}
          </h3>
          <span className="text-xl font-bold text-primary flex-shrink-0">
            ₹{food.price}
          </span>
        </div>

        {/* Rating & Delivery */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sage-light">
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="text-sm font-semibold text-foreground">{food.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({food.reviewCount} reviews)
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Clock className="w-3.5 h-3.5" />
            20-30 min
          </div>
        </div>

        {/* Nutrition */}
        {showNutrition && (
          <div className="flex items-center gap-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                {food.nutrition.calories}
              </span>
              <span className="text-xs text-muted-foreground">kcal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-sage-dark font-medium">
                {food.nutrition.protein}g
              </span>
              <span className="text-xs text-muted-foreground">protein</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gold font-medium">
                {food.nutrition.carbs}g
              </span>
              <span className="text-xs text-muted-foreground">carbs</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FoodCard;
