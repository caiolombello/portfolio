import { NextResponse } from 'next/server';
import { getTestimonialsData } from '@/lib/data';

export async function GET() {
  const data = await getTestimonialsData();
  return NextResponse.json(data);
}
