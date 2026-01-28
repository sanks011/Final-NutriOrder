import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Food } from '@/services/api';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: Food[];
  addToWishlist: (food: Food) => void;
  removeFromWishlist: (foodId: string) => void;
  isInWishlist: (foodId: string) => boolean;
  toggleWishlist: (food: Food) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Food[]>(() => {
    const saved = localStorage.getItem('fiteats-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const saveToStorage = (items: Food[]) => {
    localStorage.setItem('fiteats-wishlist', JSON.stringify(items));
  };

  const addToWishlist = (food: Food) => {
    if (!isInWishlist(food.id)) {
      const newWishlist = [...wishlist, food];
      setWishlist(newWishlist);
      saveToStorage(newWishlist);
      toast.success(`${food.name} added to wishlist`, {
        icon: '❤️',
      });
    }
  };

  const removeFromWishlist = (foodId: string) => {
    const food = wishlist.find(f => f.id === foodId);
    const newWishlist = wishlist.filter((f) => f.id !== foodId);
    setWishlist(newWishlist);
    saveToStorage(newWishlist);
    if (food) {
      toast.success(`${food.name} removed from wishlist`);
    }
  };

  const isInWishlist = (foodId: string) => {
    return wishlist.some((food) => food.id === foodId);
  };

  const toggleWishlist = (food: Food) => {
    if (isInWishlist(food.id)) {
      removeFromWishlist(food.id);
    } else {
      addToWishlist(food);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('fiteats-wishlist');
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
