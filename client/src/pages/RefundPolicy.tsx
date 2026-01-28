import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';

const RefundPolicy: React.FC = () => {
  const navigate = useNavigate();

  const refundCases = [
    {
      icon: CheckCircle,
      title: 'Full Refund Eligible',
      items: [
        'Order cancelled within 5 minutes of placement',
        'Restaurant unable to fulfill your order',
        'Wrong items delivered (verified by support)',
        'Food quality issues (photo evidence required)',
        'Missing items from your order',
      ],
      color: 'success',
    },
    {
      icon: Clock,
      title: 'Partial Refund',
      items: [
        'Significant delay beyond estimated time (30+ minutes)',
        'Partial order delivered',
        'Minor quality issues',
        'Incorrect modifications to order',
      ],
      color: 'warning',
    },
    {
      icon: AlertCircle,
      title: 'No Refund',
      items: [
        'Order cancelled after restaurant starts preparing',
        'Incorrect delivery address provided by customer',
        'Customer unavailable at delivery location',
        'Change of mind after order placement',
        'Promotional items or free samples',
      ],
      color: 'destructive',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Report the Issue',
      description: 'Contact our support within 24 hours of delivery through the app or website.',
    },
    {
      number: 2,
      title: 'Provide Details',
      description: 'Share your order ID, describe the issue, and attach photos if applicable.',
    },
    {
      number: 3,
      title: 'Review Process',
      description: 'Our team will review your request within 24-48 hours.',
    },
    {
      number: 4,
      title: 'Refund Processing',
      description: 'Approved refunds are processed within 5-7 business days to original payment method.',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Refund Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: January 2024
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mb-8 text-sm md:text-base">
            We want you to be completely satisfied with your NutriOrder experience. 
            If something goes wrong, here's how we handle refunds.
          </p>

          {/* Refund Cases */}
          <div className="grid gap-4 md:gap-6 mb-8 md:mb-12">
            {refundCases.map((caseItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 md:p-6 rounded-2xl border ${
                  caseItem.color === 'success' 
                    ? 'bg-success/5 border-success/20' 
                    : caseItem.color === 'warning'
                    ? 'bg-warning/5 border-warning/20'
                    : 'bg-destructive/5 border-destructive/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <caseItem.icon className={`w-6 h-6 ${
                    caseItem.color === 'success' 
                      ? 'text-success' 
                      : caseItem.color === 'warning'
                      ? 'text-warning'
                      : 'text-destructive'
                  }`} />
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    {caseItem.title}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {caseItem.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* How to Request */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-6">
              How to Request a Refund
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="p-4 md:p-5 rounded-2xl bg-card border border-border text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-bold">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 md:p-6 rounded-2xl bg-muted/50 border border-border"
          >
            <h3 className="font-semibold text-foreground mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Refund requests must be made within 24 hours of delivery</li>
              <li>• Photo evidence may be required for quality-related issues</li>
              <li>• Loyalty points used on orders will be refunded to your account</li>
              <li>• Promotional discounts are non-refundable</li>
              <li>• Delivery fees are refundable only for order cancellations</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Need help with a refund? Contact our support team.
            </p>
            <Button onClick={() => navigate('/contact')} className="rounded-full">
              Contact Support
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RefundPolicy;
