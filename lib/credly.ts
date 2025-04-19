export async function fetchCredlyBadges(username: string) {
  const res = await fetch(`/api/credly/${username}`);
  if (!res.ok) throw new Error("Erro ao buscar badges do Credly");
  return await res.json();
} 