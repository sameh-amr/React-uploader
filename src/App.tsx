import { FileUploader } from './components/FileUploader/FileUploader';
import { FilterInput } from './components/FilterInput/FilterInput';
import { FileTable } from './components/FileTable/FileTable';
import { useFileUpload } from './hooks/useFileUpload';

function App() {
  const { files, addFiles, handleAction, filter, setFilter, activeUploads } = useFileUpload();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">File Uploader</h1>
        
        <div className="mb-8">
          <FileUploader onFilesSelected={addFiles} />
          {activeUploads > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              Uploading {activeUploads} file(s) (max 3 concurrently)
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <FilterInput value={filter} onChange={setFilter} />
        </div>
        
        {files.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <FileTable files={files} onAction={handleAction} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No files uploaded yet. Drag and drop files above to get started.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;