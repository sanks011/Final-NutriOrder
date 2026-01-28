import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="relative mb-8"
        >
          <span className="text-[150px] font-display font-bold text-gradient-gold leading-none">
            404
          </span>
          <div className="absolute inset-0 blur-3xl bg-primary/20 -z-10" />
        </motion.div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-muted-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Path Info */}
        <div className="p-4 rounded-xl bg-secondary/50 border border-border mb-8">
          <p className="text-sm text-muted-foreground">
            Attempted path: <code className="text-primary">{location.pathname}</code>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} className="gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Browse Foods', path: '/foods' },
              { label: 'Restaurants', path: '/restaurants' },
              { label: 'My Orders', path: '/orders' },
              { label: 'Contact Us', path: '/contact' },
            ].map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(link.path)}
                className="text-muted-foreground hover:text-primary"
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
