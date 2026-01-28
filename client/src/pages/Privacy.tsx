import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly, including: account information (name, email, phone), delivery addresses, payment information, health profile data (dietary preferences, allergies, medical conditions), and order history. We also collect device information, usage data, and location data when you use our services.`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use your information to: process and deliver orders, personalize nutrition recommendations, improve our services, communicate with you about orders and promotions, ensure food safety based on your health profile, and comply with legal obligations. Your health data is used solely to provide personalized meal recommendations and safety alerts.`,
    },
    {
      title: '3. Health Data Protection',
      content: `We take special care to protect your health-related information. Your medical conditions, allergies, and dietary restrictions are encrypted and stored securely. This data is only used to filter unsafe foods and provide personalized recommendations. We never share your health data with third parties for marketing purposes.`,
    },
    {
      title: '4. Information Sharing',
      content: `We share your information with: restaurants to fulfill orders (delivery address and order details only), delivery partners for order delivery, payment processors for transactions, and service providers who assist our operations. We do not sell your personal information to third parties.`,
    },
    {
      title: '5. Data Security',
      content: `We implement industry-standard security measures including encryption, secure servers, and access controls to protect your information. However, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and protect your account credentials.`,
    },
    {
      title: '6. Your Rights and Choices',
      content: `You have the right to: access, update, or delete your personal information, opt-out of marketing communications, disable location tracking, export your data, and request account deletion. You can manage these preferences in your account settings or by contacting our support team.`,
    },
    {
      title: '7. Cookies and Tracking',
      content: `We use cookies and similar technologies to improve your experience, remember your preferences, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings. Some features may not function properly if cookies are disabled.`,
    },
    {
      title: '8. Data Retention',
      content: `We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information as required by law or for legitimate business purposes. Order history is kept for a minimum of 7 years for tax and legal compliance.`,
    },
    {
      title: '9. Children\'s Privacy',
      content: `Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.`,
    },
    {
      title: '10. International Users',
      content: `If you are accessing our services from outside the country, please be aware that your information may be transferred to, stored, and processed in our facilities. By using our services, you consent to this transfer of information.`,
    },
    {
      title: '11. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: '12. Contact Us',
      content: `If you have questions about this Privacy Policy or your personal information, please contact our Privacy Team at privacy@nutriorder.com or through our Contact page.`,
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
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: January 2024
              </p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
              At NutriOrder, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our services.
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

export default Privacy;
