"use client";

import { useState, useCallback } from "react";
import type { List, CreateListInput, UpdateListInput } from "@/lib/types";

export function useLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [activeList, setActiveList] = useState<List | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/lists");
      if (res.ok) {
        const data: List[] = await res.json();
        setLists(data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createList = useCallback(async (input: CreateListInput) => {
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    const list: List = await res.json();
    setLists((prev) => [...prev, list]);
    return list;
  }, []);

  const updateList = useCallback(
    async (id: string, input: UpdateListInput) => {
      const res = await fetch(`/api/lists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: List = await res.json();
      setLists((prev) => prev.map((l) => (l.id === id ? updated : l)));
      if (activeList?.id === id) setActiveList(updated);
      return updated;
    },
    [activeList],
  );

  const deleteList = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/lists/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setLists((prev) => prev.filter((l) => l.id !== id));
      if (activeList?.id === id) setActiveList(null);
    },
    [activeList],
  );

  return {
    lists,
    activeList,
    setActiveList,
    fetchLists,
    createList,
    updateList,
    deleteList,
    isLoading,
  };
}
