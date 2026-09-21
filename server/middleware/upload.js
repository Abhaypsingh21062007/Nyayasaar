import multer from 'multer';
import path from 'path';
import { config } from '../config/index.js';

// Memory storage keeps files strictly in RAM — no sensitive unencrypted files on disk
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isPdfExt = config.allowedExtensions.includes(ext);
  const isPdfMime = config.allowedMimeTypes.includes(mime);

  if (!isPdfExt || !isPdfMime) {
    const error = new Error('Invalid file type. Only PDF documents are supported.');
    error.code = 'INVALID_FILE_TYPE';
    error.statusCode = 400;
    return cb(error, false);
  }

  cb(null, true);
}

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize,
    files: 1,
  },
  fileFilter,
});

/**
 * Middleware that handles single file uploads from either 'file' or 'document' form field
 */
export function uploadPdfMiddleware(req, res, next) {
  // Try 'file' first, then fallback to 'document'
  upload.single('file')(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (req.file) {
      return next();
    }
    // If not found in 'file', try 'document'
    upload.single('document')(req, res, (err2) => {
      if (err2) {
        return next(err2);
      }
      next();
    });
  });
}
