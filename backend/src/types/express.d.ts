import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}