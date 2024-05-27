import { StatisticsContainer } from "@/components/statistics-container";
import { api } from "@/trpc/server";

export default async function HomePage() {
  const data = await api.analytics.get();

  return (
    <div className="flex flex-1 flex-wrap gap-4">
      <StatisticsContainer initialData={data} />
    </div>
  );
}
