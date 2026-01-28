import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';

const Terms: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using NutriOrder's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of any modifications.`,
    },
    {
      title: '2. Description of Service',
      content: `NutriOrder provides an online food ordering and delivery platform that connects users with restaurants offering healthy, nutritionally-balanced meals. Our service includes personalized nutrition tracking, health profile management, and meal recommendations based on dietary preferences and health conditions.`,
    },
    {
      title: '3. User Accounts',
      content: `To use certain features of our service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.`,
    },
    {
      title: '4. Ordering and Payment',
      content: `When you place an order through NutriOrder, you agree to pay the full amount for your order, including food costs, delivery fees, taxes, and any applicable tips. Prices are subject to change without notice. We accept various payment methods as displayed at checkout. All payments are processed securely through our payment partners.`,
    },
    {
      title: '5. Delivery',
      content: `We strive to deliver your orders within the estimated delivery time. However, delivery times are estimates and may vary based on factors beyond our control, including weather conditions, traffic, and restaurant preparation time. You are responsible for providing accurate delivery information.`,
    },
    {
      title: '6. Health Information Disclaimer',
      content: `The nutritional information and health recommendations provided by NutriOrder are for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare provider before making dietary changes, especially if you have medical conditions such as diabetes, allergies, or other health concerns.`,
    },
    {
      title: '7. Cancellations and Refunds',
      content: `Orders can be cancelled within 5 minutes of placement for a full refund. After this period, cancellation may not be possible if the restaurant has started preparing your order. Refunds for quality issues will be reviewed on a case-by-case basis. Contact our support team for any refund requests.`,
    },
    {
      title: '8. User Conduct',
      content: `You agree not to use our service for any unlawful purpose or in any way that could damage, disable, or impair the service. Prohibited activities include attempting to gain unauthorized access, submitting false information, harassing other users or delivery personnel, and engaging in fraudulent activities.`,
    },
    {
      title: '9. Intellectual Property',
      content: `All content on NutriOrder, including text, graphics, logos, and software, is the property of NutriOrder or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
    },
    {
      title: '10. Limitation of Liability',
      content: `NutriOrder shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our service. Our total liability for any claim shall not exceed the amount you paid for the order giving rise to the claim.`,
    },
    {
      title: '11. Contact Information',
      content: `If you have any questions about these Terms of Service, please contact us at legal@nutriorder.com or through our Contact page.`,
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
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Terms of Service
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: January 2024
              </p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
              Welcome to NutriOrder. Please read these Terms of Service carefully before using our platform. 
              These terms govern your use of our website, mobile application, and services.
            </p>

            <div className="space-y-6 md:space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 md:p-6 rounded-2xl bg-card border border-border"
                >
                  <h2 className="text-lg md:text-xl font-display font-semibold text-foreground mb-3">
                    {section.title}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Terms;
