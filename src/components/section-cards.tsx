import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStats } from "@/types/dashboard-stat";
import { NumberTicker } from "./magicui/number-ticker";

export function SectionCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Carte 1 - Posts total */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Posts Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberTicker value={stats.totalPosts} />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.postsGrowthRate >= 0 ? (
                <IconTrendingUp className="text-green-500" />
              ) : (
                <IconTrendingDown className="text-red-500" />
              )}
              {stats.postsGrowthRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tendance {stats.postsGrowthRate >= 0 ? "en hausse" : "en baisse"} ce
            mois
          </div>
          <div className="text-muted-foreground">
            Comparaison avec le mois précédent
          </div>
        </CardFooter>
      </Card>

      {/* Carte 2 - Nombre total des élèves enregistré à la cantine servis */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Posts de ce mois</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberTicker value={stats.newPostsThisMonth} />
          </CardTitle>
          <CardAction>
            {stats.approvalRate >= 0 ? (
              <div>
                <Badge variant="outline">
                  <IconTrendingUp className="text-green-500" /> +
                  {stats.approvalRate}%
                </Badge>
              </div>
            ) : (
              <div>
                <Badge variant="outline">
                  <IconTrendingDown className="text-red-500" />
                  {stats.approvalRate}%
                </Badge>
              </div>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Effectif global des élèves inscrits
          </div>
          <div className="text-muted-foreground">Mis à jour en temps réel</div>
        </CardFooter>
      </Card>

      {/* Carte 3 - Total de commentaire */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de commentaire</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberTicker value={stats.totalComments} />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.approvalRate >= 0 ? (
                <IconTrendingUp className="text-green-500" />
              ) : (
                <IconTrendingDown className="text-red-500" />
              )}
              {stats.approvalRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Progression {stats.approvalRate >= 0 ? "positive" : "négative"}
          </div>
          <div className="text-muted-foreground">
            Par rapport au mois précédent
          </div>
        </CardFooter>
      </Card>

      {/* Carte 4 - Taux d’abonnés actifs */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total catégorie</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberTicker value={stats.totalCategories} />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.totalCategories >= 70 ? (
                <IconTrendingUp className="text-green-500" />
              ) : (
                <IconTrendingDown className="text-red-500" />
              )}
              {stats.totalCategories}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            État des abonnements
          </div>
          <div className="text-muted-foreground">Mesure de la fidélité</div>
        </CardFooter>
      </Card>
    </div>
  );
}
