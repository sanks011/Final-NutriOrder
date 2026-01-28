import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Utensils } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <span className="text-lg md:text-xl font-display font-bold">NUTRIORDER</span>
            </Link>
            <p className="text-background/70 text-xs md:text-sm leading-relaxed">
              Fresh, healthy meals delivered to your door. Experience personalized nutrition.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              {[
                { label: 'Menu', path: '/foods' },
                { label: 'Restaurants', path: '/restaurants' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-background/70 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              {[
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Refund Policy', path: '/refund-policy' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-background/70 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-display font-semibold mb-3 md:mb-4 text-sm md:text-base">Contact</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary flex-shrink-0" />
                <span className="truncate">support@nutriorder.com</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary flex-shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2 text-background/70">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>123 Health Street, Wellness City</span>
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-background transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-background/20 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 text-xs md:text-sm text-background/60">
          <p>© {new Date().getFullYear()} NutriOrder. All rights reserved.</p>
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/refund-policy" className="hover:text-primary transition-colors">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
