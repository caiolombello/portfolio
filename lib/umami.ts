// Configuração da API Umami
export const UMAMI_CONFIG = {
  baseUrl: process.env.UMAMI_API_URL || "https://cloud.umami.is/api",
  websiteId: "8f7cbf98-45b4-49b3-83dd-7f398d47c925",
  // Se você tiver um token de API, adicione-o aqui
  apiToken: process.env.UMAMI_API_TOKEN || "",
};

// Tipos para as respostas da API
export interface UmamiStats {
  pageviews: { value: number; prev: number };
  visitors: { value: number; prev: number };
  visits: { value: number; prev: number };
  bounces: { value: number; prev: number };
  totaltime: { value: number; prev: number };
}

export interface UmamiActiveVisitors {
  x: number;
}

export interface UmamiPageviewsData {
  x: string;
  y: number;
}

export interface UmamiPageviews {
  pageviews: UmamiPageviewsData[];
  sessions: UmamiPageviewsData[];
}

export interface UmamiMetric {
  x: string;
  y: number;
}

export interface UmamiEvent {
  x: string;
  t: string;
  y: number;
}

// Funções para buscar dados da API
export async function fetchUmamiStats(
  startAt: number,
  endAt: number,
): Promise<UmamiStats | null> {
  try {
    const headers: HeadersInit = {};
    if (UMAMI_CONFIG.apiToken) {
      headers.Authorization = `Bearer ${UMAMI_CONFIG.apiToken}`;
    }

    const response = await fetch(
      `${UMAMI_CONFIG.baseUrl}/websites/${UMAMI_CONFIG.websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar estatísticas: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar estatísticas do Umami:", error);
    return null;
  }
}

export async function fetchUmamiActiveVisitors(): Promise<number> {
  try {
    const headers: HeadersInit = {};
    if (UMAMI_CONFIG.apiToken) {
      headers.Authorization = `Bearer ${UMAMI_CONFIG.apiToken}`;
    }

    const response = await fetch(
      `${UMAMI_CONFIG.baseUrl}/websites/${UMAMI_CONFIG.websiteId}/active`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar visitantes ativos: ${response.statusText}`,
      );
    }

    const data: UmamiActiveVisitors = await response.json();
    return data.x;
  } catch (error) {
    console.error("Erro ao buscar visitantes ativos do Umami:", error);
    return 0;
  }
}

export async function fetchUmamiPageviews(
  startAt: number,
  endAt: number,
  unit = "day",
  timezone = "America/Sao_Paulo",
): Promise<UmamiPageviews | null> {
  try {
    const headers: HeadersInit = {};
    if (UMAMI_CONFIG.apiToken) {
      headers.Authorization = `Bearer ${UMAMI_CONFIG.apiToken}`;
    }

    const response = await fetch(
      `${UMAMI_CONFIG.baseUrl}/websites/${UMAMI_CONFIG.websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=${unit}&timezone=${encodeURIComponent(timezone)}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar visualizações de página: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar visualizações de página do Umami:", error);
    return null;
  }
}

export async function fetchUmamiMetrics(
  startAt: number,
  endAt: number,
  type = "url",
  limit = 10,
): Promise<UmamiMetric[] | null> {
  try {
    const headers: HeadersInit = {};
    if (UMAMI_CONFIG.apiToken) {
      headers.Authorization = `Bearer ${UMAMI_CONFIG.apiToken}`;
    }

    const response = await fetch(
      `${UMAMI_CONFIG.baseUrl}/websites/${UMAMI_CONFIG.websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=${type}&limit=${limit}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar métricas: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar métricas do Umami (${type}):`, error);
    return null;
  }
}

export async function fetchUmamiEvents(
  startAt: number,
  endAt: number,
  unit = "day",
  timezone = "America/Sao_Paulo",
): Promise<UmamiEvent[] | null> {
  try {
    const headers: HeadersInit = {};
    if (UMAMI_CONFIG.apiToken) {
      headers.Authorization = `Bearer ${UMAMI_CONFIG.apiToken}`;
    }

    const response = await fetch(
      `${UMAMI_CONFIG.baseUrl}/websites/${UMAMI_CONFIG.websiteId}/events/series?startAt=${startAt}&endAt=${endAt}&unit=${unit}&timezone=${encodeURIComponent(timezone)}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar eventos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar eventos do Umami:", error);
    return null;
  }
}
