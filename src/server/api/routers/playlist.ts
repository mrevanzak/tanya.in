import { clerkClient } from '@clerk/nextjs';
import type { Paging, SimplifiedPlaylist } from 'spotify-types';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { httpClient } from '@/utils/api';

export const playlistRouter = createTRPCRouter({
  getPlaylistByUser: publicProcedure.query(async ({ ctx }) => {
    if (ctx.auth.userId === null) throw new Error('Not logged in');
    const spotifyToken = await clerkClient.users
      .getUserOauthAccessToken(ctx.auth.userId, 'oauth_spotify')
      .then((res) => {
        return res.at(0)?.token;
      });

    const playlist = await httpClient
      .get<Paging<SimplifiedPlaylist>>('/me/playlists', {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      })
      .then((res) => {
        return res.data.items;
      });

    return { playlist };
  }),
  getPlaylistById: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const playlist_id = input.url.split('playlist/')[1];
      if (ctx.auth.userId === null) throw new Error('Not logged in');

      // await redis.set('url', input.url, { ex: 60 * 60 * 24 });
      // const playlist = await httpClient.get(`/me/playlist/${playlist_id}`);
      // console.log(playlist);
      return { playlist_id };
    }),
});
