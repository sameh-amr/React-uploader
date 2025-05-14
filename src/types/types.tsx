export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'queued' | 'uploading' | 'completed' | 'failed';
  progress: number;
  file?: File;
  url?: string; // Will be object URL for in-app storage
}

export type FileAction = 'download' | 'replace' | 'delete';