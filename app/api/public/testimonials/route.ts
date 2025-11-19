import { NextResponse } from 'next/server';
import testimonials from '@/content/testimonials.json';

export async function GET() {
  return NextResponse.json(testimonials);
}
