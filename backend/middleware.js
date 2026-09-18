const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No authorization header provided.' });
    }

    const expectedToken = `Bearer ${process.env.API_TOKEN}`;

    if (authHeader !== expectedToken) {
        return res.status(403).json({ message: 'Invalid token.' });
    }

    next();
};

export default authMiddleware;