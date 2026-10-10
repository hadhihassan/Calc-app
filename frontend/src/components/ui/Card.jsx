import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
