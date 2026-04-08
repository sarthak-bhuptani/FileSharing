import React, { useCallback, useState } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';

const UploadBox = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    setIsUploading(true);
    try {
      const { default: api } = await import('../services/api');
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess(response.data);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 hover:border-gray-400 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {isUploading ? (
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        ) : (
          <UploadCloud
            className={`h-12 w-12 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`}
          />
        )}
        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-700">
            {isUploading ? 'Uploading files...' : 'Click or drag files to upload'}
          </p>
          <p className="text-sm text-gray-500">
            Any file type up to 50MB
          </p>
        </div>

        <input
          type="file"
          multiple
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={handleFileInput}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default UploadBox;
