import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg border border-brand-100 w-full max-w-md mx-auto">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-brand-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-warm-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
            💖
        </div>
      </div>
      <h3 className="text-xl font-serif font-medium text-brand-900 mb-2">Weaving Memories</h3>
      <p className="text-brand-600 text-center text-sm">
        Our AI is gently connecting your past and present.<br/>This might take a moment.
      </p>
    </div>
  );
};
