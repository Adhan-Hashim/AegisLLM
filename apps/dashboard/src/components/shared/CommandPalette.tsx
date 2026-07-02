"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Shield, Activity, RefreshCw, FileCode, List, Settings, BookOpen } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/80 backdrop-blur-sm">
      <Command 
        className="w-[500px] max-w-full bg-card text-card-foreground rounded-lg border shadow-2xl overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <Command.Input 
          autoFocus 
          placeholder="Search Workspaces..." 
          className="w-full px-4 py-3 bg-transparent border-b outline-none text-sm placeholder:text-muted-foreground"
        />
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
          
          <Command.Group heading="Workspaces" className="px-2 py-1 text-xs text-muted-foreground font-semibold">
            <Command.Item
              onSelect={() => { router.push("/console"); setOpen(false); }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm rounded cursor-pointer hover:bg-secondary text-foreground aria-selected:bg-secondary"
            >
              <Activity className="w-4 h-4" /> Security Console
            </Command.Item>
            <Command.Item
              onSelect={() => { router.push("/attack-lab"); setOpen(false); }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm rounded cursor-pointer hover:bg-secondary text-foreground aria-selected:bg-secondary"
            >
              <Shield className="w-4 h-4" /> Attack Lab
            </Command.Item>
            <Command.Item
              onSelect={() => { router.push("/replay-center"); setOpen(false); }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm rounded cursor-pointer hover:bg-secondary text-foreground aria-selected:bg-secondary"
            >
              <RefreshCw className="w-4 h-4" /> Replay Center
            </Command.Item>
            <Command.Item
              onSelect={() => { router.push("/rules-studio"); setOpen(false); }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm rounded cursor-pointer hover:bg-secondary text-foreground aria-selected:bg-secondary"
            >
              <FileCode className="w-4 h-4" /> Rules Studio
            </Command.Item>
            <Command.Item
              onSelect={() => { router.push("/sessions"); setOpen(false); }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm rounded cursor-pointer hover:bg-secondary text-foreground aria-selected:bg-secondary"
            >
              <List className="w-4 h-4" /> Sessions
            </Command.Item>
            <Command.Item
              onSelect={() => { router.push("/api-explorer"); setOpen(false); }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm rounded cursor-pointer hover:bg-secondary text-foreground aria-selected:bg-secondary"
            >
              <BookOpen className="w-4 h-4" /> API Explorer
            </Command.Item>
          </Command.Group>

          <Command.Group heading="System" className="px-2 py-1 text-xs text-muted-foreground font-semibold mt-2">
            <Command.Item
              onSelect={() => { router.push("/settings"); setOpen(false); }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm rounded cursor-pointer hover:bg-secondary text-foreground aria-selected:bg-secondary"
            >
              <Settings className="w-4 h-4" /> Settings
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
