import React from 'react';
import { FileSymlink, Copy, Download, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FileList = ({ files }) => {
  if (!files || files.length === 0) return null;

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const handleDownload = (url, name) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    files.forEach(file => handleDownload(file.url, file.name));
    toast.success(`Downloading ${files.length} files...`);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="text-green-500 h-5 w-5" /> 
          Uploaded Files ({files.length})
        </h3>
        {files.length > 1 && (
          <button
            onClick={handleDownloadAll}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Download All
          </button>
        )}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file, idx) => (
          <div key={idx} className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between space-x-3">
              <div className="flex bg-indigo-50 p-2 rounded-lg items-center justify-center">
                <FileSymlink className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {file.size ? (file.size / 1024 / 1024).toFixed(2) : 'Unknown'} MB
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => copyToClipboard(file.url)}
                className="flex flex-1 items-center justify-center rounded-md bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 transition-colors"
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
              </button>
              <button
                onClick={() => handleDownload(file.url, file.name)}
                className="flex flex-1 items-center justify-center rounded-md bg-indigo-50 px-2 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" /> Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
