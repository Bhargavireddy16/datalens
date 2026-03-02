import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DataLens | AI-Powered Data Explorer',
  description: 'Upload your datasets and let AI generate rich, interactive visualizations and actionable insights instantly.',
};

import { DataProvider } from '@/lib/DataContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/20`}>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
