import { Types } from 'mongoose';

export interface SafeUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  // add other safe fields if needed
}

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}
