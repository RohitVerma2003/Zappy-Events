import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateTokenAndSignCookies } from "../utils/generateToken.js";
import { Vendor } from "../models/vendor.model.js";
import { Event } from "../models/event.model.js";
import { OTP } from "../models/otp.model.js";
import sendOtpEmail from "../utils/sendEmail.js";

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateTokenAndSignCookies(res, { _id: user._id, name: user.name, email: user.email })

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("User login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const createEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const { vendorId } = req.body;

        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: "Vendor ID is required"
            });
        }

        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        const event = await Event.create({
            userId,
            vendorId,
            status: "CREATED"
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const sendArrivalOtpToUser = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user._id;

        const event = await Event.findOne({ _id: eventId, userId });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.status !== "VENDOR_ARRIVED") {
            return res.status(400).json({
                success: false,
                message: "Vendor has not arrived yet"
            });
        }

        const user = await User.findById(userId);
        if (!user || !user.email) {
            return res.status(400).json({
                success: false,
                message: "User email not found"
            });
        }

        await OTP.deleteMany({
            eventId,
            type: "ARRIVAL",
            verified: false
        });

        const otpCode = generateOTP();

        await OTP.create({
            eventId,
            otp: otpCode,
            type: "ARRIVAL",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendOtpEmail(user.email, otpCode, "Arrival Verification");

        res.status(200).json({
            success: true,
            message: "Arrival OTP sent to your email"
        });
    } catch (error) {
        console.error("Send arrival OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const sendCompletionOtpToUser = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user._id;

        const event = await Event.findOne({ _id: eventId, userId });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.status !== "SETUP_COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "Event setup not completed yet"
            });
        }

        const user = await User.findById(userId);
        if (!user || !user.email) {
            return res.status(400).json({
                success: false,
                message: "User email not found"
            });
        }

        await OTP.deleteMany({
            eventId,
            type: "COMPLETION",
            verified: false
        });

        const otpCode = generateOTP();

        await OTP.create({
            eventId,
            otp: otpCode,
            type: "COMPLETION",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendOtpEmail(user.email, otpCode, "Completion Verification");

        res.status(200).json({
            success: true,
            message: "Completion OTP sent to your email"
        });
    } catch (error) {
        console.error("Send completion OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getUserEvents = async (req, res) => {
    try {
        const userId = req.user._id;

        const events = await Event.find({ userId })
            .populate({
                path: "vendorId",
                select: "name companyName initials"
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        console.error("Get user events error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getUserEventById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      userId
    }).populate({
      path: "vendorId",
      select: "name email _id"
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error("Get user event error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};