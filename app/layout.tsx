import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ThemeProvider from '@/components/theme/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PM2 Dashboard',
  description: 'A beautiful, responsive web dashboard for managing PM2 processes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load stylesheet without the custom precedence attribute */}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
