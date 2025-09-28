import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DragDropUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // в MB
  currentFile?: string;
  onRemove?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onUpload,
  accept = "image/*",
  maxSize = 10,
  currentFile,
  onRemove,
  isUploading = false,
  uploadProgress = 0,
  placeholder = "Перетащите файл сюда или нажмите для выбора",
  className,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Проверка типа файла
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      return 'Неподдерживаемый тип файла';
    }

    // Проверка размера файла
    if (file.size > maxSize * 1024 * 1024) {
      return `Файл слишком большой. Максимальный размер: ${maxSize}MB`;
    }

    return null;
  };

  const handleFile = async (file: File) => {
    if (disabled) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    try {
      await onUpload(file);
    } catch (err) {
      setError('Ошибка при загрузке файла');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
          isDragOver && !disabled
            ? "border-blue-400 bg-blue-50/5"
            : "border-zinc-600 hover:border-zinc-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {isUploading ? (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full h-2" />
            <p className="text-xs text-zinc-400">Загрузка... {uploadProgress}%</p>
          </div>
        ) : currentFile ? (
          <div className="space-y-2">
            <img
              src={currentFile}
              alt="Preview"
              className="w-16 h-20 object-cover rounded mx-auto"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.jpg";
              }}
            />
            <div className="flex gap-1 justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="text-zinc-400 hover:text-white text-xs h-6"
              >
                <Upload className="h-3 w-3 mr-1" />
                Изменить
              </Button>
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="text-zinc-400 hover:text-white text-xs h-6"
                >
                  <X className="h-3 w-3 mr-1" />
                  Удалить
                </Button>
              )}
            </div>
            <p className="text-xs text-zinc-500">Нажмите для изменения или перетащите новый файл</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs text-zinc-400">{placeholder}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="text-zinc-400 hover:text-white border-zinc-600 hover:border-zinc-500 text-xs h-8 px-4"
              disabled={disabled}
            >
              <Upload className="h-3 w-3 mr-2" />
              Загрузить с устройства
            </Button>
            <p className="text-xs text-zinc-500">
              {isDragOver ? "Отпустите для загрузки" : `Поддерживаемые форматы: ${accept}. Макс. размер: ${maxSize}MB`}
            </p>
          </div>
        )}

        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};
