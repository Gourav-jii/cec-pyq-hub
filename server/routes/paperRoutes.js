import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { Paper } from '../models/Paper.js';

const router = express.Router();

// Configure multer (memory storage for stream upload to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

// Helper: Stream buffer to Cloudinary
function uploadStreamToCloudinary(buffer, fileName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'cec_pyq_hub',
        resource_type: 'auto',
        public_id: `${Date.now()}_${fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_') : 'paper'}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

// 1. GET /api/papers - Get all papers from MongoDB
router.get('/', async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json({ success: true, count: papers.length, papers });
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching papers' });
  }
});

// 2. POST /api/papers/upload - Upload file to Cloudinary & save metadata in MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const {
      subjectName,
      subjectCode,
      branch,
      branchName,
      semester,
      examType,
      year,
      uploaderName,
      uploaderEmail,
    } = req.body;

    if (!subjectName || !branch || !semester || !year) {
      return res.status(400).json({
        success: false,
        message: 'Subject Name, Branch, Semester, and Year are required fields',
      });
    }

    let fileUrl = '';
    let cloudinaryPublicId = '';
    let fileName = '';
    let fileType = 'application/pdf';
    let fileSize = 0;

    const hasCloudinary = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (req.file) {
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
      fileSize = req.file.size;

      if (hasCloudinary) {
        // Upload file buffer directly to Cloudinary
        const cloudinaryResult = await uploadStreamToCloudinary(req.file.buffer, fileName);
        fileUrl = cloudinaryResult.secure_url;
        cloudinaryPublicId = cloudinaryResult.public_id;
      } else {
        // Store directly in MongoDB until Cloudinary credentials are provided
        fileUrl = `data:${fileType};base64,${req.file.buffer.toString('base64')}`;
      }
    } else if (req.body.fileDataUrl) {
      if (hasCloudinary) {
        const uploadRes = await cloudinary.uploader.upload(req.body.fileDataUrl, {
          folder: 'cec_pyq_hub',
          resource_type: 'auto',
        });
        fileUrl = uploadRes.secure_url;
        cloudinaryPublicId = uploadRes.public_id;
      } else {
        fileUrl = req.body.fileDataUrl;
      }
      fileName = req.body.fileName || `${subjectName.replace(/\s+/g, '_')}_${year}.pdf`;
      fileType = req.body.fileType || 'application/pdf';
    } else {
      return res.status(400).json({
        success: false,
        message: 'PDF or Image file is required for question paper upload',
      });
    }

    // Save paper metadata to MongoDB
    const newPaper = await Paper.create({
      subjectName,
      subjectCode: subjectCode || '',
      branch,
      branchName: branchName || branch.toUpperCase(),
      semester: Number(semester),
      examType: examType || 'end-sem',
      year,
      fileUrl,
      cloudinaryPublicId,
      fileName,
      fileType,
      fileSize,
      uploaderName: uploaderName || 'CEC Student',
      uploaderEmail: uploaderEmail || '',
    });

    res.status(201).json({
      success: true,
      message: 'Paper uploaded to Cloudinary & saved in MongoDB successfully!',
      paper: newPaper,
    });
  } catch (error) {
    console.error('Error uploading paper:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload paper to Cloudinary/MongoDB',
    });
  }
});

// 3. DELETE /api/papers/:id - Delete paper from MongoDB & Cloudinary
router.delete('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Question paper not found' });
    }

    // Remove from Cloudinary if public ID exists
    if (paper.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(paper.cloudinaryPublicId);
      } catch (cErr) {
        console.warn('Cloudinary destroy error (non-fatal):', cErr.message);
      }
    }

    await paper.deleteOne();
    res.json({ success: true, message: 'Paper deleted successfully' });
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ success: false, message: 'Failed to delete paper' });
  }
});

// 4. GET /api/papers/:id/download - Reliable download proxy for PDFs & images
router.get('/:id/download', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Question paper not found' });
    }

    const safeFilename = (paper.fileName || `${paper.subjectName}_${paper.year}.pdf`).replace(/[^a-zA-Z0-9._-]/g, '_');

    // Case 1: Base64 data URL
    if (paper.fileUrl && paper.fileUrl.startsWith('data:')) {
      const matches = paper.fileUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', matches[1]);
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        return res.send(buffer);
      }
    }

    // Case 2: Remote / Cloudinary URL
    if (paper.fileUrl) {
      let fileRes = await fetch(paper.fileUrl);

      // If Cloudinary 401s (restricted delivery for raw PDF), fallback to rendered PNG
      if (!fileRes.ok && paper.fileUrl.match(/\.pdf$/i)) {
        const pngUrl = paper.fileUrl.replace(/\.pdf$/i, '.png');
        fileRes = await fetch(pngUrl);
        if (fileRes.ok) {
          const arrayBuffer = await fileRes.arrayBuffer();
          const pngFilename = safeFilename.replace(/\.pdf$/i, '.png');
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Content-Disposition', `attachment; filename="${pngFilename}"`);
          return res.send(Buffer.from(arrayBuffer));
        }
      }

      if (fileRes.ok) {
        const arrayBuffer = await fileRes.arrayBuffer();
        res.setHeader('Content-Type', fileRes.headers.get('content-type') || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        return res.send(Buffer.from(arrayBuffer));
      }
    }

    // Fallback: Text info file
    const content = `CEC PYQ HUB - CHAIBASA ENGINEERING COLLEGE\nSubject: ${paper.subjectName}\nBranch: ${paper.branchName}\nSemester: ${paper.semester}\nYear: ${paper.year}\nUploaded by: ${paper.uploaderName}`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${paper.subjectName}_info.txt"`);
    res.send(content);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: 'Failed to download paper file' });
  }
});

export default router;

