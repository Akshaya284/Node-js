const jwt = require("jsonwebtoken");
const Session = require('../Models/sessionModel')

function authenticateToken(req, res, next) {  
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1] 

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "process.env.TOKEN_SECRET", (err, decodedToken) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    const userId = decodedToken.userId;
    const sessionId = decodedToken.sessionId

    Session.findOne({ _id: sessionId, userId, status: "active" })
      .then((session) => {
        if (!session) {
          return res.status(401).json({ message: "Unauthorized." });
        }

        req.user = { userId, sessionId };
        next();
      })
      .catch((error) => {
        console.error("Error validating session:", error);
        return res.sendStatus(500);
      });
  })
}

function generateAccessToken(userId, sessionId) {
  return jwt.sign({ userId, sessionId }, "process.env.TOKEN_SECRET", {
    expiresIn: "1h",
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
