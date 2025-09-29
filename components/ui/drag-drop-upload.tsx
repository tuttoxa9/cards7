import React, { useState, useRef, ChangeEvent } from 'react';
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
  placeholder = "Выберите файл для загрузки",
  className,
  disabled = false
}) => {
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
      <div className="border border-zinc-600 rounded-lg p-3 bg-[#18181B] min-h-[120px] flex flex-col justify-center">
        {isUploading ? (
          <div className="space-y-3">
            <div className="text-center">
              <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-300 mb-2">Загрузка в Cloudflare R2...</p>
            </div>
            <Progress value={uploadProgress} className="w-full h-2 bg-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </Progress>
            <p className="text-xs text-center text-zinc-400">{uploadProgress}%</p>
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
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClick}
                className="text-zinc-300 hover:text-white border-zinc-600 hover:border-zinc-500 text-xs h-7 px-3"
                disabled={disabled}
              >
                <Upload className="h-3 w-3 mr-1" />
                Изменить
              </Button>
              {onRemove && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRemove}
                  className="text-red-400 hover:text-red-300 border-red-600 hover:border-red-500 text-xs h-7 px-3"
                  disabled={disabled}
                >
                  <X className="h-3 w-3 mr-1" />
                  Удалить
                </Button>
              )}
            </div>
            <p className="text-xs text-center text-zinc-500">Изображение загружено</p>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <Upload className="w-6 h-6 text-zinc-400 mx-auto" />
            <p className="text-xs text-zinc-400">{placeholder}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              className="text-zinc-300 hover:text-white border-zinc-600 hover:border-zinc-500 text-xs h-8 px-4"
              disabled={disabled}
            >
              <Upload className="h-3 w-3 mr-2" />
              Выбрать файл
            </Button>
            <p className="text-xs text-zinc-500">
              Форматы: {accept} • Макс. размер: {maxSize}MB
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
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
};
