import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Clock, Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import PageTransition from '@/components/common/PageTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { mockRestaurants } from '@/data/mockData';
import RestaurantCardSkeleton from '@/components/food/RestaurantCardSkeleton';

const Restaurants: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const allCuisines = Array.from(
    new Set(mockRestaurants.flatMap((r) => r.cuisine))
  ).sort();

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const clearFilters = () => {
    setSelectedCuisines([]);
    setMinRating(0);
    setMaxDeliveryTime(60);
    setSortBy('recommended');
    setSearchQuery('');
  };

  const parseDeliveryTime = (time: string): number => {
    const match = time.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  const filteredRestaurants = mockRestaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.some((c) =>
          c.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCuisine =
        selectedCuisines.length === 0 || 
        restaurant.cuisine.some(c => selectedCuisines.includes(c));
      const matchesRating = restaurant.rating >= minRating;
      const deliveryMins = parseDeliveryTime(restaurant.deliveryTime);
      const matchesDelivery = deliveryMins <= maxDeliveryTime;
      
      return matchesSearch && matchesCuisine && matchesRating && matchesDelivery;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'delivery':
          return parseDeliveryTime(a.deliveryTime) - parseDeliveryTime(b.deliveryTime);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const activeFilterCount = 
    selectedCuisines.length + 
    (minRating > 0 ? 1 : 0) + 
    (maxDeliveryTime < 60 ? 1 : 0);

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-cream via-background to-sage/10 py-12 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-sage/20 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <Badge className="mb-4 bg-sage/20 text-sage-dark border-sage/30 px-4 py-1.5">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  Discover Local Favorites
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-3">
                  Explore <span className="text-primary">Restaurants</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Find health-focused restaurants that match your taste and dietary preferences
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search restaurants or cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 h-14 rounded-2xl bg-white/80 backdrop-blur-sm border-border/50 shadow-soft text-base"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {/* Filters Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-4 flex-wrap">
                {/* Cuisine Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl h-11 px-4 bg-white/80 border-border/50">
                      <Filter className="w-4 h-4 mr-2" />
                      Cuisine
                      {selectedCuisines.length > 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground text-xs px-1.5">
                          {selectedCuisines.length}
                        </Badge>
                      )}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white border-border/50 shadow-lg">
                    <DropdownMenuLabel>Select Cuisines</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allCuisines.map((cuisine) => (
                      <DropdownMenuCheckboxItem
                        key={cuisine}
                        checked={selectedCuisines.includes(cuisine)}
                        onCheckedChange={() => toggleCuisine(cuisine)}
                      >
                        {cuisine}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Rating Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl h-11 px-4 bg-white/80 border-border/50">
                      <Star className="w-4 h-4 mr-2" />
                      Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-4 bg-white border-border/50 shadow-lg">
                    <p className="text-sm font-medium mb-3">Minimum Rating</p>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[minRating]}
                        onValueChange={(value) => setMinRating(value[0])}
                        max={5}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-10 text-right">{minRating}+</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[0, 3, 4, 4.5].map((rating) => (
                        <Button
                          key={rating}
                          variant={minRating === rating ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMinRating(rating)}
                          className="text-xs"
                        >
                          {rating === 0 ? 'Any' : `${rating}+`}
                        </Button>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Delivery Time Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl h-11 px-4 bg-white/80 border-border/50">
                      <Clock className="w-4 h-4 mr-2" />
                      Delivery: {maxDeliveryTime < 60 ? `Under ${maxDeliveryTime} min` : 'Any'}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-4 bg-white border-border/50 shadow-lg">
                    <p className="text-sm font-medium mb-3">Max Delivery Time</p>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[maxDeliveryTime]}
                        onValueChange={(value) => setMaxDeliveryTime(value[0])}
                        min={15}
                        max={60}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-16 text-right">{maxDeliveryTime} min</span>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {[20, 30, 45, 60].map((time) => (
                        <Button
                          key={time}
                          variant={maxDeliveryTime === time ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMaxDeliveryTime(time)}
                          className="text-xs"
                        >
                          {time === 60 ? 'Any' : `${time} min`}
                        </Button>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 rounded-xl h-11 bg-white/80 border-border/50">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border/50 shadow-lg">
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="delivery">Fastest Delivery</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              {/* Mobile Filters Toggle */}
              <div className="lg:hidden flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 rounded-xl h-11 bg-white/80 border-border/50"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground text-xs px-1.5">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1 rounded-xl h-11 bg-white/80 border-border/50">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border/50 shadow-lg">
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="delivery">Fastest Delivery</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden mt-4 p-4 bg-white/80 rounded-2xl border border-border/50 space-y-6 overflow-hidden"
                  >
                    {/* Cuisine */}
                    <div>
                      <p className="text-sm font-medium mb-3">Cuisine Type</p>
                      <div className="flex flex-wrap gap-2">
                        {allCuisines.map((cuisine) => (
                          <Button
                            key={cuisine}
                            variant={selectedCuisines.includes(cuisine) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleCuisine(cuisine)}
                            className="rounded-full text-xs"
                          >
                            {cuisine}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <p className="text-sm font-medium mb-3">Minimum Rating: {minRating}+</p>
                      <Slider
                        value={[minRating]}
                        onValueChange={(value) => setMinRating(value[0])}
                        max={5}
                        step={0.5}
                      />
                    </div>

                    {/* Delivery Time */}
                    <div>
                      <p className="text-sm font-medium mb-3">Max Delivery: {maxDeliveryTime} min</p>
                      <Slider
                        value={[maxDeliveryTime]}
                        onValueChange={(value) => setMaxDeliveryTime(value[0])}
                        min={15}
                        max={60}
                        step={5}
                      />
                    </div>

                    {activeFilterCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Filter Tags */}
              {(selectedCuisines.length > 0 || minRating > 0 || maxDeliveryTime < 60) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedCuisines.map((cuisine) => (
                    <Badge
                      key={cuisine}
                      variant="secondary"
                      className="bg-sage/20 text-sage-dark border-sage/30 px-3 py-1 cursor-pointer hover:bg-sage/30"
                      onClick={() => toggleCuisine(cuisine)}
                    >
                      {cuisine}
                      <X className="w-3 h-3 ml-1.5" />
                    </Badge>
                  ))}
                  {minRating > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-gold/20 text-gold-dark border-gold/30 px-3 py-1 cursor-pointer hover:bg-gold/30"
                      onClick={() => setMinRating(0)}
                    >
                      {minRating}+ Stars
                      <X className="w-3 h-3 ml-1.5" />
                    </Badge>
                  )}
                  {maxDeliveryTime < 60 && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/30 px-3 py-1 cursor-pointer hover:bg-primary/30"
                      onClick={() => setMaxDeliveryTime(60)}
                    >
                      Under {maxDeliveryTime} min
                      <X className="w-3 h-3 ml-1.5" />
                    </Badge>
                  )}
                </div>
              )}
            </motion.div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {isLoading ? (
                  <span className="animate-pulse">Loading restaurants...</span>
                ) : (
                  <>
                    Showing <span className="font-semibold text-foreground">{filteredRestaurants.length}</span> restaurants
                  </>
                )}
              </p>
            </div>

            {/* Restaurant Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <RestaurantCardSkeleton count={6} />
              ) : (
                filteredRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    className="group cursor-pointer rounded-2xl bg-white/80 backdrop-blur-sm border border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-glow-primary transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm flex items-center gap-1.5 shadow-soft">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="text-sm font-bold text-foreground">
                          {restaurant.rating}
                        </span>
                      </div>
                      {/* Delivery Time Badge */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-xl bg-primary/90 backdrop-blur-sm flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-medium text-white">
                          {restaurant.deliveryTime}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {restaurant.name}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {restaurant.cuisine.slice(0, 3).map((cuisine) => (
                          <Badge 
                            key={cuisine} 
                            variant="secondary" 
                            className="text-xs bg-sage/10 text-sage-dark border-sage/20"
                          >
                            {cuisine}
                          </Badge>
                        ))}
                        {restaurant.cuisine.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-muted">
                            +{restaurant.cuisine.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{restaurant.distance}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary hover:bg-primary/10 -mr-2"
                        >
                          View Menu
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {!isLoading && filteredRestaurants.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  No restaurants found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button onClick={clearFilters} className="btn-warm">
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Restaurants;
