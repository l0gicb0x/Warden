import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.SUPABASE_JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Strict auth middleware: requires a valid JWT, throws 401 if missing/invalid
 */
export const requireAuth = (req, res, next) => {
  const token = extractToken(req);
  
  if (!token) {
    return next(new ApiError(401, 'Unauthorized: Missing or invalid Authorization header'));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new ApiError(401, 'Unauthorized: Invalid or expired token'));
  }

  req.user = decoded;
  next();
};

/**
 * Optional auth middleware: attaches req.user if a valid JWT is present,
 * but allows the request to proceed if no token is found.
 */
export const optionalAuth = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
};
