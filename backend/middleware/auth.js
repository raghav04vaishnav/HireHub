const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const secretKey = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
    try {
        if (!secretKey) {
            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }

        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token is required"
            });
        }

        const decoded = jwt.verify(token, secretKey);

        if (!decoded.id) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const userDetails = await userModel
            .findById(decoded.id)
            .select("-password");

        if (!userDetails) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }

        req.user = userDetails;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};

module.exports = { protect, authorizeRole };
