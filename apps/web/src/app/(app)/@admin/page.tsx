import { api } from "@/trpc/server";

import { StatisticsCard } from "./card";

export default async function HomePage() {
  const data = await api.analytics.get();

  return (
    <div className="flex flex-1 flex-wrap gap-4">
      <StatisticsCard initialData={data} />
    </div>
  );
}
