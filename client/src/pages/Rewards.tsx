import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gift,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  Crown,
  Sparkles,
  Award,
  ChevronRight,
  ShoppingBag,
  Users,
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoyalty } from '@/context/LoyaltyContext';
import { toast } from 'sonner';
import ReferralSection from '@/components/rewards/ReferralSection';

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-400 to-slate-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
};

const tierBgColors = {
  bronze: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
  silver: 'bg-slate-400/10 border-slate-400/30 text-slate-500',
  gold: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600',
  platinum: 'bg-purple-500/10 border-purple-500/30 text-purple-500',
};

const Rewards: React.FC = () => {
  const navigate = useNavigate();
  const {
    points,
    tier,
    transactions,
    rewards,
    redeemReward,
    getNextTier,
    getTierBenefits,
  } = useLoyalty();

  const nextTier = getNextTier();
  const progressToNextTier = nextTier
    ? ((points - (tier === 'bronze' ? 0 : tier === 'silver' ? 500 : tier === 'gold' ? 1500 : 3000)) /
        (nextTier.pointsNeeded +
          (points - (tier === 'bronze' ? 0 : tier === 'silver' ? 500 : tier === 'gold' ? 1500 : 3000)))) *
      100
    : 100;

  const handleRedeemReward = (reward: typeof rewards[0]) => {
    if (points < reward.pointsCost) {
      toast.error('Not enough points', {
        description: `You need ${reward.pointsCost - points} more points.`,
      });
      return;
    }

    const success = redeemReward(reward);
    if (success) {
      toast.success('Reward redeemed!', {
        description: `${reward.name} has been applied. Use it at checkout!`,
        action: {
          label: 'Order Now',
          onClick: () => navigate('/foods'),
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${tierColors[tier]} opacity-10`} />
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Points Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 rounded-3xl bg-gradient-to-br ${tierColors[tier]} text-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6" />
                    <span className="text-lg font-semibold capitalize">{tier} Member</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="mb-6">
                  <p className="text-white/70 text-sm mb-1">Available Points</p>
                  <p className="text-5xl font-display font-bold">{points.toLocaleString()}</p>
                </div>

                {nextTier && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Progress to {nextTier.tier}</span>
                      <span className="font-medium">{nextTier.pointsNeeded} pts needed</span>
                    </div>
                    <Progress value={progressToNextTier} className="h-2 bg-white/20" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tier Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-display font-bold">Your {tier.charAt(0).toUpperCase() + tier.slice(1)} Benefits</h2>
              <div className="space-y-3">
                {getTierBenefits(tier).map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tierBgColors[tier]}`}>
                      <Star className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs for Rewards vs Referrals */}
        <Tabs defaultValue="rewards" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14 rounded-2xl bg-muted/50 p-1">
            <TabsTrigger value="rewards" className="rounded-xl h-full data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="referrals" className="rounded-xl h-full data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-12">
            {/* How to Earn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                How to Earn Points
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: ShoppingBag, title: 'Order Food', desc: 'Earn 5% on every order', points: '5%' },
                  { icon: Award, title: 'Healthy Choices', desc: 'Extra 5% on healthy items', points: '+5%' },
                  { icon: Crown, title: 'Tier Bonus', desc: 'Up to 50% bonus for Platinum', points: 'Up to 50%' },
                  { icon: Users, title: 'Refer Friends', desc: 'Get 100 pts per referral', points: '100 pts' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                    <Badge variant="secondary" className="text-xs">
                      {item.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Available Rewards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <Gift className="w-6 h-6 text-primary" />
                Redeem Rewards
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => {
                  const canRedeem = points >= reward.pointsCost;
                  return (
                    <motion.div
                      key={reward.id}
                      whileHover={{ scale: canRedeem ? 1.02 : 1 }}
                      className={`p-6 rounded-2xl border transition-all ${
                        canRedeem
                          ? 'bg-card border-border hover:border-primary/30 cursor-pointer'
                          : 'bg-muted/30 border-border/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{reward.icon}</div>
                        <Badge
                          variant={canRedeem ? 'default' : 'secondary'}
                          className={canRedeem ? 'bg-primary' : ''}
                        >
                          {reward.pointsCost} pts
                        </Badge>
                      </div>
                      <h3 className="font-display font-bold text-lg mb-1">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                      <Button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={!canRedeem}
                        className="w-full rounded-xl"
                        variant={canRedeem ? 'default' : 'secondary'}
                      >
                        {canRedeem ? (
                          <>
                            Redeem <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        ) : (
                          `Need ${reward.pointsCost - points} more pts`
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Points History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Points History
              </h2>
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="divide-y divide-border">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'earned'
                              ? 'bg-success/10 text-success'
                              : transaction.type === 'referral'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {transaction.type === 'earned' ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : transaction.type === 'referral' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <Gift className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${
                          transaction.points > 0 ? 'text-success' : 'text-amber-500'
                        }`}
                      >
                        {transaction.points > 0 ? '+' : ''}
                        {transaction.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralSection />
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button onClick={() => navigate('/foods')} size="lg" className="rounded-full btn-soft">
            Start Earning Points
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Rewards;
