import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReviews } from '@/context/ReviewContext';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

interface ReviewSectionProps {
  foodId: string;
  foodName: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ foodId, foodName }) => {
  const { getReviewsForFood, getAverageRating } = useReviews();
  const [showForm, setShowForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviews = getReviewsForFood(foodId);
  const averageRating = getAverageRating(foodId);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 
      : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
            Customer Reviews
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} for {foodName}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full gap-2 w-full sm:w-auto"
        >
          <MessageSquare className="w-4 h-4" />
          Write a Review
        </Button>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6 p-4 md:p-6 rounded-2xl bg-muted/50 border border-border"
        >
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-warning fill-warning'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-8 flex items-center gap-1">
                  {star} <Star className="w-3 h-3 text-warning fill-warning" />
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-muted-foreground text-right">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          foodId={foodId}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {reviews.length > 3 && !showAllReviews && (
            <Button
              variant="outline"
              onClick={() => setShowAllReviews(true)}
              className="w-full rounded-xl"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Show All {reviews.length} Reviews
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 md:py-12">
          <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No reviews yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Be the first to review this dish!
          </p>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="rounded-full">
              Write a Review
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
