import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import { AppSidebar } from '@/components/SideBar';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { cn } from '../lib/utils';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Money Track',
  description: 'An app to manage your expenses efficiently.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              <ModeToggle />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
