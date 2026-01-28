import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Filter,
  Search,
  Flame,
  Leaf,
  Check,
  Heart,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { mockFoods, mockRestaurants } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { useHealth } from '@/context/HealthContext';
import { toast } from 'sonner';

type SortOption = 'default' | 'calories-low' | 'calories-high' | 'protein-high' | 'price-low' | 'price-high' | 'rating';

const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { checkFoodSafety, isProfileComplete } = useHealth();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filters, setFilters] = useState({
    diabeticSafe: false,
    vegan: false,
    glutenFree: false,
    keto: false,
    lowCalorie: false,
    highProtein: false,
  });

  const restaurant = mockRestaurants.find((r) => r.id === id);
  const restaurantFoods = mockFoods.filter((f) => f.restaurant.id === id);

  if (!restaurant) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Restaurant not found</h1>
          <Button onClick={() => navigate('/restaurants')}>Back to Restaurants</Button>
        </div>
      </Layout>
    );
  }

  // Group foods by category
  const categories = useMemo(() => {
    const categoryMap = new Map<string, typeof restaurantFoods>();
    restaurantFoods.forEach((food) => {
      const existing = categoryMap.get(food.category) || [];
      categoryMap.set(food.category, [...existing, food]);
    });
    return Array.from(categoryMap.entries());
  }, [restaurantFoods]);

  // Filter and sort foods
  const filteredFoods = useMemo(() => {
    let foods = [...restaurantFoods];

    // Search filter
    if (searchQuery) {
      foods = foods.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Health filters
    if (filters.diabeticSafe) foods = foods.filter((f) => f.isDiabeticSafe);
    if (filters.vegan) foods = foods.filter((f) => f.isVegan);
    if (filters.glutenFree) foods = foods.filter((f) => f.isGlutenFree);
    if (filters.keto) foods = foods.filter((f) => f.isKeto);
    if (filters.lowCalorie) foods = foods.filter((f) => f.nutrition.calories <= 400);
    if (filters.highProtein) foods = foods.filter((f) => f.nutrition.protein >= 25);

    // Sorting
    switch (sortBy) {
      case 'calories-low':
        foods.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
        break;
      case 'calories-high':
        foods.sort((a, b) => b.nutrition.calories - a.nutrition.calories);
        break;
      case 'protein-high':
        foods.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
        break;
      case 'price-low':
        foods.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        foods.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        foods.sort((a, b) => b.rating - a.rating);
        break;
    }

    return foods;
  }, [restaurantFoods, searchQuery, filters, sortBy]);

  const handleAddToCart = (food: typeof mockFoods[0]) => {
    addItem(food, 1);
    toast.success(`Added ${food.name} to cart`);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'calories-low', label: 'Calories: Low to High' },
    { value: 'calories-high', label: 'Calories: High to Low' },
    { value: 'protein-high', label: 'Protein: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Restaurant Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-card border border-border mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="font-semibold text-foreground">{restaurant.rating}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {restaurant.deliveryTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {restaurant.distance}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                {restaurant.cuisine.map((c) => (
                  <Badge key={c} variant="secondary" className="rounded-full">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" className="rounded-full">
              <Heart className="w-4 h-4 mr-2" />
              Favorite
            </Button>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl h-12 px-5">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={filters.diabeticSafe}
                onCheckedChange={(c) => setFilters({ ...filters, diabeticSafe: c })}
              >
                🩸 Diabetic Safe
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.vegan}
                onCheckedChange={(c) => setFilters({ ...filters, vegan: c })}
              >
                🌱 Vegan
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.glutenFree}
                onCheckedChange={(c) => setFilters({ ...filters, glutenFree: c })}
              >
                🌾 Gluten Free
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.keto}
                onCheckedChange={(c) => setFilters({ ...filters, keto: c })}
              >
                🥑 Keto Friendly
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.lowCalorie}
                onCheckedChange={(c) => setFilters({ ...filters, lowCalorie: c })}
              >
                🔥 Low Calorie (&lt;400)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.highProtein}
                onCheckedChange={(c) => setFilters({ ...filters, highProtein: c })}
              >
                💪 High Protein (25g+)
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl h-12 px-5">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? 'bg-primary/10 text-primary' : ''}
                >
                  {option.label}
                  {sortBy === option.value && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-8 pb-12">
          {filteredFoods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items match your filters</p>
              <Button
                variant="link"
                onClick={() => {
                  setFilters({
                    diabeticSafe: false,
                    vegan: false,
                    glutenFree: false,
                    keto: false,
                    lowCalorie: false,
                    highProtein: false,
                  });
                  setSearchQuery('');
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredFoods.map((food, index) => {
                const safety = isProfileComplete ? checkFoodSafety(food) : { isSafe: true, warnings: [] };
                
                return (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-2xl bg-card border transition-all hover:shadow-lg cursor-pointer ${
                      !safety.isSafe ? 'border-destructive/30' : 'border-border hover:border-primary/30'
                    }`}
                    onClick={() => navigate(`/foods/${food.id}`)}
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover"
                        />
                        {!safety.isSafe && (
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-destructive text-white text-xs font-medium">
                            ⚠️ Warning
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-display font-semibold text-lg text-foreground">
                              {food.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {food.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-success/10">
                            <Star className="w-3.5 h-3.5 text-success fill-success" />
                            <span className="text-sm font-semibold text-success">{food.rating}</span>
                          </div>
                        </div>

                        {/* Health Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {food.isDiabeticSafe && (
                            <Badge className="bg-success/15 text-success border-0 text-xs">
                              <Check className="w-3 h-3 mr-1" /> Diabetic Safe
                            </Badge>
                          )}
                          {food.isVegan && (
                            <Badge className="bg-success/15 text-success border-0 text-xs">
                              <Leaf className="w-3 h-3 mr-1" /> Vegan
                            </Badge>
                          )}
                          {food.isKeto && (
                            <Badge className="bg-purple/15 text-purple border-0 text-xs">Keto</Badge>
                          )}
                          {food.isGlutenFree && (
                            <Badge variant="secondary" className="text-xs">GF</Badge>
                          )}
                        </div>

                        {/* Nutrition Quick View */}
                        <div className="flex items-center gap-3 mt-3 text-xs">
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            <Flame className="w-3 h-3" />
                            {food.nutrition.calories} kcal
                          </span>
                          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                            P: {food.nutrition.protein}g
                          </span>
                          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                            C: {food.nutrition.carbs}g
                          </span>
                        </div>

                        {/* Price & Add */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xl font-bold text-primary">₹{food.price}</span>
                          <Button
                            size="sm"
                            className="rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(food);
                            }}
                          >
                            Add +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDetails;
