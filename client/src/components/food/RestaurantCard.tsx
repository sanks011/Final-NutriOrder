import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string[];
  distance?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  size?: 'small' | 'normal' | 'large';
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, size = 'normal' }) => {
  const navigate = useNavigate();

  if (size === 'small') {
    return (
      <motion.div
        whileHover={{ scale: 1.08, y: -4 }}
        className="flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => navigate(`/restaurants`)}
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-border/50 group-hover:ring-primary/50 transition-all shadow-soft group-hover:shadow-glass">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs text-muted-foreground text-center line-clamp-1 font-medium">
          {restaurant.name}
        </span>
      </motion.div>
    );
  }

  if (size === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        onClick={() => navigate(`/restaurants`)}
        className="food-card cursor-pointer group overflow-hidden"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden rounded-t-3xl">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-sm shadow-soft">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-bold text-foreground">{restaurant.rating}</span>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display font-bold text-xl text-white mb-1">
              {restaurant.name}
            </h3>
            <p className="text-white/80 text-sm">
              {restaurant.cuisine.join(' • ')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {restaurant.deliveryTime}
            </div>
            {restaurant.distance && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {restaurant.distance}
              </div>
            )}
          </div>
          <motion.div
            whileHover={{ x: 4 }}
            className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/restaurants`)}
      className="food-card cursor-pointer group overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden rounded-t-3xl">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-success/90 backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 text-white fill-white" />
          <span className="text-xs font-bold text-white">{restaurant.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-foreground">{restaurant.name}</h3>
        
        <p className="text-sm text-muted-foreground line-clamp-1">
          {restaurant.cuisine.join(' • ')}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {restaurant.deliveryTime}
          </div>
          {restaurant.distance && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {restaurant.distance}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
