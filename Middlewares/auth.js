const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {  
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1] 

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "process.env.TOKEN_SECRET", (err, decodedToken) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    const userId = decodedToken.userId;
    req.user = { data: userId };
    next();
  });
}

function generateAccessToken(userId) {
  return jwt.sign({ userId: userId }, "process.env.TOKEN_SECRET", {
    expiresIn: "1h",
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
