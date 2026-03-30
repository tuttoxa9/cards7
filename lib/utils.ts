import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-z0-9_\-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}
