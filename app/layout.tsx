import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy Discover - Mutual Crush Discovery',
  description: 'Double-blind crush discovery for college students. Swipe right to like, left to pass. Mutual reveals only.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0c0d12] text-zinc-100 min-h-screen flex flex-col items-center justify-start antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
