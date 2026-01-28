import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, Gift, CheckCircle2, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLoyalty } from '@/context/LoyaltyContext';
import { toast } from 'sonner';

const ReferralSection: React.FC = () => {
  const { referralCode, referrals, shareReferralLink } = useLoyalty();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareReferralLink());
      toast.success('Referral link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join Fiteats!',
      text: `Use my referral code ${referralCode} to get 50 bonus points on Fiteats! 🍽️`,
      url: shareReferralLink(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopyLink();
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        handleCopyLink();
      }
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

  const completedReferrals = referrals.filter((r) => r.status === 'completed');
  const pendingReferrals = referrals.filter((r) => r.status === 'pending');
  const totalEarned = completedReferrals.reduce((sum, r) => sum + r.pointsEarned, 0);

  return (
    <div className="space-y-8">
      {/* Referral Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Invite Friends, Earn Points</h2>
              <p className="text-muted-foreground">
                Get <span className="text-primary font-semibold">100 points</span> for each friend who orders
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-card/80 border border-border/50 text-center">
              <p className="text-3xl font-bold text-primary">{completedReferrals.length}</p>
              <p className="text-sm text-muted-foreground">Friends Joined</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/80 border border-border/50 text-center">
              <p className="text-3xl font-bold text-success">{totalEarned}</p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/80 border border-border/50 text-center">
              <p className="text-3xl font-bold text-amber-500">{pendingReferrals.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Your Referral Code</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={referralCode}
                  readOnly
                  className="h-14 text-xl font-mono font-bold text-center tracking-widest bg-card border-2 border-primary/30 rounded-2xl"
                />
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="lg"
                className="h-14 px-6 rounded-2xl border-2 border-primary/30"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-3 mt-4">
            <Button onClick={handleShare} className="flex-1 h-12 rounded-2xl btn-soft" size="lg">
              <Share2 className="w-5 h-5 mr-2" />
              Share with Friends
            </Button>
            <Button onClick={handleCopyLink} variant="outline" className="h-12 px-6 rounded-2xl">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </motion.div>

      {/* How it Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          How Referrals Work
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: 1, title: 'Share Code', desc: 'Send your unique code to friends' },
            { step: 2, title: 'Friend Signs Up', desc: 'They get 50 welcome points' },
            { step: 3, title: 'You Earn', desc: 'Get 100 points when they order' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-primary font-bold">{item.step}</span>
              </div>
              <h4 className="font-semibold mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Referral History */}
      {referrals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Your Referrals
          </h3>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        referral.status === 'completed'
                          ? 'bg-success/10 text-success'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {referral.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{referral.referredEmail}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {referral.status === 'completed'
                          ? `Completed ${formatDate(referral.completedAt!)}`
                          : `Invited ${formatDate(referral.createdAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                      className={referral.status === 'completed' ? 'bg-success' : ''}
                    >
                      {referral.status === 'completed' ? `+${referral.pointsEarned} pts` : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReferralSection;