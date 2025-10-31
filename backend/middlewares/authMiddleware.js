const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get User from Token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorised, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "No authorised, no Token" });
    }
};

module.exports = { protect };