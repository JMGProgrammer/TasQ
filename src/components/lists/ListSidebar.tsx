"use client";

import { List as ListIcon } from "lucide-react";
import type { List } from "@/lib/types";
import { ListNav } from "./ListNav";
import { ListForm } from "./ListForm";

type Props = {
  lists: List[];
  activeList: List | null;
  onSelectList: (list: List) => void;
  onCreateList: (name: string) => Promise<void>;
};

export function ListSidebar({
  lists,
  activeList,
  onSelectList,
  onCreateList,
}: Props) {
  return (
    <aside className="flex h-full flex-col gap-3 border-r border-border bg-bg-sidebar p-4">
      <div className="flex items-center gap-2 px-3">
        <ListIcon size={18} className="text-primary" />
        <h2 className="text-sm font-semibold text-secondary">Listas</h2>
      </div>
      <ListNav
        lists={lists}
        activeList={activeList}
        onSelect={onSelectList}
      />
      <ListForm onCreate={onCreateList} />
    </aside>
  );
}
