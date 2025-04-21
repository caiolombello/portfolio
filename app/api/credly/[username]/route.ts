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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const credlyUrl = `https://www.credly.com/users/${username}/badges.json`;

  try {
    const res = await fetch(credlyUrl, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Credly not found" }, { status: 404 });
    }
    const data = await res.json();
    if (!data?.data || !Array.isArray(data.data)) {
      return NextResponse.json(
        { error: "Invalid Credly data format" },
        { status: 500 },
      );
    }

    const sanitizedData = data.data.map((badge: Badge) => ({
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

    return NextResponse.json(sanitizedData);
  } catch (error) {
    console.error("Failed to fetch Credly badges:", error);
    return NextResponse.json(
      { error: "Failed to fetch Credly badges" },
      { status: 500 },
    );
  }
}