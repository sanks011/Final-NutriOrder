import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import FoodCard from '@/components/food/FoodCard';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach((food) => {
      addItem(food);
    });
    toast.success(`Added ${wishlist.length} items to cart`);
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary fill-primary" />
                <span className="text-gradient-warm">My Wishlist</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Save your favorite meals to order them later. Tap the heart icon on any dish to add it here.
            </p>
            <Button
              onClick={() => navigate('/foods')}
              className="rounded-full btn-primary"
            >
              Explore Menu
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Button
                onClick={handleAddAllToCart}
                className="gap-2 rounded-full btn-primary"
              >
                <ShoppingCart className="w-4 h-4" />
                Add All to Cart
              </Button>
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="gap-2 rounded-full text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Clear Wishlist
              </Button>
            </motion.div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FoodCard food={food} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
