import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLoyalty } from '@/context/LoyaltyContext';

interface LoyaltyCheckoutProps {
  subtotal: number;
}

const LoyaltyCheckout: React.FC<LoyaltyCheckoutProps> = ({ subtotal }) => {
  const { points, tier, appliedReward, calculateDiscount, clearAppliedReward, rewards } = useLoyalty();

  const discount = calculateDiscount(subtotal);
  const availableRewards = rewards.filter((r) => points >= r.pointsCost);
  const estimatedPoints = Math.round(subtotal * 0.1); // 5% base + 5% healthy bonus estimate

  const tierColors = {
    bronze: 'text-amber-600',
    silver: 'text-slate-500',
    gold: 'text-yellow-600',
    platinum: 'text-purple-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Loyalty Rewards
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${tierColors[tier]} border-current`}>
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
          <span className="text-sm font-medium">{points} pts</span>
        </div>
      </div>

      {/* Applied Reward */}
      {appliedReward ? (
        <div className="p-4 rounded-xl bg-success/10 border border-success/30 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{appliedReward.icon}</div>
              <div>
                <p className="font-semibold text-success flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {appliedReward.name} Applied
                </p>
                <p className="text-sm text-muted-foreground">
                  Saving ₹{discount} on this order
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAppliedReward}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : availableRewards.length > 0 ? (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            <Gift className="w-4 h-4 inline mr-1" />
            You have {availableRewards.length} reward{availableRewards.length > 1 ? 's' : ''} available!
          </p>
          <Button
            variant="link"
            className="h-auto p-0 text-primary"
            onClick={() => window.location.href = '/rewards'}
          >
            Redeem a reward before checkout →
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-muted/50 border border-border mb-4">
          <p className="text-sm text-muted-foreground">
            Keep ordering to earn more points and unlock rewards!
          </p>
        </div>
      )}

      {/* Points to Earn */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm">Points you'll earn</span>
        </div>
        <span className="font-bold text-primary">+{estimatedPoints} pts</span>
      </div>
    </motion.div>
  );
};

export default LoyaltyCheckout;