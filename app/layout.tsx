import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy — Discover',
  description: 'Find out if your crush likes you back. If they don\'t, nobody ever knows.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFFFFF',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f2eff7] text-[#15121d] min-h-screen flex flex-col items-center justify-start antialiased selection:bg-[#ff3d81] selection:text-white">
        {children}
      </body>
    </html>
  );
}
