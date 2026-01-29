import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid3X3, 
  List, 
  Filter, 
  X, 
  Search,
  Flame,
  Check,
  Leaf,
  AlertTriangle,
  SlidersHorizontal,
  Heart,
  Zap,
  ChefHat
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import PageTransition from '@/components/common/PageTransition';
import FoodCard from '@/components/food/FoodCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { foodAPI, Food } from '@/services/api';
import { useHealth } from '@/context/HealthContext';

interface Filters {
  search: string;
  maxCalories: number;
  minProtein: number;
  maxSugar: number;
  maxSodium: number;
  isDiabeticSafe: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isKeto: boolean;
  showSafeOnly: boolean;
}

const FoodList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { profile, checkFoodSafety } = useHealth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    maxCalories: 1000,
    minProtein: 0,
    maxSugar: 50,
    maxSodium: 1500,
    isDiabeticSafe: false,
    isVegan: false,
    isGlutenFree: false,
    isKeto: false,
    showSafeOnly: false,
  });

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await foodAPI.getAll();
        setFoods(response.data);
      } catch (error) {
        console.error('Failed to fetch foods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.maxCalories < 1000) count++;
    if (filters.minProtein > 0) count++;
    if (filters.maxSugar < 50) count++;
    if (filters.maxSodium < 1500) count++;
    if (filters.isDiabeticSafe) count++;
    if (filters.isVegan) count++;
    if (filters.isGlutenFree) count++;
    if (filters.isKeto) count++;
    if (filters.showSafeOnly) count++;
    return count;
  }, [filters]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !food.name.toLowerCase().includes(searchLower) &&
          !food.description.toLowerCase().includes(searchLower) &&
          !food.category.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (food.nutrition.calories > filters.maxCalories) return false;
      if (food.nutrition.protein < filters.minProtein) return false;
      if (food.nutrition.sugar > filters.maxSugar) return false;
      if (food.nutrition.sodium > filters.maxSodium) return false;

      if (filters.isDiabeticSafe && !food.isDiabeticSafe) return false;
      if (filters.isVegan && !food.isVegan) return false;
      if (filters.isGlutenFree && !food.isGlutenFree) return false;
      if (filters.isKeto && !food.isKeto) return false;

      if (filters.showSafeOnly) {
        const safety = checkFoodSafety(food);
        if (!safety.isSafe) return false;
      }

      return true;
    });
  }, [foods, filters, checkFoodSafety]);

  const resetFilters = () => {
    setFilters({
      search: '',
      maxCalories: 1000,
      minProtein: 0,
      maxSugar: 50,
      maxSodium: 1500,
      isDiabeticSafe: false,
      isVegan: false,
      isGlutenFree: false,
      isKeto: false,
      showSafeOnly: false,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {profile && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Personal Health Filter</span>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showSafeOnly"
              checked={filters.showSafeOnly}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, showSafeOnly: checked as boolean }))
              }
            />
            <Label htmlFor="showSafeOnly" className="text-sm">
              Show only safe foods for my health profile
            </Label>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            Max Calories
          </Label>
          <span className="text-sm font-bold text-primary">
            {filters.maxCalories} kcal
          </span>
        </div>
        <Slider
          value={[filters.maxCalories]}
          onValueChange={([value]) =>
            setFilters((prev) => ({ ...prev, maxCalories: value }))
          }
          min={100}
          max={1000}
          step={50}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Min Protein
          </Label>
          <span className="text-sm font-bold text-primary">
            {filters.minProtein}g
          </span>
        </div>
        <Slider
          value={[filters.minProtein]}
          onValueChange={([value]) =>
            setFilters((prev) => ({ ...prev, minProtein: value }))
          }
          min={0}
          max={50}
          step={5}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Max Sugar</Label>
          <span className="text-sm font-bold text-primary">
            {filters.maxSugar}g
          </span>
        </div>
        <Slider
          value={[filters.maxSugar]}
          onValueChange={([value]) =>
            setFilters((prev) => ({ ...prev, maxSugar: value }))
          }
          min={0}
          max={50}
          step={5}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Max Sodium</Label>
          <span className="text-sm font-bold text-primary">
            {filters.maxSodium}mg
          </span>
        </div>
        <Slider
          value={[filters.maxSodium]}
          onValueChange={([value]) =>
            setFilters((prev) => ({ ...prev, maxSodium: value }))
          }
          min={100}
          max={1500}
          step={100}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <Label className="font-semibold">Dietary Preferences</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDiabeticSafe"
              checked={filters.isDiabeticSafe}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, isDiabeticSafe: checked as boolean }))
              }
            />
            <Label htmlFor="isDiabeticSafe" className="text-sm">
              Diabetic Safe
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVegan"
              checked={filters.isVegan}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, isVegan: checked as boolean }))
              }
            />
            <Label htmlFor="isVegan" className="text-sm flex items-center gap-1">
              <Leaf className="w-3 h-3 text-success" /> Vegan
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isGlutenFree"
              checked={filters.isGlutenFree}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, isGlutenFree: checked as boolean }))
              }
            />
            <Label htmlFor="isGlutenFree" className="text-sm">
              Gluten Free
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isKeto"
              checked={filters.isKeto}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, isKeto: checked as boolean }))
              }
            />
            <Label htmlFor="isKeto" className="text-sm">
              Keto
            </Label>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full rounded-2xl border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        Reset All Filters
      </Button>
    </div>
  );

  return (
    <Layout>
      <PageTransition>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading delicious foods...</p>
            </div>
          </div>
        ) : (
          <>
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-12 md:py-16">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                <ChefHat className="w-4 h-4" />
                Handcrafted with love
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3">
                Explore Our Menu
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Discover {filteredFoods.length} healthy, delicious dishes crafted for your wellness goals
              </p>
            </motion.div>
          </div>
        </section>

        <div className="min-h-screen py-8 bg-background">
          <div className="container mx-auto px-4">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search dishes, cuisines..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="pl-12 h-12 rounded-full border-2 border-border focus:border-primary bg-card"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center bg-muted rounded-full p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-full transition-all ${
                      viewMode === 'grid'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-full transition-all ${
                      viewMode === 'list'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Button - Mobile */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative md:hidden rounded-full border-2 bg-card">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-primary">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[320px] sm:w-[400px] bg-card">
                    <SheetHeader>
                      <SheetTitle className="font-display">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {filters.isDiabeticSafe && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Diabetic Safe
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, isDiabeticSafe: false }))
                      }
                    />
                  </Badge>
                )}
                {filters.isVegan && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">
                    <Leaf className="w-3 h-3" /> Vegan
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, isVegan: false }))
                      }
                    />
                  </Badge>
                )}
                {filters.isGlutenFree && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground border border-accent/30">
                    Gluten Free
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, isGlutenFree: false }))
                      }
                    />
                  </Badge>
                )}
                {filters.isKeto && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                    Keto
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, isKeto: false }))
                      }
                    />
                  </Badge>
                )}
                {filters.showSafeOnly && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    <Check className="w-3 h-3" /> Safe for me
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, showSafeOnly: false }))
                      }
                    />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={resetFilters} className="rounded-full text-muted-foreground hover:text-foreground">
                  Clear all
                </Button>
              </motion.div>
            )}

            <div className="flex gap-8">
              {/* Desktop Sidebar Filters */}
              <aside className="hidden md:block w-80 shrink-0">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-24 p-6 rounded-3xl bg-card border-2 border-border shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-lg flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary" />
                      Filters
                    </h2>
                    {activeFilterCount > 0 && (
                      <Badge className="bg-primary">{activeFilterCount}</Badge>
                    )}
                  </div>
                  <FilterContent />
                </motion.div>
              </aside>

              {/* Food Grid/List */}
              <main className="flex-1">
                {filteredFoods.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-card rounded-3xl border border-border"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2">
                      No dishes found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button onClick={resetFilters} variant="outline" className="rounded-full">
                      Reset Filters
                    </Button>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={viewMode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={
                        viewMode === 'grid'
                          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                          : 'space-y-4'
                      }
                    >
                      {filteredFoods.map((food, index) => (
                        <motion.div
                          key={food._id || food.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <FoodCard food={food} variant={viewMode === 'list' ? 'compact' : 'default'} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </main>
            </div>
          </div>
        </div>
        </>
        )}
      </PageTransition>
    </Layout>
  );
};

export default FoodList;
