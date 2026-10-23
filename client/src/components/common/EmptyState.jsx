import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No Sarees Found',
  description = 'Try adjusting your search criteria, or browse our latest handloom collection.',
  actionText = 'Explore All Sarees',
  actionLink = '/shop',
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-boutique-ivory/60 rounded-2xl border border-boutique-gold/20 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-boutique-goldLight/30 flex items-center justify-center text-boutique-maroon mb-4">
        <Icon className="w-8 h-8 text-boutique-goldDark" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-boutique-maroon mb-2">
        {title}
      </h3>
      <p className="text-boutique-muted text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onAction ? (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-full bg-boutique-maroon text-boutique-ivory hover:bg-boutique-maroonDark transition-all duration-200 text-sm font-medium shadow-boutique"
        >
          {actionText}
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="px-6 py-2.5 rounded-full bg-boutique-maroon text-boutique-ivory hover:bg-boutique-maroonDark transition-all duration-200 text-sm font-medium shadow-boutique"
        >
          {actionText}
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
