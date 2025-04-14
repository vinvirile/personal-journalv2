import { useState, useEffect, useMemo } from "react"; // Changed to useMemo
import { supabase } from "../../utils/supabase";
import { Entry } from "../types/Entry";

type ConfirmDialogState = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmAction: () => void;
  entryId?: number;
  hasUnsavedChanges?: boolean;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
};

export function useJournal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const [currentTags, setCurrentTags] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [correctPin, setCorrectPin] = useState<string>("");
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmAction: () => {},
  });

  // Date Range State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Handler for date changes
  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Memoized filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (!startDate || !endDate) {
        return true; // No date range selected, show all entries
      }
      // Parse strict_date (YYYY-MM-DD) into local time midnight
      const [year, month, day] = entry.strict_date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day); // Month is 0-indexed
      // Get start date (set to midnight)
      const startRangeDate = new Date(startDate);
      startRangeDate.setHours(0, 0, 0, 0);
      // Get end date (set to midnight)
      const endRangeDate = new Date(endDate);
      endRangeDate.setHours(0, 0, 0, 0);
      // Check if entryDate is within the range (inclusive)
      return entryDate >= startRangeDate && entryDate <= endRangeDate;
    });
  }, [entries, startDate, endDate]);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const appPin = process.env.NEXT_PUBLIC_APP_PIN || "6432";
    setCorrectPin(appPin);
    const storedPin = localStorage.getItem("journal_pin_validated");
    if (storedPin && storedPin === appPin) {
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (data) {
          setEntries(data);
          if (data.length > 0 && !selectedEntryId) {
            setSelectedEntryId(data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
        setError("Failed to load journal entries");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, [selectedEntryId]);

  useEffect(() => {
    const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);
    if (selectedEntry) {
      setCurrentTitle(selectedEntry.title);
      setCurrentContent(selectedEntry.content);
      setCurrentTags(selectedEntry.tags || "");
    } else {
      setCurrentTitle("");
      setCurrentContent("");
      setCurrentTags("");
    }
    setHasUnsavedChanges(false);
  }, [selectedEntryId, entries]);

  const addEntry = async () => {
    try {
      setIsLoading(true);
      const today = new Date();
      const strictDate = today.toISOString().split("T")[0];
      const newEntry = {
        title: "New Entry",
        content: "",
        tags: "",
        strict_date: strictDate,
      };
      const { data, error } = await supabase
        .from("journal_entries")
        .insert(newEntry)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setEntries([data[0], ...entries]);
        setSelectedEntryId(data[0].id);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error adding entry:", error);
      setError("Failed to add new entry");
    } finally {
      setIsLoading(false);
    }
  };

  const updateEntry = async (
    id: number,
    updatedTitle: string,
    updatedContent: string,
    updatedTags: string = ""
  ) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("journal_entries")
        .update({
          title: updatedTitle,
          content: updatedContent,
          tags: updatedTags,
        })
        .eq("id", id);
      if (error) throw error;
      setEntries(
        entries.map((entry) =>
          entry.id === id
            ? { ...entry, title: updatedTitle, content: updatedContent, tags: updatedTags }
            : entry
        )
      );
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating entry:", error);
      setError("Failed to update entry");
    } finally {
      setIsLoading(false);
    }
  };

  const saveChanges = async () => {
    if (selectedEntryId) {
      await updateEntry(selectedEntryId, currentTitle, currentContent, currentTags);
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from("journal_entries").delete().eq("id", id);
      if (error) throw error;
      const updatedEntries = entries.filter((entry) => entry.id !== id);
      setEntries(updatedEntries);
      if (selectedEntryId === id) {
        setSelectedEntryId(updatedEntries.length > 0 ? updatedEntries[0].id : null);
      }
      // Close the confirmation dialog after successful deletion
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Error deleting entry:", error);
      setError("Failed to delete entry");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteEntry = (id: number, hasUnsavedChanges: boolean = false, goToListAfterDelete: boolean = false) => {
    const message = hasUnsavedChanges
      ? "You have unsaved changes that will be lost. Are you sure you want to delete this entry?"
      : "Are you sure you want to delete this entry?";

    setConfirmDialog({
      isOpen: true,
      title: "Confirm Deletion",
      message,
      confirmAction: () => {
        deleteEntry(id);
        if (goToListAfterDelete && isMobile) {
          setMobileView("list");
        }
      },
      entryId: id,
      hasUnsavedChanges,
      confirmText: "Delete",
      type: "danger"
    });
  };

  const confirmDiscardChanges = (action: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title: "Unsaved Changes",
      message: "You have unsaved changes. Are you sure you want to discard them?",
      confirmAction: action,
      confirmText: "Discard",
      type: "warning"
    });
  };

  const confirmLock = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Lock Journal",
      message: "You have unsaved changes. Are you sure you want to discard them and lock the journal?",
      confirmAction: () => {
        localStorage.removeItem("journal_pin_validated");
        setIsLocked(true);
      },
      confirmText: "Lock",
      type: "info"
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleEntrySelect = (id: number) => {
    if (hasUnsavedChanges && selectedEntryId !== id) {
      confirmDiscardChanges(() => {
        setSelectedEntryId(id);
        if (isMobile) setMobileView("detail");
      });
    } else {
      setSelectedEntryId(id);
      if (isMobile) setMobileView("detail");
    }
  };

  const goBackToList = () => {
    if (hasUnsavedChanges) {
      confirmDiscardChanges(() => {
        setMobileView("list");
      });
    } else {
      setMobileView("list");
    }
  };

  const handleAddEntry = async () => {
    if (hasUnsavedChanges) {
      confirmDiscardChanges(async () => {
        await addEntry();
        if (isMobile) setMobileView("detail");
      });
    } else {
      await addEntry();
      if (isMobile) setMobileView("detail");
    }
  };

  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);

  const handleUnlock = () => setIsLocked(false);

  const handleLock = () => {
    if (hasUnsavedChanges) {
      confirmLock();
    } else {
      localStorage.removeItem("journal_pin_validated");
      setIsLocked(true);
    }
  };

  return {
    entries,
    selectedEntryId,
    setSelectedEntryId,
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
    setMobileView,
    isMobile,
    isLocked,
    correctPin,
    addEntry,
    updateEntry,
    saveChanges,
    deleteEntry,
    confirmDeleteEntry,
    confirmDiscardChanges,
    confirmLock,
    confirmDialog,
    closeConfirmDialog,
    handleEntrySelect,
    goBackToList,
    handleAddEntry,
    selectedEntry,
    handleUnlock,
    handleLock,
    // Date Filter related
    startDate,
    endDate,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    filteredEntries, // Return filtered entries
  };
}
