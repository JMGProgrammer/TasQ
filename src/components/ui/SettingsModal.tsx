"use client";

import { Sun, Moon } from "lucide-react";
import { Modal } from "./Modal";
import { useTheme } from "./ThemeProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Modal open={open} onClose={onClose} title="Configuración">
      <div>
        <label className="mb-3 block text-sm text-text-secondary">Tema</label>
        <button
          onClick={toggleTheme}
          className={`relative flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ${
            theme === "dark" ? "bg-primary" : "bg-secondary/30"
          }`}
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${
              theme === "dark" ? "translate-x-8" : "translate-x-1"
            }`}
          >
            {theme === "dark" ? (
              <Moon size={14} className="text-primary" />
            ) : (
              <Sun size={14} className="text-warning" />
            )}
          </span>
        </button>
      </div>
    </Modal>
  );
}
