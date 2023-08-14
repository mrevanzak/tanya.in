/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { MutationCache, QueryCache } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import {
  type inferRouterInputs,
  type inferRouterOutputs,
  TRPCError,
} from '@trpc/server';
import superjson from 'superjson';

import { toast } from '@/lib/hooks/useToast';

import { AppRouter } from '@/server/api/root';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],

      queryClientConfig: {
        queryCache: new QueryCache({
          onError: (err) => {
            if (err instanceof TRPCError)
              toast({
                title: err.name,
                description: err.message,
              });
          },
        }),
        mutationCache: new MutationCache({
          onError: (err) => {
            if (err instanceof TRPCError)
              toast({
                title: err.name,
                description: err.message,
              });
          },
        }),
      },
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * HTTP client for Spotify API
 * @see https://developer.spotify.com/documentation/web-api/
 */
import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});
