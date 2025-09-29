"use client";

import { Button } from "@/components/ui/button";

interface DrawerDeleteConfirmationProps {
  cardName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DrawerDeleteConfirmation({
  cardName,
  onCancel,
  onConfirm,
}: DrawerDeleteConfirmationProps) {
  return (
    <div className="flex flex-col space-y-6">
      <p className="text-zinc-300">
        Вы уверены, что хотите удалить карточку{" "}
        <span className="font-bold text-white">&quot;{cardName}&quot;</span>?
        <br />
        Это действие необратимо.
      </p>
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Удалить навсегда
        </Button>
      </div>
    </div>
  );
}