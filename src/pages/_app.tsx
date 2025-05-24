import '@/app/globals.css';
import type { AppProps } from 'next/app';
import SessionProvider from '@/providers/SessionProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
} 