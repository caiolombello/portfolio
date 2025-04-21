import { NextResponse } from "next/server";

const UMAMI_URL = "https://cloud.umami.is/api";
const WEBSITE_ID = "8f7cbf98-45b4-49b3-83dd-7f398d47c925";

async function fetchUmamiStats() {
  const startAt = new Date();
  startAt.setDate(startAt.getDate() - 30); // Last 30 days

  const stats = await Promise.all([
    // Get pageviews
    fetch(
      `${UMAMI_URL}/websites/${WEBSITE_ID}/stats?startAt=${startAt.getTime()}&endAt=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UMAMI_API_TOKEN}`,
        },
      }
    ).then((res) => res.json()),
    // Get top pages
    fetch(
      `${UMAMI_URL}/websites/${WEBSITE_ID}/metrics?startAt=${startAt.getTime()}&endAt=${Date.now()}&type=url`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UMAMI_API_TOKEN}`,
        },
      }
    ).then((res) => res.json()),
    // Get top countries
    fetch(
      `${UMAMI_URL}/websites/${WEBSITE_ID}/metrics?startAt=${startAt.getTime()}&endAt=${Date.now()}&type=country`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UMAMI_API_TOKEN}`,
        },
      }
    ).then((res) => res.json()),
    // Get top browsers
    fetch(
      `${UMAMI_URL}/websites/${WEBSITE_ID}/metrics?startAt=${startAt.getTime()}&endAt=${Date.now()}&type=browser`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UMAMI_API_TOKEN}`,
        },
      }
    ).then((res) => res.json()),
  ]);

  return {
    pageviews: stats[0],
    topPages: stats[1],
    topCountries: stats[2],
    topBrowsers: stats[3],
  };
}

export async function GET() {
  try {
    const stats = await fetchUmamiStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
} 