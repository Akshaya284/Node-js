const jwt = require("jsonwebtoken");
const Session = require('../Models/sessionModel')

function authenticateToken(req, res, next) {  
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1] 
  
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, "process.env.TOKEN_SECRET", (err, decodedToken) => {
    console.log(err);
    if (err) return res.sendStatus(403).json({ message: "Token validation failed." });

    const { userId, sessionId, role } = decodedToken;

    Session.findOne({ _id: sessionId, userId, status: "active" })
      .then((session) => {
        if (!session) {
          return res.status(401).json({ message: "Unauthorized." });
        }

        req.user = { userId, sessionId, role };
        next()
        
      })
      .catch((error) => {
        console.error("Error validating session:", error);
        return res.sendStatus(500).json({ message: "Internal server error." });
      });
  })
}

function generateAccessToken(userId, sessionId, role) {
  return jwt.sign({ userId, sessionId, role }, "process.env.TOKEN_SECRET", {
    expiresIn: "1h",
  });
}



module.exports = {
  authenticateToken,
  generateAccessToken,
};
