import { NextResponse } from "next/server";
import { loadEducation } from "@/lib/data";

export async function GET() {
  try {
    const data = await loadEducation();
    // Formatar os dados para o formato esperado pelo componente
    const formattedData = {
      pt: data.map((item) => ({
        degree: item.degree_pt,
        institution: item.institution,
        period: item.period,
        description: item.description_pt,
      })),
      en: data.map((item) => ({
        degree: item.degree_en,
        institution: item.institution,
        period: item.period,
        description: item.description_en,
      })),
    };
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error loading education:", error);
    return NextResponse.json(
      { error: "Failed to load education" },
      { status: 500 },
    );
  }
}
