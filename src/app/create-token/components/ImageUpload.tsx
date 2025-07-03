import React, { useState, useCallback, useEffect } from 'react';

interface ImageUploadProps {
  onFileSelect: (files: File[] | File | null) => void;
  multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect, multiple = false }) => {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [multiple]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles: FileList) => {
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    let validationError = false;
    
    Array.from(newFiles).forEach(file => {
      if (!validateFile(file)) {
        validationError = true;
        return;
      }
      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    if (validationError && validFiles.length === 0) {
      return;
    }

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    const updatedPreviews = multiple ? [...previewUrls, ...newPreviewUrls] : newPreviewUrls;

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    setError(null);
    
    // Update callback
    if (multiple) {
      onFileSelect(updatedFiles.length > 0 ? updatedFiles : null);
    } else {
      onFileSelect(updatedFiles[0] || null);
    }
  };

  const validateFile = (file: File): boolean => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PNG, JPEG, WebP, or GIF image.');
      return false;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit.');
      return false;
    }

    return true;
  };

  const handleRemove = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];
    
    // Revoke the object URL
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    
    // Update callback
    if (multiple) {
      onFileSelect(newFiles.length > 0 ? newFiles : null);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div className="space-y-2">
      <input 
        type="file" 
        accept="image/jpeg, image/jpg, image/png, image/webp, image/gif" 
        id="image-upload" 
        hidden 
        onChange={handleFileChange}
        multiple={multiple}
      />
      
      <label 
        className={`form-field-file group flex flex-col items-center justify-center gap-4 p-8 border border-dashed border-background-300 rounded-lg ${dragging ? 'bg-background-500 text-white' : ''}`}
        data-dragging={dragging}
        htmlFor="image-upload"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-14 h-14 [&>svg]:w-5 transition-colors group-data-[dragging=true]:bg-background-500 group-data-[dragging=true]:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <span className="block text-sm/[1.5] font-medium text-text-400">
            Drag & drop {multiple ? 'files' : 'file'} or <button type="button" className="text-brand-600 font-medium outline-none hover:underline">browse files</button>
          </span>
          <span className="block text-xs/[1.5] text-text-300">
            We support PNGs, JPEGs, WebP and GIFs. Images should be 800x800, within 2MB limit
            {multiple && ' each'}
          </span>
        </div>
      </label>
      
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative border-[6px] border-gray-200 rounded-md flex items-center justify-center w-full h-24">
              <img 
                src={url} 
                alt={`Preview ${index + 1}`} 
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => handleRemove(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
