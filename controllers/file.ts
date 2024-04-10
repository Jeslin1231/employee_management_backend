import type { Request, Response } from 'express';

export const handleFile = (req: Request, res: Response) => {
  res.json({ file: req.file });
};
