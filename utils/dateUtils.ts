/**
 * Utility functions for date and time formatting
 */

/**
 * Format a date string to display date and time in CST (Chicago) timezone
 * @param dateString ISO date string to format
 * @returns Formatted date and time string
 */
export function formatDateTimeCST(dateString: string): string {
  try {
    const date = new Date(dateString);

    // Format the date with CST timezone (Chicago)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if there's an error
  }
}

/**
 * Format a date string to display only the time in CST (Chicago) timezone
 * @param dateString ISO date string to format
 * @returns Formatted time string
 */
export function formatTimeCST(dateString: string): string {
  try {
    const date = new Date(dateString);

    // Format only the time with CST timezone (Chicago)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Chicago',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting time:', error);
    return ''; // Return empty string if there's an error
  }
}

/**
 * Format a date string to display a relative time (e.g., "Updated 5 minutes ago")
 * @param dateString ISO date string to format
 * @param prefix Optional prefix text (default: "Updated")
 * @returns Formatted relative time string with prefix
 */
export function formatUpdatedAtCST(dateString?: string, prefix: string = "Updated"): string {
  if (!dateString) return '';

  try {
    // Parse the input date - make sure to handle PostgreSQL timestamp format
    // PostgreSQL timestamps can come in format like "2025-04-22 13:24:03.557419+00"
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date format:', dateString);
      return `${prefix} recently`; // Fallback message
    }

    const now = new Date();

    // Calculate the difference in milliseconds
    const diffMs = now.getTime() - date.getTime();

    // Convert to minutes, hours, days
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Format the relative time
    if (diffMinutes < 1) {
      return `${prefix} just now`;
    } else if (diffMinutes < 60) {
      return `${prefix} ${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${prefix} ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${prefix} ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      // For older updates, show the date and time in CST timezone
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Chicago',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };

      return `${prefix} on ${new Intl.DateTimeFormat('en-US', timeOptions).format(date)}`;
    }
  } catch (error) {
    console.error('Error formatting updated time:', error);
    return ''; // Return empty string if there's an error
  }
}
