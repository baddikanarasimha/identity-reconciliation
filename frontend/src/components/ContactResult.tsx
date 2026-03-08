'use client';

import { IdentifyResponse } from '@/types';

interface ContactResultProps {
  result: IdentifyResponse;
}

export default function ContactResult({ result }: ContactResultProps) {
  const { contact } = result;

  return (
    <div className="glass-card p-6 md:p-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Reconciled Identity</h2>
            <p className="text-xs text-white/50">Consolidated contact profile</p>
          </div>
        </div>
        <span className="tag-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5 inline-block animate-pulse-slow" />
          Active
        </span>
      </div>

      {/* Primary Contact ID */}
      <div className="mb-5 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <p className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium mb-1">
          Primary Contact ID
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gradient font-mono">
            #{contact.primaryContatctId}
          </span>
          <span className="text-xs text-white/40">master record</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Emails"
          value={contact.emails.length}
          color="indigo"
        />
        <StatCard
          label="Phones"
          value={contact.phoneNumbers.length}
          color="purple"
        />
        <StatCard
          label="Linked"
          value={contact.secondaryContactIds.length}
          color="pink"
        />
      </div>

      {/* Email List */}
      <DataSection
        title="Email Addresses"
        icon={
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
        items={contact.emails}
        emptyText="No emails linked"
        renderItem={(email, i) => (
          <div key={email} className="data-row">
            {i === 0 ? (
              <span className="tag-primary text-[10px] px-2 py-0.5">primary</span>
            ) : (
              <span className="tag-secondary text-[10px] px-2 py-0.5">alt</span>
            )}
            <span className="font-mono text-sm text-white/80">{email}</span>
          </div>
        )}
      />

      {/* Phone List */}
      <DataSection
        title="Phone Numbers"
        icon={
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        }
        items={contact.phoneNumbers}
        emptyText="No phone numbers linked"
        renderItem={(phone, i) => (
          <div key={phone} className="data-row">
            {i === 0 ? (
              <span className="tag-primary text-[10px] px-2 py-0.5">primary</span>
            ) : (
              <span className="tag-secondary text-[10px] px-2 py-0.5">alt</span>
            )}
            <span className="font-mono text-sm text-white/80">{phone}</span>
          </div>
        )}
      />

      {/* Secondary Contact IDs */}
      {contact.secondaryContactIds.length > 0 && (
        <DataSection
          title="Secondary Contact IDs"
          icon={
            <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
          items={contact.secondaryContactIds.map(String)}
          emptyText="No secondary contacts"
          renderItem={(id) => (
            <span
              key={id}
              className="inline-flex items-center px-3 py-1 rounded-lg bg-pink-500/10 
                         border border-pink-500/20 text-pink-300 font-mono text-sm"
            >
              #{id}
            </span>
          )}
          wrap
        />
      )}

      {/* Raw JSON Toggle */}
      <RawJsonSection data={result} />
    </div>
  );
}

// ─── Sub Components ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'indigo' | 'purple' | 'pink';
}) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-300',
  };

  return (
    <div className={`p-3 rounded-xl border text-center ${colorMap[color]}`}>
      <div className="text-2xl font-bold font-mono">{value}</div>
      <div className="text-xs opacity-70 mt-0.5">{label}</div>
    </div>
  );
}

function DataSection({
  title,
  icon,
  items,
  emptyText,
  renderItem,
  wrap,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  emptyText: string;
  renderItem: (item: string, index: number) => React.ReactNode;
  wrap?: boolean;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        {icon}
        <span className="text-sm font-medium text-white/70">{title}</span>
        <span className="ml-auto text-xs text-white/30">{items.length} record{items.length !== 1 ? 's' : ''}</span>
      </div>
      <div
        className={`p-3 rounded-xl bg-white/3 border border-white/5 ${
          wrap ? 'flex flex-wrap gap-2' : 'space-y-1'
        }`}
      >
        {items.length === 0 ? (
          <p className="text-sm text-white/30 italic">{emptyText}</p>
        ) : (
          items.map((item, i) => renderItem(item, i))
        )}
      </div>
    </div>
  );
}

function RawJsonSection({ data }: { data: IdentifyResponse }) {
  const [open, setOpen] = useState(false);

  // Need useState imported
  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        View raw JSON response
      </button>
      {open && (
        <pre className="mt-3 p-4 rounded-xl bg-black/30 border border-white/10 text-xs text-green-300 font-mono overflow-auto max-h-48 leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

// useState needs to be imported in RawJsonSection
import { useState } from 'react';
