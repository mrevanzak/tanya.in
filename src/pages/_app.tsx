import { ClerkProvider } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';
import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { Toaster } from '@/components/ui/Toaster';

import { api } from '@/utils/api';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: neobrutalism,
      }}
    >
      <Component {...pageProps} />
      <Toaster />
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
