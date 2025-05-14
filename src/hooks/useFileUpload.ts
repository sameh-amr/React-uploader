import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile, FileAction } from '../types/types';

const MAX_CONCURRENT_UPLOADS = 3;

export const useFileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filter, setFilter] = useState('');
  const [activeUploads, setActiveUploads] = useState(0);

  // Simulate upload progress
  const simulateUpload = useCallback((fileId: string, file: File) => {
    return new Promise<string>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          const url = URL.createObjectURL(file);
          resolve(url);
        }
        setFiles(prevFiles =>
          prevFiles.map(f =>
            f.id === fileId ? { ...f, progress } : f
          )
        );
      }, 300);
    });
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type.split('/')[1]?.toUpperCase() || file.name.split('.').pop()?.toUpperCase() || 'FILE',
      uploadedAt: new Date(),
      status: 'queued',
      progress: 0,
      file,
    }));

    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  }, []);

  const processQueue = useCallback(() => {
    if (activeUploads >= MAX_CONCURRENT_UPLOADS) return;

    const nextFile = files.find((file) => file.status === 'queued');
    if (!nextFile || !nextFile.file) return;

    setActiveUploads((count) => count + 1);
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === nextFile.id ? { ...file, status: 'uploading' } : file
      )
    );

    simulateUpload(nextFile.id, nextFile.file)
      .then((url) => {
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === nextFile.id
              ? { ...file, status: 'completed', url, progress: 100 }
              : file
          )
        );
      })
      .catch(() => {
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === nextFile.id ? { ...file, status: 'failed' } : file
          )
        );
      })
      .finally(() => {
        setActiveUploads((count) => count - 1);
        processQueue();
      });
  }, [files, activeUploads, simulateUpload]);

  useEffect(() => {
    processQueue();
  }, [files, processQueue]);

  const handleAction = useCallback((action: FileAction, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    switch (action) {
      case 'download':
        if (file.url) {
          const a = document.createElement('a');
          a.href = file.url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        break;
      case 'replace':
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
          const newFile = (e.target as HTMLInputElement).files?.[0];
          if (newFile) {
            setFiles(prevFiles =>
              prevFiles.map(f =>
                f.id === fileId
                  ? {
                      ...f,
                      name: newFile.name,
                      size: newFile.size,
                      type: newFile.type.split('/')[1]?.toUpperCase() || newFile.name.split('.').pop()?.toUpperCase() || 'FILE',
                      file: newFile,
                      status: 'queued',
                      progress: 0,
                      url: undefined,
                    }
                  : f
              )
            );
          }
        };
        input.click();
        break;
      case 'delete':
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        break;
    }
  }, [files]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(filter.toLowerCase())
  );

  return {
    files: filteredFiles,
    addFiles,
    handleAction,
    filter,
    setFilter,
    activeUploads,
  };
};