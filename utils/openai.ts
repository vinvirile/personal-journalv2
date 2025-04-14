import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Allow client-side usage
});

/**
 * Generate a title based on the content of a journal entry
 * @param content The content of the journal entry
 * @returns A generated title
 */
export async function generateTitle(content: string): Promise<string> {
  try {
    if (!content || content.trim() === '') {
      return 'New Entry';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates concise, meaningful titles for journal entries. Create a title that captures the essence of the entry in 2-6 words.'
        },
        {
          role: 'user',
          content: `Generate a short, meaningful title for this journal entry:\n\n${content.substring(0, 1500)}`
        }
      ],
      max_tokens: 30,
      temperature: 0.7,
    });

    const title = response.choices[0]?.message?.content?.trim() || 'New Entry';
    return title;
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Entry';
  }
}

/**
 * Generate tags based on the content of a journal entry
 * @param content The content of the journal entry
 * @returns A comma-separated list of tags
 */
export async function generateTags(content: string): Promise<string> {
  try {
    if (!content || content.trim() === '') {
      return '';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates relevant tags for journal entries. Create 3-5 tags that capture the main themes, emotions, or topics in the entry. Return only the comma-separated tags without any additional text or explanation.'
        },
        {
          role: 'user',
          content: `Generate 3-5 comma-separated tags for this journal entry:\n\n${content.substring(0, 1500)}`
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const tags = response.choices[0]?.message?.content?.trim() || '';
    return tags;
  } catch (error) {
    console.error('Error generating tags:', error);
    return '';
  }
}
