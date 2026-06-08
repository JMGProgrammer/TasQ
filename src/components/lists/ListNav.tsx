"use client";

import type { List } from "@/lib/types";
import { ListNavItem } from "./ListNavItem";

type Props = {
  lists: List[];
  activeList: List | null;
  onSelect: (list: List) => void;
};

export function ListNav({ lists, activeList, onSelect }: Props) {
  if (lists.length === 0) {
    return (
      <p className="px-3 text-xs text-secondary/50">
        No hay listas todavía
      </p>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5">
      {lists.map((list) => (
        <ListNavItem
          key={list.id}
          active={activeList?.id === list.id}
          color={list.color}
          onClick={() => onSelect(list)}
        >
          {list.name}
        </ListNavItem>
      ))}
    </nav>
  );
}
