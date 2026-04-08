const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const { put } = require('@vercel/blob');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

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

module.exports = app;
