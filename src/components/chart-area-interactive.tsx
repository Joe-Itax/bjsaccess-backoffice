// "use client";

// import * as React from "react";
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// import { useIsMobile } from "@/hooks/use-mobile";
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { DashboardStats } from "@/types/dashboard-stat";

// const chartConfig = {
//   repas: {
//     label: "Repas servis",
//     color: "var(--primary)",
//   },
// } satisfies ChartConfig;

// export function ChartAreaInteractive({ stats }: { stats: DashboardStats }) {
//   const isMobile = useIsMobile();
//   const [timeRange, setTimeRange] = React.useState("30d");

//   React.useEffect(() => {
//     if (isMobile) {
//       setTimeRange("7d");
//     }
//   }, [isMobile]);

//   const filteredData = (stats?.charts || []).filter((item) => {
//     const date = new Date(item.date);
//     const referenceDate = new Date();
//     let daysToSubtract = 90;
//     if (timeRange === "30d") {
//       daysToSubtract = 30;
//     } else if (timeRange === "7d") {
//       daysToSubtract = 7;
//     }
//     const startDate = new Date(referenceDate);
//     startDate.setDate(startDate.getDate() - daysToSubtract);
//     return date >= startDate;
//   });

//   return (
//     <Card className="@container/card">
//       <CardHeader>
//         <CardTitle>Total des repas servis</CardTitle>
//         <CardDescription>
//           <span className="hidden @[540px]/card:block">
//             Historique des 3 derniers mois
//           </span>
//           <span className="@[540px]/card:hidden">3 derniers mois</span>
//         </CardDescription>
//         <CardAction>
//           <ToggleGroup
//             type="single"
//             value={timeRange}
//             onValueChange={setTimeRange}
//             variant="outline"
//             className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
//           >
//             <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
//             <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
//             <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
//           </ToggleGroup>
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger
//               className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
//               size="sm"
//               aria-label="Sélectionner une période"
//             >
//               <SelectValue placeholder="3 derniers mois" />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl">
//               <SelectItem value="90d" className="rounded-lg">
//                 3 derniers mois
//               </SelectItem>
//               <SelectItem value="30d" className="rounded-lg">
//                 30 derniers jours
//               </SelectItem>
//               <SelectItem value="7d" className="rounded-lg">
//                 7 derniers jours
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </CardAction>
//       </CardHeader>
//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[250px] w-full"
//         >
//           <AreaChart data={filteredData}>
//             <defs>
//               <linearGradient id="fillRepas" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-repas)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-repas)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//             </defs>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 const date = new Date(value);
//                 return date.toLocaleDateString("fr-FR", {
//                   month: "short",
//                   day: "numeric",
//                 });
//               }}
//             />
//             <ChartTooltip
//               cursor={false}
//               defaultIndex={isMobile ? -1 : 10}
//               content={
//                 <ChartTooltipContent
//                   labelFormatter={(value) => {
//                     return new Date(value).toLocaleDateString("fr-FR", {
//                       month: "short",
//                       day: "numeric",
//                     });
//                   }}
//                   indicator="dot"
//                 />
//               }
//             />
//             <Area
//               dataKey="total"
//               type="monotone"
//               fill="url(#fillRepas)"
//               stroke="var(--color-repas)"
//               strokeWidth={2}
//               dot={{ r: 2 }}
//             />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardStats } from "@/types/dashboard-stat";


const chartConfig = {
  posts: {
    label: "Articles",
    color: "hsl(var(--chart-1))",
  },
  comments: {
    label: "Commentaires",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface DashboardChartProps {
  data: DashboardStats["charts"];
}

export function ChartAreaInteractive({ data }: DashboardChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30"); // ou new Date() si dynamique
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Statistiques - Articles & Commentaires</CardTitle>
          <CardDescription>
            Données des 3 derniers mois par défaut
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              3 derniers mois
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 derniers jours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 derniers jours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPosts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-posts)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-posts)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillComments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-comments)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-comments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="posts"
              type="natural"
              fill="url(#fillPosts)"
              stroke="var(--color-posts)"
              stackId="a"
            />
            <Area
              dataKey="comments"
              type="natural"
              fill="url(#fillComments)"
              stroke="var(--color-comments)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
