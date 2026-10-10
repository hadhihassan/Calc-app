import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { registerSchema, loginSchema } from '../validators/schemas';

export const AuthCard = ({ onAuthSuccess, onShowToast }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handleTabChange = (loginMode) => {
    setIsLogin(loginMode);
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    // Strong client-side validation using Zod
    const schema = isLogin ? loginSchema : registerSchema;
    const validation = schema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};
      (validation.error.issues || []).forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const bodyData = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      onShowToast(isLogin ? 'Logged in successfully' : 'Account created successfully', 'success');
      onAuthSuccess(data.user);
    } catch (err) {
      setServerError(err.message || 'An error occurred during authentication.');
      onShowToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        {/* Auth Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              isLogin 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => handleTabChange(true)}
            id="tab-login"
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              !isLogin 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => handleTabChange(false)}
            id="tab-register"
          >
            Sign Up
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs" role="alert">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              id="auth-name"
              name="name"
              type="text"
              label="Full Name"
              placeholder="e.g. Alex Smith"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />
          )}

          <Input
            id="auth-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="block text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                id="auth-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-slate-950 border text-slate-100 text-sm rounded-lg py-2 pl-9 pr-10 transition-colors focus:outline-none focus:ring-1 ${
                  errors.password
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            loading={loading}
            id="auth-submit-button"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
