"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export function ConfirmModal({ open, onClose, onConfirm, title, message }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-5 text-sm text-secondary/60">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Eliminar
        </Button>
      </div>
    </Modal>
  );
}
