import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Percent, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const promos = [
  {
    id: 1,
    title: '20% OFF',
    subtitle: 'First Order',
    description: 'Use code HEALTHY20',
    icon: Percent,
    bgColor: 'bg-primary',
    textColor: 'text-primary-foreground',
  },
  {
    id: 2,
    title: 'FREE',
    subtitle: 'Delivery',
    description: 'On orders above ₹499',
    icon: Truck,
    bgColor: 'bg-foreground',
    textColor: 'text-background',
  },
  {
    id: 3,
    title: 'LUNCH',
    subtitle: 'Special',
    description: '11AM - 3PM only',
    icon: Clock,
    bgColor: 'bg-secondary',
    textColor: 'text-foreground',
  },
];

const PromoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${promo.bgColor} ${promo.textColor} rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform`}
                onClick={() => navigate('/foods')}
              >
                <div className={`w-14 h-14 rounded-full ${promo.bgColor === 'bg-secondary' ? 'bg-primary/10' : 'bg-background/20'} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${promo.bgColor === 'bg-secondary' ? 'text-primary' : ''}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-display font-bold">{promo.title}</span>
                    <span className="text-sm font-medium opacity-80">{promo.subtitle}</span>
                  </div>
                  <p className={`text-sm ${promo.bgColor === 'bg-secondary' ? 'text-muted-foreground' : 'opacity-80'}`}>
                    {promo.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 opacity-60" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
