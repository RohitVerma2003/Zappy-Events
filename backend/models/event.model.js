import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "VENDOR_ARRIVED",
        "STARTED",
        "SETUP_COMPLETED",
        "COMPLETED"
      ],
      default: "CREATED"
    },

    arrival: {
      location: {
        lat: Number,
        lon: Number
      },
      image: String,
      arrivedAt: Date
    },

    setup: {
      pre: {
        image: String,
        note: String,
        uploadedAt: Date
      },
      post: {
        image: String,
        note: String,
        uploadedAt: Date
      }
    },

    completedAt: Date
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
