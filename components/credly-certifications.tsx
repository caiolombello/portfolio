import { useEffect, useState } from "react";
import { fetchCredlyBadges } from "@/lib/credly";

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
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const username = "caiolombello";

  useEffect(() => {
    fetchCredlyBadges(username)
      .then((data) => {
        if (Array.isArray(data)) {
          // Remove duplicates and sort by date (most recent first)
          const uniqueBadges = Array.from(
            new Map(data.map(b => [b.badge_template.id, b])).values()
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
  }, [username]);

  if (loading) return <p>Carregando certificações do Credly...</p>;
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
                  <img 
                    src={image_url} 
                    alt={name} 
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