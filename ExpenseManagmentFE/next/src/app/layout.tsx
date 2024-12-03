import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Expense Management App',
  description: 'An app to manage your expenses efficiently.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className='bg-gray-50 text-gray-800'>
        <main className='min-h-screen flex items-center justify-center'>
          {children}
        </main>
      </body>
    </html>
  );
}
