import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          className={`w-full bg-slate-950 border text-slate-100 text-sm rounded-lg py-2 transition-colors placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${
            error 
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500' 
              : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
