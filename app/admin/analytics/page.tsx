"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchUmamiStats,
  fetchUmamiActiveVisitors,
  fetchUmamiPageviews,
  fetchUmamiMetrics,
  type UmamiStats,
  type UmamiPageviews,
  type UmamiMetric,
} from "@/lib/umami";
import StatsCard from "@/components/admin/analytics/stats-card";
import dynamic from "next/dynamic";
import DateRangePicker from "@/components/admin/analytics/date-range-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserGroupIcon,
  EyeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
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
import { CmsAnalytics } from "@/types/cms";
import { logger } from "@/lib/logger";

// Cores para gráficos
const COLORS = [
  "#FFD700",
  "#D4AF37",
  "#FFDF4F",
  "#B8860B",
  "#DAA520",
  "#F0E68C",
  "#BDB76B",
  "#EEE8AA",
  "#F5DEB3",
  "#FAFAD2",
];

// Formatar segundos em tempo legível
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Substituir import estático por dinâmico
const ChartContainer = dynamic(
  () => import("@/components/admin/analytics/chart-container"),
  { ssr: false },
);

export default function AdminAnalytics() {
  // Estado para datas
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Estados para dados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UmamiStats | null>(null);
  const [activeVisitors, setActiveVisitors] = useState<number>(0);
  const [pageviews, setPageviews] = useState<UmamiPageviews | null>(null);
  const [topPages, setTopPages] = useState<UmamiMetric[] | null>(null);
  const [topReferrers, setTopReferrers] = useState<UmamiMetric[] | null>(null);
  const [browsers, setBrowsers] = useState<UmamiMetric[] | null>(null);
  const [devices, setDevices] = useState<UmamiMetric[] | null>(null);
  const [countries, setCountries] = useState<UmamiMetric[] | null>(null);

  const [analytics, setAnalytics] = useState<CmsAnalytics>({
    pageViews: 0,
    uniqueVisitors: 0,
    averageTimeOnSite: 0,
    bounceRate: 0,
    topPages: [],
    timeRange: {
      start: new Date(),
      end: new Date(),
    },
  });

  // Função para buscar todos os dados
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Converter datas para timestamps
      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();

      // Buscar dados em paralelo
      const [
        statsData,
        activeVisitorsData,
        pageviewsData,
        topPagesData,
        topReferrersData,
        browsersData,
        devicesData,
        countriesData,
      ] = await Promise.all([
        fetchUmamiStats(startTimestamp, endTimestamp),
        fetchUmamiActiveVisitors(),
        fetchUmamiPageviews(startTimestamp, endTimestamp),
        fetchUmamiMetrics(startTimestamp, endTimestamp, "url"),
        fetchUmamiMetrics(startTimestamp, endTimestamp, "referrer"),
        fetchUmamiMetrics(startTimestamp, endTimestamp, "browser"),
        fetchUmamiMetrics(startTimestamp, endTimestamp, "device"),
        fetchUmamiMetrics(startTimestamp, endTimestamp, "country"),
      ]);

      // Atualizar estados
      setStats(statsData);
      setActiveVisitors(activeVisitorsData);
      setPageviews(pageviewsData);
      setTopPages(topPagesData);
      setTopReferrers(topReferrersData);
      setBrowsers(browsersData);
      setDevices(devicesData);
      setCountries(countriesData);
    } catch (err) {
      logger.error("analytics", "Erro ao buscar dados do Umami", err as Error);
      setError(
        "Ocorreu um erro ao buscar os dados de analytics. Verifique se o token de API do Umami está configurado corretamente.",
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  // Buscar dados quando as datas mudarem
  useEffect(() => {
    fetchAllData();

    // Configurar intervalo para atualizar visitantes ativos a cada minuto
    const interval = setInterval(async () => {
      try {
        const active = await fetchUmamiActiveVisitors();
        setActiveVisitors(active);
      } catch (err) {
        logger.error("analytics", "Erro ao atualizar visitantes ativos", err as Error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Manipular mudança de intervalo de datas
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gold">Analytics</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onRangeChange={handleDateRangeChange}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Visitantes Ativos"
          value={activeVisitors}
          icon={<UserGroupIcon className="h-4 w-4" />}
          description="Nos últimos 5 minutos"
          loading={loading}
        />
        <StatsCard
          title="Visitantes Únicos"
          value={stats?.visitors.value || 0}
          prevValue={stats?.visitors.prev}
          icon={<UserGroupIcon className="h-4 w-4" />}
          loading={loading}
        />
        <StatsCard
          title="Visualizações de Página"
          value={stats?.pageviews.value || 0}
          prevValue={stats?.pageviews.prev}
          icon={<EyeIcon className="h-4 w-4" />}
          loading={loading}
        />
        <StatsCard
          title="Tempo Médio"
          value={stats ? stats.totaltime.value / (stats.visits.value || 1) : 0}
          prevValue={
            stats ? stats.totaltime.prev / (stats.visits.prev || 1) : undefined
          }
          icon={<ClockIcon className="h-4 w-4" />}
          formatValue={(val) => formatTime(val)}
          loading={loading}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="referrers">Referências</TabsTrigger>
          <TabsTrigger value="devices">Dispositivos</TabsTrigger>
          <TabsTrigger value="locations">Localizações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Visualizações de Página"
              description="Visualizações de página ao longo do tempo"
              loading={loading}
            >
              {pageviews && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pageviews.pageviews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${value} visualizações`,
                        "Visualizações",
                      ]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString("pt-BR");
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#FFD700"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>

            <ChartContainer
              title="Sessões"
              description="Número de sessões ao longo do tempo"
              loading={loading}
            >
              {pageviews && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pageviews.sessions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} sessões`, "Sessões"]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString("pt-BR");
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#D4AF37"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <ChartContainer
            title="Páginas Mais Visitadas"
            description="Top 10 páginas mais visitadas"
            loading={loading}
          >
            {topPages && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={topPages.slice(0, 10)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="x"
                    width={150}
                    tickFormatter={(value) => {
                      // Truncar URLs longas
                      return value.length > 25
                        ? value.substring(0, 22) + "..."
                        : value;
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value} visualizações`,
                      "Visualizações",
                    ]}
                    labelFormatter={(label) => label}
                  />
                  <Bar dataKey="y" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </TabsContent>

        <TabsContent value="referrers">
          <ChartContainer
            title="Principais Referências"
            description="De onde os visitantes estão vindo"
            loading={loading}
          >
            {topReferrers && topReferrers.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={topReferrers.slice(0, 10)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="y"
                    nameKey="x"
                    label={({ x, y, name, value }) => `${name}: ${value}`}
                  >
                    {topReferrers.slice(0, 10).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} visitantes`, "Visitantes"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                {loading
                  ? "Carregando..."
                  : "Nenhuma referência encontrada para o período selecionado."}
              </div>
            )}
          </ChartContainer>
        </TabsContent>

        <TabsContent value="devices">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Navegadores"
              description="Navegadores mais utilizados"
              loading={loading}
            >
              {browsers && browsers.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={browsers.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="y"
                      nameKey="x"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {browsers.slice(0, 5).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${value} visitantes`,
                        "Visitantes",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-64 items-center justify-center text-muted-foreground">
                  {loading
                    ? "Carregando..."
                    : "Nenhum dado de navegador encontrado."}
                </div>
              )}
            </ChartContainer>

            <ChartContainer
              title="Dispositivos"
              description="Tipos de dispositivos utilizados"
              loading={loading}
            >
              {devices && devices.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={devices}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="y"
                      nameKey="x"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {devices.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${value} visitantes`,
                        "Visitantes",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-64 items-center justify-center text-muted-foreground">
                  {loading
                    ? "Carregando..."
                    : "Nenhum dado de dispositivo encontrado."}
                </div>
              )}
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="locations">
          <ChartContainer
            title="Países"
            description="Distribuição geográfica dos visitantes"
            loading={loading}
          >
            {countries && countries.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={countries.slice(0, 10)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="x" width={150} />
                  <Tooltip
                    formatter={(value) => [`${value} visitantes`, "Visitantes"]}
                  />
                  <Bar dataKey="y" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                {loading
                  ? "Carregando..."
                  : "Nenhum dado de localização encontrado."}
              </div>
            )}
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}
