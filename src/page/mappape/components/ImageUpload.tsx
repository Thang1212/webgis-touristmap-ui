// components/ImageUpload.tsx
import React, { useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  files: File[];
  existingImages?: string[];
  onFilesChange: (files: File[]) => void;
  onExistingImagesChange?: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  files,
  existingImages = [],
  onFilesChange,
  onExistingImagesChange,
  maxImages = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const totalImages = existingImages.length + files.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    addFiles(newFiles);
  };

  const addFiles = (newFiles: File[]) => {
    if (totalImages + newFiles.length > maxImages) {
      alert(`Chỉ được tải tối đa ${maxImages} ảnh`);
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} không phải file ảnh`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} quá lớn (tối đa 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    onFilesChange([...files, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    if (onExistingImagesChange) {
      onExistingImagesChange(existingImages.filter((img) => img !== imageUrl));
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      {totalImages < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">
              Kéo thả ảnh hoặc click để chọn
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max {maxImages} ảnh • PNG, JPG • Max 5MB
            </p>
          </label>
        </div>
      )}

      {/* Image Preview Grid */}
      {(existingImages.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {/* Existing images */}
          {existingImages.map((imageUrl, index) => (
            <div key={`existing-${index}`} className="relative group aspect-square">
              <img
                src={imageUrl}
                alt={`Existing ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeExistingImage(imageUrl)}
                type="button"
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* New file previews */}
          {previews.map((preview, index) => (
            <div key={`new-${index}`} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeFile(index)}
                type="button"
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      {totalImages > 0 && (
        <p className="text-xs text-gray-500 text-right">
          {totalImages}/{maxImages} ảnh
        </p>
      )}
    </div>
  );
};

export default ImageUpload;