import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export const authGql = (req: Request, res: Response, next: NextFunction) => {
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

export const authRest = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('Access denied');
  }
  try {
    jwt.verify(token, process.env.SECRET || '');
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};
