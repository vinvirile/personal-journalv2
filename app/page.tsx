import { useState, useEffect } from 'react';
import Head from 'next/head';

// Define the structure for a journal entry
interface Entry {
  id: number;
  title: string;
  content: string;
  date: string;
}

// Define the component
const JournalApp: React.FC = () => {
  // State for journal entries
  const [entries, setEntries] = useState<Entry[]>([]);
  // State for the currently selected entry ID
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  // State for the title and content of the currently selected entry
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [currentContent, setCurrentContent] = useState<string>('');

  // Load entries from local storage on initial render
  useEffect(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  // Save entries to local storage whenever the entries state changes
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  // Update currentTitle and currentContent when selectedEntryId changes
  useEffect(() => {
    const selectedEntry = entries.find(entry => entry.id === selectedEntryId);
    if (selectedEntry) {
      setCurrentTitle(selectedEntry.title);
      setCurrentContent(selectedEntry.content);
    } else {
      setCurrentTitle('');
      setCurrentContent('');
    }
  }, [selectedEntryId, entries]);

  // Function to add a new entry
  const addEntry = () => {
    const newEntry: Entry = {
      id: Date.now(), // Use timestamp as a unique ID
      title: 'New Entry',
      content: '',
      date: new Date().toLocaleDateString(),
    };
    setEntries([newEntry, ...entries]); // Add new entry to the beginning
    setSelectedEntryId(newEntry.id); // Select the new entry
  };

  // Function to update an existing entry
  const updateEntry = (id: number, updatedTitle: string, updatedContent: string) => {
    setEntries(entries.map(entry =>
      entry.id === id ? { ...entry, title: updatedTitle, content: updatedContent } : entry
    ));
  };

  // Function to delete an entry
  const deleteEntry = (id: number) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    if (selectedEntryId === id) {
      setSelectedEntryId(updatedEntries.length > 0 ? updatedEntries[0].id : null); // Select the first entry or none
    }
  };

  // Get the currently selected entry object
  const selectedEntry = entries.find(entry => entry.id === selectedEntryId);

  return (
    <div className="min-h-screen bg-stone-100 font-['Caveat',_cursive] flex flex-col">
      <Head>
        <title>My Journal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap" rel="stylesheet" />
      </Head>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Entry List */}
        <div className="w-1/3 bg-stone-200 border-r border-stone-300 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-stone-800">Entries</h2>
            <button
              onClick={addEntry}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm"
            >
              +
            </button>
          </div>
          {entries.length === 0 ? (
            <p className="text-stone-600 text-center mt-8">No entries yet. Click '+' to add one.</p>
          ) : (
            <ul>
              {entries.map(entry => (
                <li
                  key={entry.id}
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedEntryId === entry.id
                      ? 'bg-blue-100 border border-blue-300'
                      : 'bg-white hover:bg-stone-50 border border-stone-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-stone-800 truncate">{entry.title || 'Untitled'}</h3>
                  <p className="text-sm text-stone-600 truncate">{entry.content || 'No content'}</p>
                  <p className="text-xs text-stone-500 mt-1">{entry.date}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content Area for Selected Entry */}
        <div className="w-2/3 p-6 flex flex-col overflow-y-auto">
          {selectedEntry ? (
            <>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => {
                  setCurrentTitle(e.target.value);
                  updateEntry(selectedEntry.id, e.target.value, currentContent);
                }}
                placeholder="Title"
                className="text-2xl font-bold text-stone-800 bg-transparent border-b border-stone-300 pb-2 mb-4 focus:outline-none focus:border-blue-500"
              />
              <textarea
                value={currentContent}
                onChange={(e) => {
                  setCurrentContent(e.target.value);
                  updateEntry(selectedEntry.id, currentTitle, e.target.value);
                }}
                placeholder="Start writing..."
                className="flex-1 text-lg text-stone-800 bg-transparent resize-none focus:outline-none"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-stone-500">{selectedEntry.date}</span>
                <button
                  onClick={() => deleteEntry(selectedEntry.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-stone-600">
              <p className="text-lg">Select an entry or click '+' to create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalApp;