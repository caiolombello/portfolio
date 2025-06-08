"use client";

import { useEffect, useState } from "react";
import { fetchCredlyBadges } from "@/lib/credly";
import { useSiteConfig } from "@/hooks/use-site-config";
import Image from "next/image";

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

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.getFullYear();
}

export default function CredlyCertifications() {
  const { config, loading: configLoading } = useSiteConfig();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (configLoading) return;
    
    const username = config.integrations.credlyUsername;
    
    // Skip if no Credly username configured or using default placeholder
    if (!username || username === "your-credly-username") {
      setLoading(false);
      setError("Credly username not configured");
      return;
    }

    fetchCredlyBadges(username)
      .then((data) => {
        if (Array.isArray(data)) {
          // Remove duplicates and sort by date (most recent first)
          const uniqueBadges = Array.from(
            new Map(data.map((b) => [b.badge_template.id, b])).values(),
          ).sort((a, b) => {
            const dateA = new Date(a.issued_at).getTime();
            const dateB = new Date(b.issued_at).getTime();
            return dateB - dateA;
          });
          setBadges(uniqueBadges);
        } else {
          console.error("Invalid data format received:", data);
          setError("Invalid data format received from Credly");
        }
      })
      .catch((err) => {
        console.error("Error fetching Credly badges:", err);
        setError("Failed to fetch Credly badges");
      })
      .finally(() => setLoading(false));
  }, [config.integrations.credlyUsername, configLoading]);

  if (loading)
    return (
      <div className="bg-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 border rounded-lg bg-background animate-pulse"
            >
              <div className="w-24 h-24 mb-4 bg-muted rounded-full" />
              <div className="h-4 w-32 bg-muted rounded mb-2" />
              <div className="h-3 w-16 bg-muted rounded mb-2" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  if (!badges.length) return <p>Nenhuma certificação encontrada no Credly.</p>;

  return (
    <div className="bg-card p-6">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const { name, image_url } = badge.badge_template;
            const issuedAt = badge.issued_at;
            const verificationUrl = `https://www.credly.com/badges/${badge.id}`;

            return (
              <div
                key={badge.id}
                className="flex flex-col items-center p-4 border rounded-lg bg-background hover:border-gold transition-colors duration-200"
              >
                <div className="w-24 h-24 mb-4">
                  <Image
                    src={image_url}
                    alt={name}
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="font-bold text-sm">{name}</h4>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(issuedAt)}
                  </div>
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-gold hover:text-gold/80 underline text-xs mt-2"
                  >
                    Verificar
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
