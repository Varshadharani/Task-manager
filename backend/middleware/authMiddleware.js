const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in the database to ensure it exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Access denied.' });
    }

    req.user = user; // Attach the complete user object to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token. Access denied.' });
  }
};

module.exports = authMiddleware;
