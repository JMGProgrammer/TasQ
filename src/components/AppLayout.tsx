"use client";

import { type ReactNode, useEffect, useState } from "react";
import { CheckSquare, Settings } from "lucide-react";
import type { List } from "@/lib/types";
import { ListSidebar } from "./lists/ListSidebar";
import { SettingsModal } from "@/components/ui/SettingsModal";

type Props = {
  lists: List[];
  activeList: List | null;
  onSelectList: (list: List) => void;
  onCreateList: (name: string) => Promise<void>;
  onFetchLists: () => void;
  children: ReactNode;
};

export function AppLayout({
  lists,
  activeList,
  onSelectList,
  onCreateList,
  onFetchLists,
  children,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    onFetchLists();
  }, [onFetchLists]);

  return (
    <>
      <div className="flex h-screen flex-col bg-bg-primary">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <CheckSquare size={20} className="text-primary" />
          <h1 className="flex-1 text-base font-bold text-text-primary">TasQ</h1>
          <button
            onClick={() => setSettingsOpen(true)}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
          >
            <Settings size={18} />
          </button>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden w-56 shrink-0 md:block">
            <ListSidebar
              lists={lists}
              activeList={activeList}
              onSelectList={onSelectList}
              onCreateList={onCreateList}
            />
          </div>
          <main className="flex-1 overflow-y-auto bg-bg-secondary p-4 md:p-6">
            {activeList ? (
              children
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-text-secondary/30">
                  Seleccioná una lista para empezar
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
