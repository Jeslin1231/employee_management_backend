import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token') || '';
  try {
    const decoded = jwt.verify(token, process.env.SECRET || '');
    req.headers['x-authorized'] = 'true';
    if (typeof decoded === 'string') {
      req.headers['x-decoded-id'] = decoded;
    } else {
      req.headers['x-decoded-id'] = decoded.id;
    }
    next();
  } catch (error) {
    next();
  }
};
