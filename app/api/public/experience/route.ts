import { NextResponse } from "next/server";
import { getExperiencesData } from "@/lib/data";
import type { Experience } from "@/types/experience";

export async function GET() {
  try {
    const data = await getExperiencesData();
    // Format the data for the expected component structure
    const formattedData = {
      pt: data.map((item: Experience) => ({
        title: item.title_pt,
        company: item.company,
        period: item.period,
        responsibilities: item.responsibilities_pt.map((r) => r.item),
      })),
      en: data.map((item: Experience) => ({
        title: item.title_en,
        company: item.company,
        period: item.period,
        responsibilities: item.responsibilities_en.map((r) => r.item),
      })),
      es: data.map((item: Experience) => ({
        title: item.title_es || item.title_en, // Fallback to English if Spanish not available
        company: item.company,
        period: item.period,
        responsibilities: item.responsibilities_es?.map((r) => r.item) || item.responsibilities_en.map((r) => r.item), // Fallback to English
      })),
    };
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error loading experiences:", error);
    return NextResponse.json(
      { error: "Failed to load experiences" },
      { status: 500 },
    );
  }
}
