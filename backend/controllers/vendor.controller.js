import { Event } from "../models/event.model.js";
import { OTP } from "../models/otp.model.js";
import { Vendor } from "../models/vendor.model.js";

import bcrypt from "bcryptjs";
import { generateTokenAndSignCookies } from "../utils/generateToken.js";

export const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const vendor = await Vendor.findOne({ email }).select("+password");

        if (!vendor) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, vendor.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateTokenAndSignCookies(res, { _id: vendor._id, name: vendor.name, email: vendor.email })

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            vendor: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email
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

export const vendorArrived = async (req, res) => {
    try {
        const vendorId = req.vendor._id;
        const { eventId, latitude, longitude } = req.body;
        console.log(req.file)
        console.log({ eventId, latitude, longitude })

        if (!eventId || !latitude || !longitude || !req.file) {
            return res.status(400).json({
                success: false,
                message: "Event ID, latitude, longitude and image are required"
            });
        }

        const event = await Event.findOne({
            _id: eventId,
            vendorId
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or unauthorized"
            });
        }

        if (event.status !== "CREATED") {
            return res.status(400).json({
                success: false,
                message: "Vendor arrival already marked"
            });
        }

        const imagePath = `/uploads/arrival/${req.file.filename}`;

        event.arrival = {
            location: {
                lat: latitude,
                lon: longitude
            },
            image: imagePath,
            arrivedAt: new Date()
        };

        event.status = "VENDOR_ARRIVED";

        await event.save();

        res.status(200).json({
            success: true,
            message: "Vendor arrival marked successfully",
            event
        });
    } catch (error) {
        console.error("Vendor arrival error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const verifyArrivalOtp = async (req, res) => {
    try {
        const vendorId = req.vendor._id;
        const { eventId, otp } = req.body;

        if (!eventId || !otp) {
            return res.status(400).json({
                success: false,
                message: "Event ID and OTP are required"
            });
        }

        const event = await Event.findOne({
            _id: eventId,
            vendorId
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or unauthorized"
            });
        }

        if (event.status !== "VENDOR_ARRIVED") {
            return res.status(400).json({
                success: false,
                message: "Arrival OTP cannot be verified at this stage"
            });
        }

        const otpDoc = await OTP.findOne({
            eventId,
            otp,
            type: "ARRIVAL",
            verified: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        otpDoc.verified = true;
        await otpDoc.save();

        event.status = "STARTED";
        await event.save();

        res.status(200).json({
            success: true,
            message: "Arrival OTP verified. Event started.",
            event
        });
    } catch (error) {
        console.error("Verify arrival OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const verifyCompletionOtp = async (req, res) => {
    try {
        const vendorId = req.vendor._id;
        const { eventId, otp } = req.body;

        if (!eventId || !otp) {
            return res.status(400).json({
                success: false,
                message: "Event ID and OTP are required"
            });
        }

        const event = await Event.findOne({
            _id: eventId,
            vendorId
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or unauthorized"
            });
        }

        if (event.status !== "SETUP_COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "Completion OTP cannot be verified at this stage"
            });
        }

        const otpDoc = await OTP.findOne({
            eventId,
            otp,
            type: "COMPLETION",
            verified: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        otpDoc.verified = true;
        await otpDoc.save();

        event.status = "COMPLETED";
        event.completedAt = new Date();
        await event.save();

        res.status(200).json({
            success: true,
            message: "Completion OTP verified. Event completed.",
            event
        });
    } catch (error) {
        console.error("Verify completion OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const setupCompleted = async (req, res) => {
    try {
        const vendorId = req.vendor._id;
        const { eventId, preNote, postNote } = req.body;

        if (!req.files?.pre || !req.files?.post) {
            return res.status(400).json({
                success: false,
                message: "Pre and post setup images are required"
            });
        }

        const event = await Event.findOne({
            _id: eventId,
            vendorId
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or unauthorized"
            });
        }

        if (event.status !== "STARTED") {
            return res.status(400).json({
                success: false,
                message: "Setup can only be completed after event start"
            });
        }

        const preImagePath = `/uploads/setup/${req.files.pre[0].filename}`;
        const postImagePath = `/uploads/setup/${req.files.post[0].filename}`;

        event.setup = {
            pre: {
                image: preImagePath,
                note: preNote || "",
                uploadedAt: new Date()
            },
            post: {
                image: postImagePath,
                note: postNote || "",
                uploadedAt: new Date()
            }
        };

        event.status = "SETUP_COMPLETED";

        await event.save();

        res.status(200).json({
            success: true,
            message: "Setup completed successfully",
            event
        });
    } catch (error) {
        console.error("Setup completed error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getVendorEvents = async (req, res) => {
    try {
        const vendorId = req.vendor._id;

        const events = await Event.find({ vendorId })
            .populate({
                path: "userId",
                select: "name email _id "
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

export const getVendorEventById = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      vendorId
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