import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Review {
  id: string;
  foodId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: Date;
  verified: boolean;
}

interface ReviewContextType {
  reviews: Review[];
  getReviewsForFood: (foodId: string) => Review[];
  getAverageRating: (foodId: string) => number;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  markHelpful: (reviewId: string) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const initialReviews: Review[] = [
  {
    id: '1',
    foodId: '1',
    userId: 'user1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Perfect for my diet!',
    comment: 'This Buddha Bowl is amazing! Low calories, high protein, and super tasty. Been ordering it every week for my meal prep.',
    helpful: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    verified: true,
  },
  {
    id: '2',
    foodId: '1',
    userId: 'user2',
    userName: 'Mike R.',
    rating: 4,
    title: 'Great taste, slightly small portion',
    comment: 'Really delicious and healthy. My only feedback is the portion could be a bit larger for the price. Otherwise, highly recommend!',
    helpful: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    verified: true,
  },
  {
    id: '3',
    foodId: '2',
    userId: 'user3',
    userName: 'Priya K.',
    rating: 5,
    title: 'Best grilled salmon ever!',
    comment: 'The omega-3 rich salmon is cooked to perfection. Love that it comes with detailed nutrition info. Perfect for my fitness goals.',
    helpful: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    verified: true,
  },
  {
    id: '4',
    foodId: '3',
    userId: 'user4',
    userName: 'David L.',
    rating: 5,
    title: 'Diabetic-friendly and delicious',
    comment: 'As someone with diabetes, finding safe and tasty food is hard. This quinoa salad is perfect - low glycemic and full of flavor!',
    helpful: 20,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    verified: true,
  },
  {
    id: '5',
    foodId: '4',
    userId: 'user5',
    userName: 'Emma W.',
    rating: 4,
    title: 'Good protein boost',
    comment: 'Great post-workout meal. The protein content is excellent and it keeps me full for hours. Would love more sauce options.',
    helpful: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    verified: false,
  },
];

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('nutriorder-reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const saveToStorage = (items: Review[]) => {
    localStorage.setItem('nutriorder-reviews', JSON.stringify(items));
  };

  const getReviewsForFood = useCallback(
    (foodId: string) => {
      return reviews.filter((r) => r.foodId === foodId).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    [reviews]
  );

  const getAverageRating = useCallback(
    (foodId: string) => {
      const foodReviews = reviews.filter((r) => r.foodId === foodId);
      if (foodReviews.length === 0) return 0;
      const sum = foodReviews.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / foodReviews.length) * 10) / 10;
    },
    [reviews]
  );

  const addReview = useCallback(
    (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        createdAt: new Date(),
        helpful: 0,
      };
      const updated = [newReview, ...reviews];
      setReviews(updated);
      saveToStorage(updated);
    },
    [reviews]
  );

  const markHelpful = useCallback((reviewId: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        getReviewsForFood,
        getAverageRating,
        addReview,
        markHelpful,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
