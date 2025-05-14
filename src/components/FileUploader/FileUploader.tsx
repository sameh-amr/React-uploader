import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export const FileUploader = ({ onFilesSelected }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <FiUploadCloud className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-medium text-gray-700">
          {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-sm text-gray-500">Upload any files you want to share</p>
      </div>
    </div>
  );
};