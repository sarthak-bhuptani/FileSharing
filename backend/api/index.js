const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const { put } = require('@vercel/blob');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Robust CORS for Mobile/Cross-Origin support on Vercel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => res.send('DropLink Backend is Running! Visit /api/health for status.'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log(`Received ${req.files.length} files for upload`);

    const isProduction = !!process.env.BLOB_READ_WRITE_TOKEN;
    const host = req.protocol + '://' + req.get('host');

    const uploadPromises = req.files.map(async (file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const uniqueFilename = `${uniqueSuffix}-${file.originalname}`;
      
      if (isProduction) {
        const blob = await put(uniqueFilename, file.buffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        return { url: blob.url, name: file.originalname, size: file.size, mimetype: file.mimetype };
      } else {
        // LOCAL FALLBACK: Save to disk
        const localUploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(localUploadsDir)) {
          fs.mkdirSync(localUploadsDir, { recursive: true });
        }
        const filePath = path.join(localUploadsDir, uniqueFilename);
        fs.writeFileSync(filePath, file.buffer);
        return { 
          url: `${host}/uploads/${uniqueFilename}`, 
          name: file.originalname, 
          size: file.size, 
          mimetype: file.mimetype 
        };
      }
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
    res.status(500).json({ error: error.message || 'Failed to process files' });
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend running locally on http://localhost:${PORT}`);
  });
}
