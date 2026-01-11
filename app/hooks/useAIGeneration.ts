import { useState } from 'react';
// Now using local API routes instead of direct util calls to keep API key secure

export function useAIGeneration() {
  const [isTitleGenerating, setIsTitleGenerating] = useState<boolean>(false);
  const [isTagsGenerating, setIsTagsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate a title based on the content
   * @param content The content to generate a title from
   * @returns The generated title or null if there was an error
   */
  const generateTitleFromContent = async (content: string): Promise<string | null> => {
    if (!content || content.trim() === '') {
      setError('Content is required to generate a title');
      return null;
    }

    try {
      setIsTitleGenerating(true);
      setError(null);
      
      const response = await fetch('/api/ai/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate title');
      }

      const data = await response.json();
      return data.title;
    } catch (err) {
      console.error('Error in generateTitleFromContent:', err);
      setError('Failed to generate title. Please try again.');
      return null;
    } finally {
      setIsTitleGenerating(false);
    }
  };

  /**
   * Generate tags based on the content
   * @param content The content to generate tags from
   * @returns The generated tags or null if there was an error
   */
  const generateTagsFromContent = async (content: string): Promise<string | null> => {
    if (!content || content.trim() === '') {
      setError('Content is required to generate tags');
      return null;
    }

    try {
      setIsTagsGenerating(true);
      setError(null);
      
      const response = await fetch('/api/ai/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate tags');
      }

      const data = await response.json();
      return data.tags;
    } catch (err) {
      console.error('Error in generateTagsFromContent:', err);
      setError('Failed to generate tags. Please try again.');
      return null;
    } finally {
      setIsTagsGenerating(false);
    }
  };

  return {
    generateTitleFromContent,
    generateTagsFromContent,
    isTitleGenerating,
    isTagsGenerating,
    error,
    setError,
  };
}
