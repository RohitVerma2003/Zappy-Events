import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    otp: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["ARRIVAL", "COMPLETION"],
      required: true
    },

    expiresAt: {
      type: Date,
      required: true
    },

    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const OTP = mongoose.model("OTP", otpSchema);
