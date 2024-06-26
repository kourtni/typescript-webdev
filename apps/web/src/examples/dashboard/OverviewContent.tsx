import { Box, Skeleton, Text } from "@yas/ui";
import {
  RocketIcon,
  PersonIcon,
  CardStackIcon,
  BarChartIcon,
} from "@yas/icons";
import type { types } from "@yas/trpc-client";
import { api } from "@yas/trpc-client";
import { Card, formatNumber, formatCurrency } from "../shared";
import { RecentSaleList } from "./RecentSaleList";
import { StatsCard } from "./Stats";
import { gridAreas, gridContainer } from "./OverviewContent.css";
import { Chart } from "./Chart";

export function DashboardContent({
  filter,
}: {
  filter: types.example.DashboardFilter;
}) {
  const [data] = api.dashboard.dashboard.useSuspenseQuery(filter);
  return (
    <div className={gridContainer}>
      <StatsCard
        title="Total Revenue"
        amount={formatCurrency(data.totalRevenue)}
        description={`${formatNumber(data.revenueDeltaSinceLastMonth, [
          "sign",
          "currency",
        ])}% from last month`}
        icon={<RocketIcon />}
        className={gridAreas.totalRevenue}
      />
      <StatsCard
        title="Subscriptions"
        amount={formatNumber(data.subscriptions, ["sign"])}
        description={`${formatNumber(data.subscriptionDeltaSinceLastMonth, [
          "sign",
        ])}% from last month`}
        icon={<PersonIcon />}
        className={gridAreas.subscriptions}
      />
      <StatsCard
        title="Sales"
        amount={formatNumber(data.sales, ["sign"])}
        description={`${formatNumber(data.salesDeltaSinceLastMonth, [
          "sign",
        ])}% from last month`}
        icon={<CardStackIcon />}
        className={gridAreas.sales}
      />
      <StatsCard
        title="Active Now"
        amount={formatNumber(data.activeNow, ["sign"])}
        description={`${formatNumber(data.activeSinceLastHour, [
          "sign",
        ])} since last hour`}
        icon={<BarChartIcon />}
        className={gridAreas.activeNow}
      />
      <Card sx={{ gap: "m" }} className={gridAreas.chart}>
        <div>
          <Text intent="h5">Overview</Text>
          <Text>&nbsp;</Text>
        </div>
        <Chart data={data.revenueOverTime} />
      </Card>
      <Card sx={{ gap: "m", px: 0 }} className={gridAreas.recentSales}>
        <Box sx={{ px: "xl", mb: "l" }}>
          <Text intent="h5" sx={{ mb: "m" }}>
            Recent Sales
          </Text>
          <Text>{data.yourSalesThisMonth.toFixed(0)} sales this month.</Text>
        </Box>
        <RecentSaleList data={data.recentSales} />
      </Card>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className={gridContainer}>
      {Object.values(gridAreas).map((className, index) => (
        <Skeleton key={index} className={className} />
      ))}
    </div>
  );
}
