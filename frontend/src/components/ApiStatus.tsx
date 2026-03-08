'use client';

import { useState, useEffect } from 'react';
import { checkHealth } from '@/lib/api';

export default function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const check = async () => {
      const isAlive = await checkHealth();
      setStatus(isAlive ? 'online' : 'offline');
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const config = {
    checking: { color: 'text-yellow-400', bg: 'bg-yellow-400', label: 'Checking...' },
    online: { color: 'text-green-400', bg: 'bg-green-400', label: 'API Online' },
    offline: { color: 'text-red-400', bg: 'bg-red-400', label: 'API Offline' },
  }[status];

  return (
    <div className={`flex items-center gap-1.5 text-xs ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.bg} ${status === 'online' ? 'animate-pulse' : ''}`} />
      {config.label}
    </div>
  );
}
