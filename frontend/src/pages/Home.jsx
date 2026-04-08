import React, { useState } from 'react';
import { Share2, FileScan } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import QRScanner from '../components/QRScanner';
import FileList from '../components/FileList';

const Home = () => {
  const [activeTab, setActiveTab] = useState('share'); // 'share' or 'scan'
  const [uploadedData, setUploadedData] = useState(null);

  const handleUploadSuccess = (data) => {
    setUploadedData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5 shadow-sm">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              DropLink
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 rounded-xl bg-gray-200/60 p-1 shadow-inner relative">
            <button
              onClick={() => setActiveTab('share')}
              className={`flex items-center px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 z-10 ${
                activeTab === 'share'
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-900/5'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Share2 className="w-4 h-4 mr-2" /> Share Files
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 z-10 ${
                activeTab === 'scan'
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-900/5'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileScan className="w-4 h-4 mr-2" /> Receive
            </button>
          </div>
        </div>

        {activeTab === 'share' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Upload Files</h2>
                  <p className="mt-2 text-gray-500 text-sm">Upload files and get a QR code instantly.</p>
                </div>
                <UploadBox onUploadSuccess={handleUploadSuccess} />
                
                {uploadedData && uploadedData.qrCode && (
                  <div className="mt-10 border-t border-gray-100 pt-8 animate-in fade-in zoom-in duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">Scan to Access</h3>
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <img 
                          src={uploadedData.qrCode} 
                          alt="Generated QR Code" 
                          className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {uploadedData && uploadedData.fileUrls && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FileList files={uploadedData.fileUrls} />
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
            <QRScanner />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
