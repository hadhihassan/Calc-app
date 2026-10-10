import React from 'react';
import { Calculator, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/Button';

export const Navbar = ({ user, onLogout }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Calculator size={18} />
          </div>
          <span className="font-semibold text-slate-100 tracking-tight text-base">
            Calc
          </span>
        </div>

        {/* User Status & Logout */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-full py-1 px-3">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={12} />}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {user.name || user.email}
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              id="logout-button"
              className="text-xs"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
