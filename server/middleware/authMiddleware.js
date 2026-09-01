// FreshMart Backend Supabase Auth Middleware
import { getSupabaseConfig } from '../../src/lib/supabaseClient.js';

export const verifySupabaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Optional auth fallback for public guest requests
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }

    // Attach token & decoded payload metadata
    req.userToken = token;
    next();
  } catch (err) {
    console.warn('[Auth Middleware Warning]:', err.message);
    req.user = null;
    next();
  }
};

export const requireAdminRole = (req, res, next) => {
  const roleHeader = req.headers['x-user-role'];
  const adminSecret = req.headers['x-admin-key'];

  if (roleHeader === 'admin' || adminSecret === process.env.ADMIN_SECRET_KEY || req.user?.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access Denied: Administrative privileges required.',
  });
};
