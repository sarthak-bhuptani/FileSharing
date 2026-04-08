import React, { useRef, useState } from 'react';
import jsQR from 'jsqr';
import { QrCode, Upload, Link as LinkIcon, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const [scannedUrl, setScannedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScannedUrl(code.data);
          toast.success('QR Code decoded successfully!');
        } else {
          toast.error('No QR code found in the image.');
        }
        setIsProcessing(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const downloadFile = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.substring(url.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="rounded-full bg-indigo-50 p-4">
          <QrCode className="h-8 w-8 text-indigo-600" />
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Decode QR Code</h2>
          <p className="mt-1 text-sm text-gray-500">Upload a QR image to reveal the hidden URL</p>
        </div>

        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isProcessing}
          className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Upload className="mr-2 h-5 w-5" />
          )}
          Upload QR Image
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        {scannedUrl && (
          <div className="w-full space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-sm font-medium text-gray-900">Extracted URL</h3>
            <div className="flex items-center space-x-2 rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200">
              <LinkIcon className="h-5 w-5 text-gray-400 shrink-0" />
              <p className="truncate text-sm text-gray-600">{scannedUrl}</p>
            </div>
            <div className="flex gap-3">
              <a 
                href={scannedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                title="Open Link"
              >
                Open link
              </a>
              <button 
                onClick={() => downloadFile(scannedUrl)}
                className="flex flex-1 items-center justify-center rounded-md bg-indigo-50 text-indigo-700 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                <Download className="mr-1 h-4 w-4" /> Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
