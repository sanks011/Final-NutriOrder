import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Review, useReviews } from '@/context/ReviewContext';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { markHelpful } = useReviews();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-5 rounded-2xl bg-card border border-border"
    >
      <div className="flex items-start gap-3 md:gap-4">
        <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
          <AvatarImage src={review.userAvatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {getInitials(review.userName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{review.userName}</span>
              {review.verified && (
                <Badge variant="secondary" className="text-xs gap-1 px-2 py-0.5">
                  <CheckCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">Verified</span>
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating
                    ? 'text-warning fill-warning'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <h4 className="font-semibold text-foreground mb-1">{review.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {review.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Review ${i + 1}`}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0"
                />
              ))}
            </div>
          )}

          {/* Helpful Button */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markHelpful(review.id)}
              className="text-muted-foreground hover:text-primary h-8 px-2 md:px-3"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span className="text-xs">Helpful ({review.helpful})</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
