import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        isVerified: {
            type: Boolean,
            default: true
        },

        lastLoginAt: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true
    }
);

export const Vendor = mongoose.model("Vendor", vendorSchema);
