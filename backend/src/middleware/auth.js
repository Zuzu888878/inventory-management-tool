import { verifyAuthToken } from '../utils/authTokens.js';

const authMiddleware = (req, res, next) => {
  const apiToken = process.env.API_TOKEN;

  if (!apiToken) {
    return res.status(503).json({ message: 'Authentication is not configured.' });
  }

  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No authorization header provided.' });
  }

  const [scheme, token, extra] = authHeader.split(' ');
  const user = scheme === 'Bearer' && !extra ? verifyAuthToken(token) : null;
  if (!user) {
    return res.status(403).json({ message: 'Invalid token.' });
  }

  req.user = user;
  next();
};

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
    next();
  };

export default authMiddleware;
