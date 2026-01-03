
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { User } from '../models/user.model.js';
import { Vendor } from '../models/vendor.model.js';
configDotenv();

export const userAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Access Denied. Invalid token." });
        }

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Access Denied. User not found." });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Error in protected route middleware: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const vendorAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Access Denied. Invalid token." });
        }

        const vendor = await Vendor.findById(decoded._id).select("-password");

        if (!vendor) {
            return res.status(401).json({ message: "Access Denied. User not found." });
        }

        req.vendor = vendor;
        next();
    } catch (err) {
        console.log("Error in protected route middleware: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}