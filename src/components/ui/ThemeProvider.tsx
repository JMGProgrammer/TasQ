"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Theme } from "@/lib/theme";
import { resolveTheme, setStoredTheme, applyTheme, getStoredTheme } from "@/lib/theme";

type ThemeContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const Ctx = createContext<ThemeContext | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(resolveTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setStoredTheme(t);
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (!getStoredTheme()) {
        const sys = mq.matches ? "dark" : "light";
        setThemeState(sys);
        applyTheme(sys);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return <Ctx.Provider value={{ theme, setTheme, toggleTheme }}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
