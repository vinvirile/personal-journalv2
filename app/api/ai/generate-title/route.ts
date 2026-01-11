import { NextResponse } from 'next/server';
import { generateTitle } from '../../../../utils/openai';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const title = await generateTitle(content);
    return NextResponse.json({ title });
  } catch (error) {
    console.error('API Error generating title:', error);
    return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
  }
}
