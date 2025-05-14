import { UploadedFile } from '../../types/types';
import { FileAction } from '../../types/types';
import { FiDownload, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

interface FileTableRowProps {
  file: UploadedFile;
  onAction: (action: FileAction, fileId: string) => void;
}

export const FileTableRow = ({ file, onAction }: FileTableRowProps) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{file.type}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{file.name}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{formatSize(file.size)}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {file.uploadedAt.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">-</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onAction('download', file.id)}
            className="p-1 text-blue-500 hover:text-blue-700"
            title="Download"
          >
            <FiDownload />
          </button>
          <button
            onClick={() => onAction('replace', file.id)}
            className="p-1 text-yellow-500 hover:text-yellow-700"
            title="Replace"
          >
            <FiRefreshCw />
          </button>
          <button
            onClick={() => onAction('delete', file.id)}
            className="p-1 text-red-500 hover:text-red-700"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};