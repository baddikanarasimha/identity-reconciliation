'use client';

import { useState } from 'react';
import IdentifyForm from '@/components/IdentifyForm';
import ContactResult from '@/components/ContactResult';
import ApiStatus from '@/components/ApiStatus';
import HowItWorks from '@/components/HowItWorks';
import { IdentifyResponse } from '@/types';

export default function Home() {
  const [result, setResult] = useState<IdentifyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<IdentifyResponse[]>([]);

  const handleResult = (res: IdentifyResponse) => {
    setResult(res);
    setHistory((prev) => [res, ...prev.slice(0, 4)]);
  };

  return (
    <main className="min-h-screen py-10 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Bitespeed · Identity Reconciliation
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Identity{' '}
            <span className="text-gradient">Reconciliation</span>{' '}
            System
          </h1>

          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Identify and merge customer identities based on shared email or phone number.
            Maintains a single source of truth across all contact records.
          </p>

          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Node.js + Express
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              PostgreSQL + Prisma
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              TypeScript
            </span>
          </div>
        </div>

        {/* API Status Bar */}
        <div className="flex items-center justify-end mb-4">
          <ApiStatus />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-5">
            <IdentifyForm
              onResult={handleResult}
              onLoading={setIsLoading}
              isLoading={isLoading}
            />
            <HowItWorks />

            {/* History */}
            {history.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Recent Lookups
                </h3>
                <div className="space-y-2">
                  {history.slice(0, 5).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setResult(item)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg 
                                 hover:bg-white/5 transition-colors text-left group"
                    >
                      <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors font-mono">
                        Primary #{item.contact.primaryContatctId}
                      </span>
                      <span className="text-[10px] text-white/30">
                        {item.contact.emails[0] || item.contact.phoneNumbers[0] || '—'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-3">
            {result ? (
              <ContactResult result={result} />
            ) : (
              <EmptyState isLoading={isLoading} />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-white/20">
          <p>Identity Reconciliation System · Built with Next.js, Node.js, PostgreSQL</p>
          <p className="mt-1">POST /api/identify · Render-ready · TypeScript throughout</p>
        </footer>
      </div>
    </main>
  );
}

function EmptyState({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
      {isLoading ? (
        <>
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-4 rounded-full bg-indigo-500/10" />
          </div>
          <p className="text-white/60 font-medium">Reconciling identity...</p>
          <p className="text-white/30 text-sm mt-1">Searching contact database</p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-white/50 font-medium mb-1">No results yet</p>
          <p className="text-white/30 text-sm leading-relaxed max-w-xs">
            Submit a contact lookup using the form on the left to see the reconciled identity profile.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
            {['Identify', 'Merge', 'Deduplicate'].map((tag) => (
              <div
                key={tag}
                className="py-1.5 rounded-lg bg-white/3 border border-white/5 text-xs text-white/25 text-center"
              >
                {tag}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
