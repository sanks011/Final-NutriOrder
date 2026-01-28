import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useReviews } from '@/context/ReviewContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ReviewFormProps {
  foodId: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ foodId, onSuccess }) => {
  const { addReview } = useReviews();
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addReview({
      foodId,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous User',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verified: true,
    });

    toast.success('Review submitted successfully!');
    setRating(0);
    setTitle('');
    setComment('');
    setIsSubmitting(false);
    onSuccess?.();
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 rounded-2xl bg-muted/50 border border-border text-center">
        <p className="text-muted-foreground mb-4">Please login to write a review</p>
        <Button onClick={() => window.location.href = '/auth/login'} className="rounded-full">
          Login to Review
        </Button>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="p-4 md:p-6 rounded-2xl bg-card border border-border space-y-4 md:space-y-5"
    >
      <h3 className="font-display font-bold text-lg">Write a Review</h3>

      {/* Rating Selection */}
      <div>
        <Label className="mb-2 block">Your Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-7 h-7 md:w-8 md:h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-warning fill-warning'
                    : 'text-muted-foreground/30'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>
      </div>

      {/* Review Title */}
      <div>
        <Label htmlFor="review-title">Review Title *</Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="rounded-xl mt-1.5"
          maxLength={100}
        />
      </div>

      {/* Review Comment */}
      <div>
        <Label htmlFor="review-comment">Your Review *</Label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this dish..."
          className="rounded-xl mt-1.5 min-h-[100px] md:min-h-[120px]"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">{comment.length}/500</p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl h-11 md:h-12"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </motion.form>
  );
};

export default ReviewForm;
