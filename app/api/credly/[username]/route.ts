import { NextResponse, NextRequest } from "next/server";

interface BadgeTemplate {
  id: string;
  name: string;
  image_url: string;
  issuer?: {
    name: string;
  };
  url: string;
}

interface Badge {
  id: string;
  issued_at: string;
  badge_template: BadgeTemplate;
}

interface CacheEntry {
  data: Badge[];
  timestamp: number;
}

// Cache em memória para desenvolvimento/produção
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas em milliseconds

// Função para verificar se o cache é válido
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL;
}

// Função para buscar dados do Credly
async function fetchCredlyData(username: string): Promise<Badge[]> {
  const credlyUrl = `https://www.credly.com/users/${username}/badges.json`;
  
  const res = await fetch(credlyUrl, {
    headers: { 
      Accept: "application/json",
      "User-Agent": "Portfolio-Bot/1.0" 
    },
    // Cache do Next.js para revalidação automática
    next: { revalidate: 86400 } // 24 horas
  });

  if (!res.ok) {
    throw new Error(`Credly API returned ${res.status}`);
  }

  const data = await res.json();
  
  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error("Invalid Credly data format");
  }

  return data.data.map((badge: Badge) => ({
    id: badge.id,
    issued_at: badge.issued_at,
    badge_template: {
      id: badge.badge_template.id,
      name: badge.badge_template.name,
      image_url: badge.badge_template.image_url,
      issuer: badge.badge_template.issuer,
      url: badge.badge_template.url,
    },
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const cacheKey = `credly:${username}`;
  
  try {
    // Verificar cache em memória primeiro
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry && isCacheValid(cachedEntry)) {
      return NextResponse.json(cachedEntry.data, {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24h
          'X-Cache-Status': 'HIT'
        }
      });
    }
    
    // Buscar dados frescos do Credly
    const sanitizedData = await fetchCredlyData(username);
    
    // Salvar no cache em memória
    cache.set(cacheKey, {
      data: sanitizedData,
      timestamp: Date.now()
    });

    // Limpar cache antigo (manter apenas últimas 10 entradas)
    if (cache.size > 10) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }

    return NextResponse.json(sanitizedData, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24h
        'X-Cache-Status': 'MISS'
      }
    });

  } catch (error) {
    console.error(`[Credly API] Failed to fetch badges for ${username}:`, error);
    
    // Tentar retornar dados em cache mesmo que expirados
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry) {
      return NextResponse.json(cachedEntry.data, {
        headers: {
          'Cache-Control': 'public, max-age=3600', // 1h para cache stale
          'X-Cache-Status': 'STALE'
        }
      });
    }

    // Se não há cache, retornar erro
    if (error instanceof Error && error.message.includes("404")) {
      return NextResponse.json(
        { error: "Credly profile not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch Credly badges" },
      { status: 500 }
    );
  }
}