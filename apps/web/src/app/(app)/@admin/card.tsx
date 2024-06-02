"use client";

import type { Analytics } from "@/server/api/routers/analytics/analytics.schema";
import { AreaChart } from "@/components/area-chart";
import { api } from "@/trpc/react";
import { Chip, Divider, Tooltip } from "@nextui-org/react";
import moment from "moment";

import { Card, CardContent, CardHeader, CardTitle } from "@tanya.in/ui/card";

export function StatisticsCard(props: { initialData: Analytics[] }) {
  const { data } = api.analytics.get.useQuery(undefined, {
    initialData: props.initialData,
  });
  const mappedData = data.map((item) => ({
    date: item.key,
    "Page Views": item.total,
    Visitors: item.devices,
  }));

  const { visitors, pageViews } = data.reduce(
    (acc, { devices, total }) => {
      acc.visitors += devices;
      acc.pageViews += total;
      return acc;
    },
    {
      visitors: 0,
      pageViews: 0,
    },
  );
  const { visitorsLastWeek, pageViewsLastWeek } = data.reduce(
    (acc, { devices, total, key }) => {
      if (moment(key).isSameOrBefore(moment().subtract(1, "week"))) {
        acc.visitorsLastWeek += devices;
        acc.pageViewsLastWeek += total;
      }
      return acc;
    },
    {
      visitorsLastWeek: 0,
      pageViewsLastWeek: 0,
    },
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <AreaChart
        data={mappedData}
        index="date"
        categories={["Page Views", "Visitors"]}
        colors={["blue", "yellow"]}
        showLegend={false}
        showYAxis={false}
        startEndOnly={true}
        className="h-[calc(100vh-28rem)]"
      />
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-8 bg-primary-its" />
            <p>{pageViews}</p>
            <Tooltip
              content={`${Math.abs(pageViews - pageViewsLastWeek)} ${pageViews > pageViewsLastWeek ? "more" : "less"} page views than last week`}
              color="foreground"
            >
              <Chip color="success" radius="sm" variant="flat">
                {pageViews > pageViewsLastWeek
                  ? "↑ " + Math.abs(pageViews - pageViewsLastWeek)
                  : "↓ " + Math.abs(pageViews - pageViewsLastWeek)}
              </Chip>
            </Tooltip>
          </div>
          <p>Page Views</p>
        </div>
        <Divider />
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-8 bg-accent-its" />
            <p>{visitors}</p>
            <Tooltip
              content={`${Math.abs(visitors - visitorsLastWeek)} ${visitors > visitorsLastWeek ? "more" : "less"} visitors than last week`}
              color="foreground"
            >
              <Chip color="success" radius="sm" variant="flat">
                {visitors > visitorsLastWeek
                  ? "↑ " + Math.abs(visitors - visitorsLastWeek)
                  : "↓ " + Math.abs(visitors - visitorsLastWeek)}
              </Chip>
            </Tooltip>
          </div>
          <p>Visitors</p>
        </div>
      </CardContent>
    </Card>
  );
}
