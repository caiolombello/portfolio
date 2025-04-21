"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartBarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  FolderIcon,
  AcademicCapIcon,
  UserIcon,
  TrophyIcon,
  ChartPieIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  pageviews: {
    pageviews: number;
    sessions: number;
    bounces: number;
    totaltime: number;
  };
  topPages: Array<{
    x: string;
    y: number;
  }>;
  topCountries: Array<{
    x: string;
    y: number;
  }>;
  topBrowsers: Array<{
    x: string;
    y: number;
  }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AdminDashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    fetchData();
  }, []);

  // Mostrar um indicador de carregamento enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin h-8 w-8 border-4 border-gold rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Se não estiver autenticado, o AuthGuard já cuidará do redirecionamento
  if (!isAuthenticated) {
    return null;
  }

  const cards = [
    {
      title: "Perfil",
      description: "Editar informações pessoais",
      icon: <UserIcon className="h-8 w-8 text-gold" />,
      href: "/admin/profile",
    },
    {
      title: "Habilidades",
      description: "Gerenciar habilidades técnicas",
      icon: <ChartBarIcon className="h-8 w-8 text-gold" />,
      href: "/admin/skills",
    },
    {
      title: "Experiências",
      description: "Adicionar ou editar experiências profissionais",
      icon: <BriefcaseIcon className="h-8 w-8 text-gold" />,
      href: "/admin/experiences",
    },
    {
      title: "Educação",
      description: "Gerenciar formação acadêmica",
      icon: <AcademicCapIcon className="h-8 w-8 text-gold" />,
      href: "/admin/education",
    },
    {
      title: "Certificações",
      description: "Gerenciar certificações profissionais",
      icon: <TrophyIcon className="h-8 w-8 text-gold" />,
      href: "/admin/certifications",
    },
    {
      title: "Projetos",
      description: "Adicionar ou editar projetos do portfólio",
      icon: <FolderIcon className="h-8 w-8 text-gold" />,
      href: "/admin/projects",
    },
    {
      title: "Blog",
      description: "Gerenciar artigos do blog",
      icon: <DocumentTextIcon className="h-8 w-8 text-gold" />,
      href: "/admin/posts",
    },
    {
      title: "Analytics",
      description: "Visualizar estatísticas do site",
      icon: <ChartPieIcon className="h-8 w-8 text-gold" />,
      href: "/admin/analytics",
    },
    {
      title: "SEO",
      description: "Gerenciar metadados e SEO",
      icon: <MagnifyingGlassIcon className="h-8 w-8 text-gold" />,
      href: "/admin/metadata",
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link key={index} href={card.href}>
            <Card className="h-full hover:border-gold/40 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-bold">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Pageviews"
            value={data?.pageviews.pageviews}
            loading={!data}
          />
          <StatsCard
            title="Total Sessions"
            value={data?.pageviews.sessions}
            loading={!data}
          />
          <StatsCard
            title="Bounce Rate"
            value={
              data
                ? `${(
                    (data.pageviews.bounces / data.pageviews.sessions) *
                    100
                  ).toFixed(1)}%`
                : undefined
            }
            loading={!data}
          />
          <StatsCard
            title="Avg. Session Duration"
            value={
              data
                ? `${(
                    data.pageviews.totaltime / data.pageviews.sessions / 60
                  ).toFixed(1)}m`
                : undefined
            }
            loading={!data}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {!data ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topPages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="y" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visitors by Country</CardTitle>
              <CardDescription>Geographic distribution of visitors</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {!data ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topCountries}
                      dataKey="y"
                      nameKey="x"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.topCountries.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Browser Usage</CardTitle>
            <CardDescription>Distribution of browsers used by visitors</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {!data ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topBrowsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="y" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  loading,
}: {
  title: string;
  value?: number | string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
