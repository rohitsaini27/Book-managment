const jwt = require("jsonwebtoken");
const User = require("../schemas/user.schema"); // Assuming this is your user schema

async function authVerification(req, res, next) {
  let token;
  // Check if authorization header exists and is in the correct format
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      
      // Fetch user details based on decoded user id
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(404).send('User not found');
      }
      
      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).send('Authentication failed, please login again!');
    }
  } else {
    // Handle case where authorization header is missing or in invalid format
    return res.status(401).send('Not authorized');
  }
}

module.exports = authVerification;
