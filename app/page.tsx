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
import { formatTimeCST, formatUpdatedAtCST } from "../utils/dateUtils";

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
    <div className="h-screen bg-background font-[family-name:var(--font-outfit)] flex flex-col overflow-hidden">
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
          <div className="w-2/3 flex flex-col h-full overflow-hidden bg-background">
            <div className="overflow-y-auto flex-1">
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
        <div className="flex flex-col h-full overflow-hidden bg-background">
          {/* Entries List View */}
          {mobileView === "list" && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center px-6 py-4 border-b border-foreground/5 bg-sidebar-bg">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground font-outfit">Journal</h2>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`p-1.5 rounded-lg transition-all-custom ${showDatePicker ? 'bg-primary/10 text-primary' : 'text-foreground/40'}`}
                      title="Filter by Date"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={handleLock}
                      className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground/60 transition-all-custom"
                      title="Lock Journal"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddEntry}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-hover text-white w-8 h-8 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all-custom active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </button>
              </div>

              {showDatePicker && (
                <div className="p-4 bg-sidebar-bg border-b border-foreground/5 animate-fade-in">
                  <DateRangePickerComponent onDateChange={handleDateChange} />
                </div>
              )}

              <div className="overflow-y-auto flex-1 p-4 space-y-3 bg-background">
                {isLoading && filteredEntries.length === 0 && !startDate && !endDate ? (
                  <div className="flex flex-col items-center justify-center mt-20 opacity-40">
                    <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-foreground text-sm font-outfit">Reflecting...</p>
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="text-center mt-20 px-8">
                    <p className="text-foreground/40 text-sm font-outfit">
                      {startDate && endDate ? "No matches." : "Your journal is empty."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEntries.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => handleEntrySelect(entry.id)}
                        className="p-4 rounded-2xl bg-sidebar-bg border border-foreground/5 shadow-sm active:scale-[0.98] transition-all-custom"
                      >
                        <h3 className="text-base font-bold text-foreground font-outfit truncate">{entry.title || "Untitled"}</h3>
                        <p className="text-sm text-foreground/50 line-clamp-1 font-light mt-1">{entry.content || "No content"}</p>
                        <div className="flex items-center gap-2 mt-3 opacity-60">
                          <span className="text-[10px] uppercase font-bold text-foreground/40 font-outfit">
                            {entry.strict_date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Entry Detail View */}
          {mobileView === "detail" && (
            <div className="flex flex-col h-full bg-background animate-fade-in relative">
              <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/5 bg-sidebar-bg">
                <button
                  onClick={goBackToList}
                  className="p-2 -ml-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-full transition-all-custom"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex flex-col items-center">
                  <h2 className="text-xs font-bold text-foreground/80 uppercase tracking-widest font-outfit">Entry</h2>
                  {selectedEntry && (
                    <span className="text-[9px] text-foreground/30 font-bold font-outfit">{selectedEntry.strict_date}</span>
                  )}
                </div>
                <div className="w-9" /> {/* Spacer */}
              </div>
              
              <div className="overflow-y-auto flex-1 flex flex-col p-6">
                {isLoading && !selectedEntry ? (
                   <div className="flex-1 flex items-center justify-center opacity-40">
                     <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                   </div>
                ) : selectedEntry ? (
                  <>
                    <div className="flex items-start gap-4 mb-6 group">
                      <textarea
                        value={currentTitle}
                        onChange={(e) => {
                          setCurrentTitle(e.target.value);
                          setHasUnsavedChanges(true);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        placeholder="Untitled Thoughts"
                        rows={1}
                        className="text-2xl font-bold text-foreground bg-transparent border-none p-0 flex-1 focus:outline-none placeholder:text-foreground/10 font-outfit resize-none overflow-hidden"
                        disabled={isLoading || isTitleGenerating}
                      />
                      <SparkleButton
                        onClick={async () => {
                          if (currentContent.trim() === '') {
                            setAiError('Please add content');
                            return;
                          }
                          const generatedTitle = await generateTitleFromContent(currentContent);
                          if (generatedTitle) {
                            setCurrentTitle(generatedTitle);
                            setHasUnsavedChanges(true);
                          }
                        }}
                        isLoading={isTitleGenerating}
                        size="md"
                      />
                    </div>
                    <textarea
                      value={currentContent}
                      onChange={(e) => {
                        setCurrentContent(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Start writing..."
                      className="flex-1 text-xl text-foreground/80 bg-transparent resize-none focus:outline-none font-caveat leading-relaxed placeholder:text-foreground/5 min-h-[300px]"
                      disabled={isLoading}
                    />

                    <div className="mt-8 py-6 border-t border-foreground/5 mb-24">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/30 font-outfit">Tags</label>
                        <SparkleButton
                          onClick={async () => {
                            if (currentContent.trim() === '') {
                              setAiError('Please add content');
                              return;
                            }
                            const generatedTags = await generateTagsFromContent(currentContent);
                            if (generatedTags) {
                              setCurrentTags(generatedTags);
                              setHasUnsavedChanges(true);
                            }
                          }}
                          isLoading={isTagsGenerating}
                          size="sm"
                        />
                      </div>
                      <input
                        type="text"
                        value={currentTags}
                        onChange={(e) => {
                          setCurrentTags(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="Add tags..."
                        className="w-full bg-foreground/5 border-none rounded-xl p-3 text-sm text-foreground/70 focus:outline-none font-outfit"
                        disabled={isLoading || isTagsGenerating}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-foreground/20">
                    <p className="font-outfit uppercase tracking-widest text-xs">Entry not found</p>
                    <button onClick={goBackToList} className="mt-4 text-primary font-bold text-sm">Back to Journal</button>
                  </div>
                )}
              </div>

              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2 glass rounded-full shadow-2xl border-glass-border animate-fade-in z-20">
                {hasUnsavedChanges && (
                  <button
                    onClick={saveChanges}
                    className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold font-outfit shadow-lg shadow-primary/20"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Save"}
                  </button>
                )}
                <button
                  onClick={() => confirmDeleteEntry(selectedEntry!.id, hasUnsavedChanges, true)}
                  className="p-2.5 text-foreground/30 hover:text-red-500 transition-colors"
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
