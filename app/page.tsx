"use client";

import PinLock from "../components/PinLock";
import ErrorAlert from "./components/ErrorAlert";
import EntryList from "./components/EntryList";
import EntryDetail from "./components/EntryDetail";
import SparkleButton from "./components/SparkleButton";
import ConfirmDialog from "./components/ConfirmDialog";
import DateRangePickerComponent from "./components/DateRangePicker"; // Import DateRangePickerComponent
import { useJournal } from "./hooks/useJournal";
import { useAIGeneration } from "./hooks/useAIGeneration";

export default function Home() {
  const {
    selectedEntryId,
    currentTitle,
    setCurrentTitle,
    currentContent,
    setCurrentContent,
    currentTags,
    setCurrentTags,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isLoading,
    error,
    setError,
    mobileView,
    isMobile,
    isLocked,
    correctPin,
    saveChanges,
    confirmDeleteEntry,
    confirmDialog,
    closeConfirmDialog,
    handleEntrySelect,
    goBackToList,
    handleAddEntry,
    selectedEntry,
    handleUnlock,
    handleLock,
    // Date filter props
    startDate,
    endDate,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    filteredEntries,
  } = useJournal();

  const {
    generateTitleFromContent,
    generateTagsFromContent,
    isTitleGenerating,
    isTagsGenerating,
    error: aiError,
    setError: setAiError
  } = useAIGeneration();

  return (
    <div className="h-screen bg-stone-100 font-[family-name:var(--font-caveat)] flex flex-col overflow-hidden">
      {isLocked && <PinLock correctPin={correctPin} onUnlock={handleUnlock} />}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText || "Confirm"}
        onConfirm={confirmDialog.confirmAction}
        onCancel={closeConfirmDialog}
        isLoading={isLoading}
        type={confirmDialog.type || "danger"}
      />

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex flex-1 overflow-hidden">
          <EntryList
            // entries={entries} // Removed
            filteredEntries={filteredEntries} // Added
            selectedEntryId={selectedEntryId}
            onSelect={handleEntrySelect}
            onAdd={handleAddEntry}
            onLock={handleLock}
            isLoading={isLoading}
            // Pass date filter props
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            handleDateChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
          />
          <div className="w-2/3 flex flex-col h-full overflow-hidden">
            <div className="p-6 overflow-y-auto flex-1">
              <EntryDetail
                entry={selectedEntry}
                currentTitle={currentTitle}
                currentContent={currentContent}
                currentTags={currentTags}
                onTitleChange={(value: string) => {
                  setCurrentTitle(value);
                  setHasUnsavedChanges(true);
                }}
                onContentChange={(value: string) => {
                  setCurrentContent(value);
                  setHasUnsavedChanges(true);
                }}
                onTagsChange={(value: string) => {
                  setCurrentTags(value);
                  setHasUnsavedChanges(true);
                }}
                onSave={saveChanges}
                onDelete={() => {
                  if (selectedEntry) {
                    confirmDeleteEntry(selectedEntry.id, hasUnsavedChanges);
                  }
                }}
                isLoading={isLoading}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout (unchanged for now) */}
      {isMobile && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Entries List View */}
          {mobileView === "list" && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-stone-300 bg-stone-200">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-stone-800">Entries</h2>
                  {/* Add Calendar Icon Button for Mobile */}
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="ml-2 text-stone-600 hover:text-stone-800"
                    title="Filter by Date"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleLock}
                    className="ml-2 text-stone-600 hover:text-stone-800" // Keep ml-2
                    title="Lock Journal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleAddEntry}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "..." : "+"}
                </button>
              </div>
              {/* Conditionally render Date Picker for Mobile */}
              {showDatePicker && (
                <div className="p-4 bg-stone-200 border-b border-stone-300">
                  <DateRangePickerComponent onDateChange={handleDateChange} />
                </div>
              )}
              <div className="overflow-y-auto flex-1 p-4 bg-stone-200">
                 {/* Update loading/empty states for filtering */}
                {isLoading && filteredEntries.length === 0 && !startDate && !endDate ? (
                  <p className="text-stone-600 text-center mt-8">Loading entries...</p>
                ) : filteredEntries.length === 0 ? (
                  <p className="text-stone-600 text-center mt-8">
                    {startDate && endDate ? "No entries found in this date range." : "No entries yet. Click '+' to add one."}
                  </p>
                ) : (
                  <ul>
                    {/* Use filteredEntries for Mobile */}
                    {filteredEntries.map((entry) => (
                      <li
                        key={entry.id}
                        onClick={() => handleEntrySelect(entry.id)}
                        className="p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 bg-white hover:bg-stone-50 border border-stone-300"
                      >
                        <h3 className="text-lg font-semibold text-stone-800 truncate">{entry.title || "Untitled"}</h3>
                        <p className="text-sm text-stone-600 truncate">{entry.content || "No content"}</p>
                        <p className="text-xs text-stone-500 mt-1">{entry.strict_date}</p>
                        {entry.tags && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.tags.split(",").map((tag: string, index: number) => (
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
          {mobileView === "detail" && (
            <div className="flex flex-col h-full">
              <div className="sticky top-0 z-20 bg-stone-200 border-b border-stone-300">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <button
                      onClick={goBackToList}
                      className="mr-2 text-stone-600 hover:text-stone-800 flex items-center text-xs font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <h2 className="text-lg font-bold text-stone-800">Edit Entry</h2>
                  </div>
                  {selectedEntry && (
                    <span className="text-xs text-stone-500">{selectedEntry.strict_date}</span>
                  )}
                </div>
                {selectedEntry && (
                  <div className="flex justify-end px-2 pb-1 space-x-4">
                    {hasUnsavedChanges && (
                      <button
                        onClick={saveChanges}
                        className="text-green-600 hover:text-green-800 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        confirmDeleteEntry(selectedEntry.id, hasUnsavedChanges, true);
                      }}
                      className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
              <div
                className="p-4 overflow-y-auto flex-1"
                style={{ paddingTop: "0.5rem", paddingBottom: "1rem" }}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-stone-600">
                    <p className="text-lg">Loading...</p>
                  </div>
                ) : selectedEntry ? (
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <input
                        type="text"
                        value={currentTitle}
                        onChange={(e) => {
                          setCurrentTitle(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="Title"
                        className="text-2xl font-bold text-stone-800 bg-transparent border-b border-stone-300 pb-2 flex-1 focus:outline-none focus:border-blue-500"
                        disabled={isLoading || isTitleGenerating}
                      />
                      <SparkleButton
                        onClick={async () => {
                          if (currentContent.trim() === '') {
                            setAiError('Please add some content before generating a title');
                            return;
                          }
                          const generatedTitle = await generateTitleFromContent(currentContent);
                          if (generatedTitle) {
                            setCurrentTitle(generatedTitle);
                            setHasUnsavedChanges(true);
                          }
                        }}
                        isLoading={isTitleGenerating}
                        title="Generate title from content"
                        size="md"
                        className="ml-2"
                      />
                    </div>
                    <textarea
                      value={currentContent}
                      onChange={(e) => {
                        setCurrentContent(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Start writing..."
                      className="flex-1 text-lg text-stone-800 bg-transparent resize-none focus:outline-none mb-4"
                      disabled={isLoading}
                      rows={10}
                    />
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
                <div className="mt-6 mb-20 p-3 border border-stone-300 rounded-lg bg-stone-50">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="mobile-tags" className="block text-sm font-medium text-stone-600">
                      Tags (comma separated)
                    </label>
                    <SparkleButton
                      onClick={async () => {
                        if (currentContent.trim() === '') {
                          setAiError('Please add some content before generating tags');
                          return;
                        }
                        const generatedTags = await generateTagsFromContent(currentContent);
                        if (generatedTags) {
                          setCurrentTags(generatedTags);
                          setHasUnsavedChanges(true);
                        }
                      }}
                      isLoading={isTagsGenerating}
                      title="Generate tags from content"
                      size="sm"
                    />
                  </div>
                  <input
                    id="mobile-tags"
                    type="text"
                    value={currentTags}
                    onChange={(e) => {
                      setCurrentTags(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="e.g. Work, Personal, Ideas"
                    className="w-full p-2 text-sm text-stone-800 border border-stone-300 rounded focus:outline-none focus:border-blue-500"
                    disabled={isLoading || isTagsGenerating}
                  />
                  {aiError && (
                    <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                      {aiError}
                      <button
                        onClick={() => setAiError(null)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        aria-label="Dismiss error"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
