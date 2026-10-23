import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading Sree Sarees...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-boutique-goldLight border-t-boutique-maroon animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && (
        <p className="text-sm font-medium text-boutique-maroon tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
