-- Journal Entries Table
CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT,
  strict_date TEXT NOT NULL
);

-- Indexes
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX idx_journal_entries_strict_date ON journal_entries(strict_date);

-- Example Entry
INSERT INTO journal_entries (title, content, tags, strict_date)
VALUES (
  'First Journal Entry',
  'This is the content of my first journal entry.',
  'First,Journal,Example',
  '2023-10-15'
);
