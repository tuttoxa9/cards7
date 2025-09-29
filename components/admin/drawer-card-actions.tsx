"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface DrawerCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function DrawerCardActions({ onEdit, onDelete }: DrawerCardActionsProps) {
  return (
    <div className="flex flex-col space-y-3">
      <Button
        onClick={onEdit}
        variant="outline"
        className="w-full justify-start"
      >
        <Edit className="mr-2 h-4 w-4" />
        Изменить
      </Button>
      <Button
        onClick={onDelete}
        variant="destructive"
        className="w-full justify-start"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Удалить
      </Button>
    </div>
  );
}