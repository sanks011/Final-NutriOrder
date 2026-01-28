import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Leaf, Users, Award, Target } from 'lucide-react';
import Layout from '@/components/common/Layout';

const features = [
  {
    icon: Heart,
    title: 'Health First',
    description:
      'Every meal is curated with your health in mind, ensuring balanced nutrition that supports your wellness goals.',
  },
  {
    icon: Shield,
    title: 'Safe Choices',
    description:
      'Our smart filtering system protects you by highlighting foods safe for your specific medical conditions.',
  },
  {
    icon: Leaf,
    title: 'Fresh & Natural',
    description:
      'We partner with restaurants committed to using fresh, natural ingredients in every dish.',
  },
  {
    icon: Users,
    title: 'Personalized Experience',
    description:
      'Your unique dietary preferences and health profile shape every recommendation we make.',
  },
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '200+', label: 'Partner Restaurants' },
  { value: '10K+', label: 'Healthy Dishes' },
  { value: '95%', label: 'Satisfaction Rate' },
];

const About: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="badge-hero mb-6">
                <Award className="w-4 h-4 mr-1.5" />
                Our Story
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                Revolutionizing How You{' '}
                <span className="text-gradient-gold">Eat Healthy</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                FitEats was born from a simple idea: everyone deserves access to
                delicious food that respects their health needs. We combine
                cutting-edge nutrition science with the joy of great food
                delivery.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl lg:text-5xl font-display font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="badge-hero mb-6">
                  <Target className="w-4 h-4 mr-1.5" />
                  Our Mission
                </span>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-6">
                  Making Healthy Eating{' '}
                  <span className="text-gradient-gold">Effortless</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We believe that managing your health through food shouldn't be
                  complicated. Whether you're managing diabetes, following a
                  specific diet, or simply trying to eat better, FitEats makes
                  it simple.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform combines advanced nutritional analysis with
                  personalized recommendations, ensuring every meal you order
                  supports your unique health journey.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600"
                    alt="Healthy food preparation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-card border border-border shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Heart className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">100%</p>
                      <p className="text-sm text-muted-foreground">
                        Health Focused
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                Why Choose FitEats?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're not just a food delivery app – we're your partner in
                health
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-5">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
