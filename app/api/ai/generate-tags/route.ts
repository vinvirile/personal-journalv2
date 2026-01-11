import { NextResponse } from 'next/server';
import { generateTags } from '../../../../utils/openai';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const tags = await generateTags(content);
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('API Error generating tags:', error);
    return NextResponse.json({ error: 'Failed to generate tags' }, { status: 500 });
  }
}
