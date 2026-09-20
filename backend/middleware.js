const authMiddleware = (req, res, next) => {
  const apiToken = process.env.API_TOKEN;

  if (!apiToken) {
    return res.status(503).json({ message: 'Authentication is not configured.' });
  }

  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No authorization header provided.' });
  }

  const expectedToken = `Bearer ${apiToken}`;

  if (authHeader !== expectedToken) {
    return res.status(403).json({ message: 'Invalid token.' });
  }

  next();
};

export default authMiddleware;
