const jwt = require('jsonwebtoken');

const authenticateToken = (request) => {
  // Get authorization header from Next.js request
  const authHeader = request.headers.get('authorization');
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token ? 'Present' : 'Missing');

  if (!token) {
    throw new Error('Access token required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded user:', decoded);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    throw new Error('Invalid token');
  }
};

module.exports = { authenticateToken };
