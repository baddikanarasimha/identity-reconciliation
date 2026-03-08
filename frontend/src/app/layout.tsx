import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Identity Reconciliation System',
  description:
    'Identify and merge customer identities based on shared email or phone number.',
  keywords: ['identity', 'reconciliation', 'customer', 'contact', 'deduplication'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(30, 27, 75, 0.95)',
              color: '#e0e7ff',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#e0e7ff' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#fee2e2' },
            },
          }}
        />
      </body>
    </html>
  );
}
