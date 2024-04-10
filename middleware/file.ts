import path from 'path';
import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';

const uploadPath = path.resolve('/tmp/uploads');

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, callback) => {
    callback(
      null,
      `${Date.now().toString()}-${file.originalname.split(' ').join('_')}`,
    );
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
      return callback(new Error("Only images and pdf's are allowed"));
    }
    const mimeType = file.mimetype;
    if (
      mimeType !== 'image/png' &&
      mimeType !== 'image/jpg' &&
      mimeType !== 'image/jpeg' &&
      mimeType !== 'application/pdf'
    ) {
      return callback(new Error("Only images and pdf's are allowed"));
    }
    callback(null, true);
  },
}).single('file');

export const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err) {
    res.status(400).json({ message: err.message });
  } else {
    next();
  }
};
