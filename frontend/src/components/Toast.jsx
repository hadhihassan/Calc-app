import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs shadow-lg max-w-sm">
      {isSuccess && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
      {isError && <AlertCircle size={16} className="text-rose-400 shrink-0" />}
      {!isSuccess && !isError && <Info size={16} className="text-indigo-400 shrink-0" />}
      
      <span className="flex-1">{toast.message}</span>

      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
};
