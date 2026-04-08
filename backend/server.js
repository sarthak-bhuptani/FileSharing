const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const { put } = require('@vercel/blob');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*' // Allow all origins for the Vercel deployment
}));
app.use(express.json());

// Configure multer for memory storage since Vercel is serverless
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create an endpoint to upload files
app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Upload each file to Vercel Blob
    const uploadPromises = req.files.map(async (file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const uniqueFilename = `${uniqueSuffix}-${file.originalname}`;
      
      const blob = await put(uniqueFilename, file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      return {
        url: blob.url,
        name: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    const fileUrls = uploadedFiles.map(f => f.url);

    // Create a generic JSON payload for the QR
    const qrDataUrl = fileUrls.length === 1 ? fileUrls[0] : JSON.stringify(fileUrls);
    const qrCodeImage = await QRCode.toDataURL(qrDataUrl);

    res.json({
      fileUrls: uploadedFiles,
      qrCode: qrCodeImage,
      qrData: qrDataUrl
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process files and generate QR code' });
  }
});

// Important for Vercel deployment
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}
