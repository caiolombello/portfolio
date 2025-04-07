import { NextRequest, NextResponse } from 'next/server';
import { getMediumPost } from '@/lib/medium';

type RouteParams = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  props: { params: RouteParams }
) {
  try {
    const { id } = await props.params;
    const post = await getMediumPost(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching Medium post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post from Medium' },
      { status: 500 }
    );
  }
}
