# Personal Journal Application

A simple journal application built with Next.js and Supabase.

## Features

- Create, read, update, and delete journal entries
- Tag entries with comma-separated tags
- Entries are stored in a Supabase database
- Clean, minimalist UI with a handwritten font style

## Database Structure

The application uses a Supabase database with the following structure:

### Journal Entries Table

| Column      | Type        | Description                                   |
|-------------|-------------|-----------------------------------------------|
| id          | SERIAL      | Primary key, auto-incremented                 |
| title       | TEXT        | Title of the journal entry                    |
| content     | TEXT        | Content of the journal entry                  |
| created_at  | TIMESTAMPTZ | Timestamp when the entry was created          |
| tags        | TEXT        | Comma-separated list of tags                  |
| strict_date | TEXT        | Date in YYYY-MM-DD format in the user's timezone |

## Environment Variables

The application requires the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the required environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js
- React
- TypeScript
- Supabase
- TailwindCSS

## Learn More

This project was bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Supabase, check out:

- [Supabase Documentation](https://supabase.io/docs) - learn about Supabase features and API.
