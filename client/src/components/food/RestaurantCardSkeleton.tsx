import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface RestaurantCardSkeletonProps {
  count?: number;
}

const RestaurantCardSkeleton: React.FC<RestaurantCardSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="relative h-48 bg-muted overflow-hidden">
            <div className="absolute inset-0 shimmer-effect" />
          </div>

          {/* Content Skeleton */}
          <div className="p-5 space-y-3">
            {/* Title */}
            <Skeleton className="h-6 w-3/4 bg-muted" />
            
            {/* Cuisine Tags */}
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full bg-muted" />
              <Skeleton className="h-5 w-20 rounded-full bg-muted" />
              <Skeleton className="h-5 w-14 rounded-full bg-muted" />
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-20 bg-muted" />
              <Skeleton className="h-4 w-16 bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default RestaurantCardSkeleton;
