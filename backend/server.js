const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Setup uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Ensure static access to uploads
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create an endpoint to upload files
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const host = req.protocol + '://' + req.get('host');
    
    const fileUrls = req.files.map(file => {
      return `${host}/uploads/${file.filename}`;
    });

    // Create a special landing page URL or just use the first file for QR code
    // Let's create a generic JSON payload for the QR to point to or direct url
    // To satisfy requirement: "User uploads a file -> gets QR -> saves QR -> uploads QR later -> app decodes QR -> file downloads"
    // The easiest is to put a direct link to a download page or primary file URL into the QR.
    // If there are multiple files, maybe point to the first one, or point to an API that downloads all.
    // Let's just point the QR simply to the first file's download URL.
    const qrDataUrl = fileUrls.length === 1 ? fileUrls[0] : JSON.stringify(fileUrls);

    const qrCodeImage = await QRCode.toDataURL(qrDataUrl);

    res.json({
      fileUrls: fileUrls.map((url, i) => ({
        url,
        name: req.files[i].originalname,
        size: req.files[i].size,
        mimetype: req.files[i].mimetype
      })),
      qrCode: qrCodeImage,
      qrData: qrDataUrl
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process files and generate QR code' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
