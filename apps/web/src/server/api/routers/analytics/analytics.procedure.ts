import { env } from "@/env";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import moment from "moment";

import { analyticsSchema } from "./analytics.schema";

export const analyticsRouter = createTRPCRouter({
  get: adminProcedure.query(async () => {
    const to = moment().toISOString();
    const from = moment().subtract(1, "month").toISOString();
    const teamId = "team_BdZXSB6dG1pgCBmmvGHKAS5h";
    const projectId = "prj_LxEPP05QztlA9EbpXySkB9oRhTaW";
    const filter = '{"path":{"values":["/"],"operator":"eq"}}';
    const tz = "Asia/Jakarta";
    const url: string =
      `https://vercel.com/api/web-analytics/timeseries` +
      `?teamId=${teamId}` +
      `&projectId=${projectId}` +
      `&environment=production` +
      `&filter=${encodeURI(filter)}` +
      `&from=${from}` +
      `&to=${to}` +
      `&tz=${tz.replace(/\//g, "%2F")}`;

    const response: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.VERCEL_TOKEN}`,
      },
    });

    if (response.status === 500) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unkown Vercel server error occurred",
      });
    }

    const data = analyticsSchema
      .array()
      .parse(
        await response.json().then((data: { data: unknown }) => data.data),
      );
    return data;
  }),
});
