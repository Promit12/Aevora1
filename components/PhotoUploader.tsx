import React, { useRef } from 'react';
import { UploadedImage } from '../types';

interface PhotoUploaderProps {
  label: string;
  subLabel: string;
  image: UploadedImage | null;
  onImageSelect: (image: UploadedImage) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  label,
  subLabel,
  image,
  onImageSelect,
  onRemove,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect({
          file,
          previewUrl: URL.createObjectURL(file),
          base64: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      
      {image ? (
        <div className="relative group w-full aspect-[4/5] bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <img 
            src={image.previewUrl} 
            alt={label} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {!disabled && (
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 text-center backdrop-blur-sm">
            {image.file.name}
          </div>
        </div>
      ) : (
        <div 
          onClick={triggerUpload}
          className={`
            w-full aspect-[4/5] rounded-xl border-2 border-dashed 
            flex flex-col items-center justify-center text-center p-6
            cursor-pointer transition-all duration-200
            ${disabled 
              ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
              : 'bg-white border-brand-300 hover:border-warm-500 hover:bg-brand-50'
            }
          `}
        >
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center mb-3
            ${disabled ? 'bg-gray-200 text-gray-400' : 'bg-brand-100 text-brand-600'}
          `}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Upload Photo</span>
          <span className="text-xs text-gray-500 mt-1">{subLabel}</span>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
