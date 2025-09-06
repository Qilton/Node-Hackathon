import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyJwt(token);
  if (!payload) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
  // @ts-ignore
  req.user = payload;
  next();
}
