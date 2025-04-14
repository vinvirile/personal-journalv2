import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { Entry } from "../types/Entry";

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
    } catch (error) {
      console.error("Error deleting entry:", error);
      setError("Failed to delete entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntrySelect = (id: number) => {
    if (hasUnsavedChanges && selectedEntryId !== id) {
      if (confirm("You have unsaved changes. Do you want to discard them?")) {
        setSelectedEntryId(id);
        if (isMobile) setMobileView("detail");
      }
    } else {
      setSelectedEntryId(id);
      if (isMobile) setMobileView("detail");
    }
  };

  const goBackToList = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Do you want to discard them?")) {
        setMobileView("list");
      }
    } else {
      setMobileView("list");
    }
  };

  const handleAddEntry = async () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Do you want to discard them?")) {
        await addEntry();
        if (isMobile) setMobileView("detail");
      }
    } else {
      await addEntry();
      if (isMobile) setMobileView("detail");
    }
  };

  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);

  const handleUnlock = () => setIsLocked(false);

  const handleLock = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Do you want to discard them and lock the journal?")) {
        localStorage.removeItem("journal_pin_validated");
        setIsLocked(true);
      }
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
    handleEntrySelect,
    goBackToList,
    handleAddEntry,
    selectedEntry,
    handleUnlock,
    handleLock,
  };
}
