import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 md:py-12 text-center px-4">
      <div className="inline-flex items-center justify-center space-x-2 mb-4">
        <span className="text-3xl">🕰️</span>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-900 font-serif tracking-tight">
          Aevora
        </h1>
        <span className="text-3xl">🫂</span>
      </div>
      <p className="text-brand-600 max-w-xl mx-auto text-lg md:text-xl font-light">
        A journey through time. Upload a childhood photo and a recent one to create a timeless embrace.
      </p>
    </header>
  );
};