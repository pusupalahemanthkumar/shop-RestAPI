// Importing Package 
const jwt = require('jsonwebtoken');

// Checking For Authentication Process
module.exports = (req, res, next) => {
    try {
        //Getting The Token here
        const token = req.headers.authorization.split(" ")[1];
        // Verfying The token and Returning The Decoded Token here
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) { /// if failed  then goes into catch block
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};  