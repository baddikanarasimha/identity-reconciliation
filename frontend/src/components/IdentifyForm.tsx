'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { identifyContact } from '@/lib/api';
import { IdentifyRequest, IdentifyResponse } from '@/types';

interface IdentifyFormProps {
  onResult: (result: IdentifyResponse) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
}

export default function IdentifyForm({ onResult, onLoading, isLoading }: IdentifyFormProps) {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ email?: string; phone?: string; general?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim() && !phoneNumber.trim()) {
      newErrors.general = 'Please provide at least one of email or phone number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (phoneNumber.trim() && !/^\+?[\d\s\-().]{7,15}$/.test(phoneNumber.trim())) {
      newErrors.phone = 'Please enter a valid phone number (7-15 digits).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onLoading(true);
    setErrors({});

    const payload: IdentifyRequest = {
      email: email.trim() || null,
      phoneNumber: phoneNumber.trim() || null,
    };

    try {
      const result = await identifyContact(payload);
      onResult(result);
      toast.success('Identity reconciled successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
      setErrors({ general: message });
    } finally {
      onLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setPhoneNumber('');
    setErrors({});
  };

  const loadSampleData = (sample: 'new' | 'existing' | 'merge') => {
    const samples = {
      new: { email: 'newuser@example.com', phone: '+1234567890' },
      existing: { email: 'lorraine@hillvalley.edu', phone: '' },
      merge: { email: 'george@hillvalley.edu', phone: '717171' },
    };
    setEmail(samples[sample].email);
    setPhoneNumber(samples[sample].phone);
    setErrors({});
  };

  return (
    <div className="glass-card p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Identify Contact</h2>
            <p className="text-xs text-white/50">Enter email and/or phone number</p>
          </div>
        </div>
      </div>

      {/* Sample Data Buttons */}
      <div className="mb-5">
        <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-medium">Quick samples</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '🆕 New User', key: 'new' as const },
            { label: '🔍 Existing', key: 'existing' as const },
            { label: '🔗 Merge Test', key: 'merge' as const },
          ].map(({ label, key }) => (
            <button
              key={key}
              type="button"
              onClick={() => loadSampleData(key)}
              className="px-3 py-1.5 text-xs text-white/60 hover:text-white border border-white/10 
                         hover:border-white/30 rounded-lg transition-all duration-150 hover:bg-white/5"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
              placeholder="user@example.com"
              className={`input-field pl-10 ${errors.email ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); setErrors({}); }}
              placeholder="+1 234 567 8901"
              className={`input-field pl-10 ${errors.phone ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              disabled={isLoading}
            />
          </div>
          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phone}
            </p>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {errors.general}
          </div>
        )}

        {/* OR Divider */}
        <p className="text-center text-xs text-white/30 py-1">
          Provide email, phone, or both
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="flex-1 py-3.5 px-4 border border-white/20 text-white/60 hover:text-white 
                       hover:border-white/40 font-medium rounded-xl transition-all duration-200 
                       disabled:opacity-40 hover:bg-white/5"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading || (!email.trim() && !phoneNumber.trim())}
            className="btn-primary flex-[2] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Identifying...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Identify
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
