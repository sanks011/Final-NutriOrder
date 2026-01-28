import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'referral';
  points: number;
  description: string;
  orderId?: string;
  date: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discountAmount: number;
  discountType: 'flat' | 'percentage';
  icon: string;
  category: 'discount' | 'freebie' | 'upgrade';
}

interface Referral {
  id: string;
  code: string;
  referredEmail: string;
  status: 'pending' | 'completed';
  pointsEarned: number;
  createdAt: string;
  completedAt?: string;
}

interface LoyaltyContextType {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  transactions: PointsTransaction[];
  rewards: Reward[];
  appliedReward: Reward | null;
  referralCode: string;
  referrals: Referral[];
  earnPoints: (orderId: string, orderTotal: number, hasHealthyItems: boolean) => number;
  redeemReward: (reward: Reward) => boolean;
  clearAppliedReward: () => void;
  calculateDiscount: (subtotal: number) => number;
  getNextTier: () => { tier: string; pointsNeeded: number } | null;
  getTierBenefits: (tier: string) => string[];
  applyReferralCode: (code: string, email: string) => boolean;
  completeReferral: (email: string) => void;
  shareReferralLink: () => string;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 3000,
};

const REFERRAL_BONUS_POINTS = 100;
const REFEREE_BONUS_POINTS = 50;

const AVAILABLE_REWARDS: Reward[] = [
  {
    id: 'r1',
    name: '₹50 Off',
    description: 'Get ₹50 off your next order',
    pointsCost: 200,
    discountAmount: 50,
    discountType: 'flat',
    icon: '🎫',
    category: 'discount',
  },
  {
    id: 'r2',
    name: '₹100 Off',
    description: 'Get ₹100 off orders above ₹500',
    pointsCost: 400,
    discountAmount: 100,
    discountType: 'flat',
    icon: '🎁',
    category: 'discount',
  },
  {
    id: 'r3',
    name: '10% Off',
    description: 'Get 10% off your entire order',
    pointsCost: 300,
    discountAmount: 10,
    discountType: 'percentage',
    icon: '✨',
    category: 'discount',
  },
  {
    id: 'r4',
    name: 'Free Smoothie',
    description: 'Get a free healthy smoothie with your order',
    pointsCost: 250,
    discountAmount: 229,
    discountType: 'flat',
    icon: '🥤',
    category: 'freebie',
  },
  {
    id: 'r5',
    name: 'Free Delivery',
    description: 'Free delivery on your next order',
    pointsCost: 150,
    discountAmount: 40,
    discountType: 'flat',
    icon: '🚚',
    category: 'upgrade',
  },
  {
    id: 'r6',
    name: '₹200 Off',
    description: 'Get ₹200 off orders above ₹1000',
    pointsCost: 750,
    discountAmount: 200,
    discountType: 'flat',
    icon: '💎',
    category: 'discount',
  },
];

const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'FIT';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Mock initial transactions
const INITIAL_TRANSACTIONS: PointsTransaction[] = [
  {
    id: 't1',
    type: 'earned',
    points: 105,
    description: 'Order #ORD1 - Earned 10% on healthy items',
    orderId: 'ord1',
    date: '2024-12-20T14:30:00Z',
  },
  {
    id: 't2',
    type: 'earned',
    points: 28,
    description: 'Order #ORD2 - Earned 10% on healthy items',
    orderId: 'ord2',
    date: '2024-12-18T19:15:00Z',
  },
  {
    id: 't3',
    type: 'redeemed',
    points: -150,
    description: 'Redeemed: Free Delivery',
    date: '2024-12-15T10:00:00Z',
  },
  {
    id: 't4',
    type: 'referral',
    points: 100,
    description: 'Referral bonus: friend@email.com placed first order',
    date: '2024-12-10T12:00:00Z',
  },
];

const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref1',
    code: 'FITABC12',
    referredEmail: 'friend@email.com',
    status: 'completed',
    pointsEarned: 100,
    createdAt: '2024-12-08T10:00:00Z',
    completedAt: '2024-12-10T12:00:00Z',
  },
];

