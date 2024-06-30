"use client";

import type { Analytics } from "@/server/api/routers/analytics/analytics.schema";
import { AreaChart } from "@/components/area-chart";
import { api } from "@/trpc/react";
import { Chip, Divider, Tooltip } from "@nextui-org/react";
import moment from "moment";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@tanya.in/ui/card";

export function StatisticsCard(props: { initialData: Analytics[] }) {
  const t = useTranslations("Admin.statistics");

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
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-8 bg-primary-its" />
            <p>{pageViews}</p>
            <Tooltip
              content={t("morePageViews", {
                number: Math.abs(pageViews - pageViewsLastWeek),
                data: pageViews > pageViewsLastWeek ? "more" : "less",
              })}
            >
              <Chip color="success" radius="sm" variant="flat">
                {pageViews > pageViewsLastWeek
                  ? "↑ " + Math.abs(pageViews - pageViewsLastWeek)
                  : "↓ " + Math.abs(pageViews - pageViewsLastWeek)}
              </Chip>
            </Tooltip>
          </div>
          <p>{t("pageViews")}</p>
        </div>
        <Divider />
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-8 bg-accent-its" />
            <p>{visitors}</p>
            <Tooltip
              content={t("moreVisitors", {
                number: Math.abs(visitors - visitorsLastWeek),
                data: visitors > visitorsLastWeek ? "more" : "less",
              })}
            >
              <Chip color="success" radius="sm" variant="flat">
                {visitors > visitorsLastWeek
                  ? "↑ " + Math.abs(visitors - visitorsLastWeek)
                  : "↓ " + Math.abs(visitors - visitorsLastWeek)}
              </Chip>
            </Tooltip>
          </div>
          <p>{t("visitors")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
