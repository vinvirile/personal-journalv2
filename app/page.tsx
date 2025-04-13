"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

// Define the structure for a journal entry
interface Entry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  tags?: string;
  strict_date: string;
}

// Define the component
export default function Home() {
  // State for journal entries
  const [entries, setEntries] = useState<Entry[]>([]);
  // State for the currently selected entry ID
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  // State for the title and content of the currently selected entry
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [currentContent, setCurrentContent] = useState<string>('');
  // State for the current tags
  const [currentTags, setCurrentTags] = useState<string>('');
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  // State for mobile view (entries list or entry detail)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  // Check if the device is mobile using window width
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check for mobile screen size on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load entries from Supabase on initial render
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setEntries(data);
          // Select the first entry if available
          if (data.length > 0 && !selectedEntryId) {
            setSelectedEntryId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
        setError('Failed to load journal entries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [selectedEntryId]);

  // Update currentTitle, currentContent, and currentTags when selectedEntryId changes
  useEffect(() => {
    const selectedEntry = entries.find(entry => entry.id === selectedEntryId);
    if (selectedEntry) {
      setCurrentTitle(selectedEntry.title);
      setCurrentContent(selectedEntry.content);
      setCurrentTags(selectedEntry.tags || '');
    } else {
      setCurrentTitle('');
      setCurrentContent('');
      setCurrentTags('');
    }
  }, [selectedEntryId, entries]);

  // Function to add a new entry
  const addEntry = async () => {
    try {
      setIsLoading(true);

      // Format the current date as YYYY-MM-DD for strict_date
      const today = new Date();
      const strictDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

      const newEntry = {
        title: 'New Entry',
        content: '',
        tags: '',
        strict_date: strictDate
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(newEntry)
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setEntries([data[0], ...entries]); // Add new entry to the beginning
        setSelectedEntryId(data[0].id); // Select the new entry
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      setError('Failed to add new entry');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update an existing entry
  const updateEntry = async (id: number, updatedTitle: string, updatedContent: string, updatedTags: string = '') => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({
          title: updatedTitle,
          content: updatedContent,
          tags: updatedTags
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setEntries(entries.map(entry =>
        entry.id === id ? {
          ...entry,
          title: updatedTitle,
          content: updatedContent,
          tags: updatedTags
        } : entry
      ));
    } catch (error) {
      console.error('Error updating entry:', error);
      setError('Failed to update entry');
    }
  };

  // Function to delete an entry
  const deleteEntry = async (id: number) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);

      if (selectedEntryId === id) {
        setSelectedEntryId(updatedEntries.length > 0 ? updatedEntries[0].id : null); // Select the first entry or none
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Failed to delete entry');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle entry selection on mobile
  const handleEntrySelect = (id: number) => {
    setSelectedEntryId(id);
    if (isMobile) {
      setMobileView('detail');
    }
  };

  // Function to go back to entries list on mobile
  const goBackToList = () => {
    setMobileView('list');
  };

  // Function to handle adding a new entry on mobile
  const handleAddEntry = async () => {
    await addEntry();
    if (isMobile) {
      setMobileView('detail');
    }
  };

  // Get the currently selected entry object
  const selectedEntry = entries.find(entry => entry.id === selectedEntryId);

  return (
    <div className="h-screen bg-stone-100 font-[family-name:var(--font-caveat)] flex flex-col overflow-hidden">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md m-2" role="alert">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar for Entry List */}
          <div className="w-1/3 bg-stone-200 border-r border-stone-300 flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-stone-300">
              <h2 className="text-xl font-bold text-stone-800">Entries</h2>
              <button
                onClick={addEntry}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : '+'}
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {isLoading && entries.length === 0 ? (
                <p className="text-stone-600 text-center mt-8">Loading entries...</p>
              ) : entries.length === 0 ? (
                <p className="text-stone-600 text-center mt-8">No entries yet. Click &apos;+&apos; to add one.</p>
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
                      <p className="text-xs text-stone-500 mt-1">{entry.strict_date}</p>
                      {entry.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.tags.split(',').map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Main Content Area for Selected Entry */}
          <div className="w-2/3 flex flex-col h-full overflow-hidden">
            <div className="p-6 overflow-y-auto flex-1">
              {isLoading && !selectedEntry ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-600">
                  <p className="text-lg">Loading...</p>
                </div>
              ) : selectedEntry ? (
                <div className="flex flex-col h-full">
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => {
                      setCurrentTitle(e.target.value);
                      updateEntry(selectedEntry.id, e.target.value, currentContent, currentTags);
                    }}
                    placeholder="Title"
                    className="text-2xl font-bold text-stone-800 bg-transparent border-b border-stone-300 pb-2 mb-4 focus:outline-none focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <textarea
                    value={currentContent}
                    onChange={(e) => {
                      setCurrentContent(e.target.value);
                      updateEntry(selectedEntry.id, currentTitle, e.target.value, currentTags);
                    }}
                    placeholder="Start writing..."
                    className="flex-1 text-lg text-stone-800 bg-transparent resize-none focus:outline-none mb-4"
                    disabled={isLoading}
                  />
                  <div className="mb-4">
                    <label htmlFor="tags" className="block text-sm font-medium text-stone-600 mb-1">Tags (comma separated)</label>
                    <input
                      id="tags"
                      type="text"
                      value={currentTags}
                      onChange={(e) => {
                        setCurrentTags(e.target.value);
                        updateEntry(selectedEntry.id, currentTitle, currentContent, e.target.value);
                      }}
                      placeholder="e.g. Work, Personal, Ideas"
                      className="w-full p-2 text-sm text-stone-800 border border-stone-300 rounded focus:outline-none focus:border-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-stone-600">
                  <p className="text-lg">Select an entry or click &apos;+&apos; to create a new one.</p>
                </div>
              )}
            </div>
            {selectedEntry && (
              <div className="flex justify-between items-center p-4 border-t border-stone-300 bg-stone-100">
                <span className="text-sm text-stone-500">{selectedEntry.strict_date}</span>
                <button
                  onClick={() => deleteEntry(selectedEntry.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Entries List View */}
          {mobileView === 'list' && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-stone-300 bg-stone-200">
                <h2 className="text-xl font-bold text-stone-800">Entries</h2>
                <button
                  onClick={handleAddEntry}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '...' : '+'}
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 bg-stone-200">
                {isLoading && entries.length === 0 ? (
                  <p className="text-stone-600 text-center mt-8">Loading entries...</p>
                ) : entries.length === 0 ? (
                  <p className="text-stone-600 text-center mt-8">No entries yet. Click &apos;+&apos; to add one.</p>
                ) : (
                  <ul>
                    {entries.map(entry => (
                      <li
                        key={entry.id}
                        onClick={() => handleEntrySelect(entry.id)}
                        className="p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 bg-white hover:bg-stone-50 border border-stone-300"
                      >
                        <h3 className="text-lg font-semibold text-stone-800 truncate">{entry.title || 'Untitled'}</h3>
                        <p className="text-sm text-stone-600 truncate">{entry.content || 'No content'}</p>
                        <p className="text-xs text-stone-500 mt-1">{entry.strict_date}</p>
                        {entry.tags && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.tags.split(',').map((tag, index) => (
                              <span key={index} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Entry Detail View */}
          {mobileView === 'detail' && (
            <div className="flex flex-col h-full">
              <div className="flex items-center p-4 border-b border-stone-300 bg-stone-200">
                <button
                  onClick={goBackToList}
                  className="mr-2 text-stone-600 hover:text-stone-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-stone-800">Edit Entry</h2>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-stone-600">
                    <p className="text-lg">Loading...</p>
                  </div>
                ) : selectedEntry ? (
                  <div className="flex flex-col h-full">
                    <input
                      type="text"
                      value={currentTitle}
                      onChange={(e) => {
                        setCurrentTitle(e.target.value);
                        updateEntry(selectedEntry.id, e.target.value, currentContent, currentTags);
                      }}
                      placeholder="Title"
                      className="text-2xl font-bold text-stone-800 bg-transparent border-b border-stone-300 pb-2 mb-4 focus:outline-none focus:border-blue-500"
                      disabled={isLoading}
                    />
                    <textarea
                      value={currentContent}
                      onChange={(e) => {
                        setCurrentContent(e.target.value);
                        updateEntry(selectedEntry.id, currentTitle, e.target.value, currentTags);
                      }}
                      placeholder="Start writing..."
                      className="flex-1 text-lg text-stone-800 bg-transparent resize-none focus:outline-none mb-4"
                      disabled={isLoading}
                      rows={10}
                    />
                    <div className="mb-4">
                      <label htmlFor="mobile-tags" className="block text-sm font-medium text-stone-600 mb-1">Tags (comma separated)</label>
                      <input
                        id="mobile-tags"
                        type="text"
                        value={currentTags}
                        onChange={(e) => {
                          setCurrentTags(e.target.value);
                          updateEntry(selectedEntry.id, currentTitle, currentContent, e.target.value);
                        }}
                        placeholder="e.g. Work, Personal, Ideas"
                        className="w-full p-2 text-sm text-stone-800 border border-stone-300 rounded focus:outline-none focus:border-blue-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-stone-600">
                    <p className="text-lg">No entry selected</p>
                    <button
                      onClick={goBackToList}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Go back to entries
                    </button>
                  </div>
                )}
              </div>

              {selectedEntry && (
                <div className="flex justify-between items-center p-4 border-t border-stone-300 bg-stone-100">
                  <span className="text-sm text-stone-500">{selectedEntry.strict_date}</span>
                  <button
                    onClick={() => {
                      deleteEntry(selectedEntry.id);
                      goBackToList();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
