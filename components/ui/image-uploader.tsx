"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, Edit2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  label: string;
  imageUrl: string | null;
  onUpload: (file: File) => Promise<string | null>;
  onRemove: () => void;
  setFormValue: (url: string) => void;
  clearFormValue: () => void;
}

export function ImageUploader({
  label,
  imageUrl,
  onUpload,
  onRemove,
  setFormValue,
  clearFormValue,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(30);
    const uploadedUrl = await onUpload(file);
    setUploadProgress(100);

    if (uploadedUrl) {
      setFormValue(uploadedUrl);
    }
    // Имитация завершения для визуального фидбека
    setTimeout(() => {
      setIsUploading(false);
    }, 500);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
    clearFormValue();
  };

  const handleTriggerUpload = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/jpeg,image/png';
    inputElement.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleUpload(target.files[0]);
      }
    };
    inputElement.click();
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed border-zinc-600 rounded-lg p-4 h-48 flex flex-col justify-center items-center text-center cursor-pointer transition-colors hover:border-blue-500 ${isDragActive ? 'border-blue-500 bg-zinc-800/50' : ''}`}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="space-y-2 flex flex-col items-center">
            <Upload className="w-8 h-8 text-blue-400 animate-pulse" />
            <p className="text-sm text-zinc-400">Загрузка...</p>
            <Progress value={uploadProgress} className="w-32 h-2" />
          </div>
        ) : imageUrl ? (
          <>
            <img src={imageUrl} alt={label} className="w-full h-full object-contain rounded-md" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
              <Button size="sm" variant="outline" onClick={handleTriggerUpload} className="bg-zinc-900/80 border-zinc-600 hover:bg-zinc-700">
                <Edit2 className="w-4 h-4 mr-2" />
                Заменить
              </Button>
              <Button size="sm" variant="destructive" onClick={handleRemove} className="bg-red-900/80 hover:bg-red-800">
                <X className="w-4 h-4 mr-2" />
                Удалить
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-1 text-zinc-400">
            <Upload className="w-8 h-8 mx-auto" />
            <p className="text-sm">Нажмите или перетащите</p>
            <p className="text-xs text-zinc-500">JPG, PNG, макс. 2МБ</p>
          </div>
        )}
      </div>
    </div>
  );
}