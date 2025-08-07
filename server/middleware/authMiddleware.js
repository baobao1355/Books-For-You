const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches userId to req.user
    next();
  } catch (err) {
    console.error('[AUTH MIDDLEWARE ERROR]', err);
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
