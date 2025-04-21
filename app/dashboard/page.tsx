"use client";

import { useEffect, useState } from "react";
import { fetchUmamiStats, fetchUmamiActiveVisitors } from "@/lib/umami";
import { UserGroupIcon, EyeIcon, ClockIcon } from "@heroicons/react/24/outline";

interface UmamiStats {
  visitors: { value: number };
  pageviews: { value: number };
  totaltime: { value: number };
  visits: { value: number };
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function Dashboard() {
  const [stats, setStats] = useState<UmamiStats | null>(null);
  const [active, setActive] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const end = Date.now();
    const start = end - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    Promise.all([fetchUmamiStats(start, end), fetchUmamiActiveVisitors()])
      .then(([statsData, activeVisitors]) => {
        setStats(statsData);
        setActive(activeVisitors);
        setError(null);
      })
      .catch(() => setError("Erro ao buscar estatísticas do Umami."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gold mb-8">
        Dashboard de Estatísticas
      </h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[120px]">
          <div
            className="animate-spin h-8 w-8 border-4 border-gold rounded-full"
            style={{ borderTopColor: "transparent" }}
          />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 flex flex-col items-center shadow-gold/10">
            <UserGroupIcon className="h-8 w-8 text-gold mb-2" />
            <div className="text-2xl font-bold">{active}</div>
            <div className="text-muted-foreground">Visitantes Ativos</div>
          </div>
          <div className="bg-card rounded-lg p-6 flex flex-col items-center shadow-gold/10">
            <UserGroupIcon className="h-8 w-8 text-gold mb-2" />
            <div className="text-2xl font-bold">
              {stats?.visitors?.value ?? 0}
            </div>
            <div className="text-muted-foreground">Visitantes Únicos</div>
          </div>
          <div className="bg-card rounded-lg p-6 flex flex-col items-center shadow-gold/10">
            <EyeIcon className="h-8 w-8 text-gold mb-2" />
            <div className="text-2xl font-bold">
              {stats?.pageviews?.value ?? 0}
            </div>
            <div className="text-muted-foreground">Visualizações de Página</div>
          </div>
          <div className="bg-card rounded-lg p-6 flex flex-col items-center shadow-gold/10">
            <ClockIcon className="h-8 w-8 text-gold mb-2" />
            <div className="text-2xl font-bold">
              {formatTime(
                stats ? stats.totaltime.value / (stats.visits.value || 1) : 0,
              )}
            </div>
            <div className="text-muted-foreground">Tempo Médio</div>
          </div>
        </div>
      )}
    </div>
  );
}
