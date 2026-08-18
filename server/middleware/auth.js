import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'careerpulse_secure_jwt_secret_key_2026';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      req.userId = decoded.id;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
  }

  // If request has no auth token, use anonymous guest scope
  req.userId = 'anonymous';
  next();
};

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};