export const LoyaltyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(563);
  const [transactions, setTransactions] = useState<PointsTransaction[]>(INITIAL_TRANSACTIONS);
  const [appliedReward, setAppliedReward] = useState<Reward | null>(null);
  const [referralCode] = useState<string>(() => generateReferralCode());
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [pendingReferrals, setPendingReferrals] = useState<Map<string, string>>(new Map());

  const getTier = (totalPoints: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
    if (totalPoints >= TIER_THRESHOLDS.platinum) return 'platinum';
    if (totalPoints >= TIER_THRESHOLDS.gold) return 'gold';
    if (totalPoints >= TIER_THRESHOLDS.silver) return 'silver';
    return 'bronze';
  };

  const tier = getTier(points);

  const earnPoints = (orderId: string, orderTotal: number, hasHealthyItems: boolean): number => {
    // Base: 5% of order total, bonus 5% for healthy items
    const basePoints = Math.round(orderTotal * 0.05);
    const healthyBonus = hasHealthyItems ? Math.round(orderTotal * 0.05) : 0;
    const tierMultiplier = tier === 'platinum' ? 1.5 : tier === 'gold' ? 1.25 : tier === 'silver' ? 1.1 : 1;
    
    const totalEarned = Math.round((basePoints + healthyBonus) * tierMultiplier);

    const newTransaction: PointsTransaction = {
      id: `t${Date.now()}`,
      type: 'earned',
      points: totalEarned,
      description: `Order #${orderId.toUpperCase()} - ${hasHealthyItems ? 'Healthy bonus applied!' : 'Base points'}`,
      orderId,
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setPoints((prev) => prev + totalEarned);

    return totalEarned;
  };

  const redeemReward = (reward: Reward): boolean => {
    if (points < reward.pointsCost) return false;

    const newTransaction: PointsTransaction = {
      id: `t${Date.now()}`,
      type: 'redeemed',
      points: -reward.pointsCost,
      description: `Redeemed: ${reward.name}`,
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setPoints((prev) => prev - reward.pointsCost);
    setAppliedReward(reward);

    return true;
  };

  const clearAppliedReward = () => {
    setAppliedReward(null);
  };

  const calculateDiscount = (subtotal: number): number => {
    if (!appliedReward) return 0;
    
    if (appliedReward.discountType === 'percentage') {
      return Math.round(subtotal * (appliedReward.discountAmount / 100));
    }
    return appliedReward.discountAmount;
  };

  const getNextTier = (): { tier: string; pointsNeeded: number } | null => {
    if (tier === 'platinum') return null;
    
    const tiers = ['bronze', 'silver', 'gold', 'platinum'] as const;
    const currentIndex = tiers.indexOf(tier);
    const nextTier = tiers[currentIndex + 1];
    const pointsNeeded = TIER_THRESHOLDS[nextTier] - points;

    return { tier: nextTier, pointsNeeded };
  };

  const getTierBenefits = (tierName: string): string[] => {
    switch (tierName) {
      case 'bronze':
        return ['5% points on all orders', '5% bonus on healthy items'];
      case 'silver':
        return ['10% bonus multiplier on points', 'Early access to new dishes', 'Birthday reward'];
      case 'gold':
        return ['25% bonus multiplier on points', 'Priority customer support', 'Exclusive offers'];
      case 'platinum':
        return ['50% bonus multiplier on points', 'Free delivery on all orders', 'VIP support'];
      default:
        return [];
    }
  };

  const applyReferralCode = (code: string, email: string): boolean => {
    // Can't use own referral code
    if (code === referralCode) return false;
    
    // Check if code is valid format (starts with FIT)
    if (!code.startsWith('FIT') || code.length !== 8) return false;
    
    // Add to pending referrals (will be completed when they place first order)
    setPendingReferrals((prev) => new Map(prev).set(email, code));
    
    // Give referee welcome bonus
    const refereeTransaction: PointsTransaction = {
      id: `t${Date.now()}`,
      type: 'referral',
      points: REFEREE_BONUS_POINTS,
      description: `Welcome bonus: Used referral code ${code}`,
      date: new Date().toISOString(),
    };
    
    setTransactions((prev) => [refereeTransaction, ...prev]);
    setPoints((prev) => prev + REFEREE_BONUS_POINTS);
    
    return true;
  };

  const completeReferral = (email: string): void => {
    const referrerCode = pendingReferrals.get(email);
    if (!referrerCode) return;
    
    // Award points to referrer (simulated - in real app this would notify the referrer)
    const newReferral: Referral = {
      id: `ref${Date.now()}`,
      code: referrerCode,
      referredEmail: email,
      status: 'completed',
      pointsEarned: REFERRAL_BONUS_POINTS,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    
    setReferrals((prev) => [newReferral, ...prev]);
    
    // Add referral bonus transaction
    const referralTransaction: PointsTransaction = {
      id: `t${Date.now()}`,
      type: 'referral',
      points: REFERRAL_BONUS_POINTS,
      description: `Referral bonus: ${email} placed first order`,
      date: new Date().toISOString(),
    };
    
    setTransactions((prev) => [referralTransaction, ...prev]);
    setPoints((prev) => prev + REFERRAL_BONUS_POINTS);
    
    // Remove from pending
    setPendingReferrals((prev) => {
      const newMap = new Map(prev);
      newMap.delete(email);
      return newMap;
    });
  };

  const shareReferralLink = (): string => {
    return `${window.location.origin}/register?ref=${referralCode}`;
  };

  return (
    <LoyaltyContext.Provider
      value={{
        points,
        tier,
        transactions,
        rewards: AVAILABLE_REWARDS,
        appliedReward,
        referralCode,
        referrals,
        earnPoints,
        redeemReward,
        clearAppliedReward,
        calculateDiscount,
        getNextTier,
        getTierBenefits,
        applyReferralCode,
        completeReferral,
        shareReferralLink,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = (): LoyaltyContextType => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};
