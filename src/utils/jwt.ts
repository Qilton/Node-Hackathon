import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

export function signJwt(payload: object, expiresIn: jwt.SignOptions['expiresIn'] = '1h'): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn });
}

export function verifyJwt(token: string): object | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded;
    }
    return null;
  } catch (err) {
    return null;
  }
}
