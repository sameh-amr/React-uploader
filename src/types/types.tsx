export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'queued' | 'uploading' | 'completed' | 'failed';
  progress: number;
  file?: File;
  url?: string;
  error?:string;
}
export interface FileTableRowProps {
  file: UploadedFile;
  onAction: (action: FileAction, fileId: string) => void;
}

export type FileAction = 'download' | 'replace' | 'delete';
