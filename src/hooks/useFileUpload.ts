import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile, FileAction } from '../types/types';

const MAX_CONCURRENT_UPLOADS = 3;
const UPLOAD_DELAY = 1000; // Simulated upload delay in ms

export const useFileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filter, setFilter] = useState('');
  const [activeUploads, setActiveUploads] = useState(0);

  // Actual file upload handler
  const handleFileUpload = useCallback((fileId: string, file: File) => {
    return new Promise<string>((resolve) => {
      // Create object URL immediately for "storage" (in memory)
      const objectUrl = URL.createObjectURL(file);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10 + Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve(objectUrl); // Resolve with the object URL after "upload"
        }

        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileId ? { ...f, progress } : f
          )
        );
      }, UPLOAD_DELAY / 10);
    });
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type.split('/')[1]?.toUpperCase() ||
            file.name.split('.').pop()?.toUpperCase() ||
            'FILE',
      uploadedAt: new Date(),
      status: 'queued',
      progress: 0,
      file,
    }));

    setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
  }, []);

  const processQueue = useCallback(() => {
    if (activeUploads >= MAX_CONCURRENT_UPLOADS) return;

    const nextFile = files.find(f => f.status === 'queued');
    if (!nextFile?.file) return;

    setActiveUploads(count => count + 1);
    setFiles(prevFiles => 
      prevFiles.map(f => 
        f.id === nextFile.id ? { ...f, status: 'uploading' } : f
      )
    );

    handleFileUpload(nextFile.id, nextFile.file)
      .then(url => {
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === nextFile.id
              ? { ...f, status: 'completed', url, progress: 100 }
              : f
          )
        );
      })
      .catch(() => {
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === nextFile.id ? { ...f, status: 'failed' } : f
          )
        );
      })
      .finally(() => {
        setActiveUploads(count => count - 1);
        processQueue(); // Process next file
      });
  }, [files, activeUploads, handleFileUpload]);

  // Process queue whenever files or activeUploads change
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
          a.click();
          // Don't revoke URL if we might download again
        }
        break;

      case 'replace':
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
          const newFile = (e.target as HTMLInputElement).files?.[0];
          if (newFile) {
            // Revoke old URL if exists
            if (file.url) URL.revokeObjectURL(file.url);

            setFiles(prevFiles =>
              prevFiles.map(f =>
                f.id === fileId
                  ? {
                      ...f,
                      name: newFile.name,
                      size: newFile.size,
                      type: newFile.type.split('/')[1]?.toUpperCase() ||
                           newFile.name.split('.').pop()?.toUpperCase() ||
                           'FILE',
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
        if (file.url) URL.revokeObjectURL(file.url);
        setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
        break;
    }
  }, [files]);

  const filteredFiles = files.filter(file =>
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
