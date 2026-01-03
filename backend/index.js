import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectToMongoDB } from "./database/connect.js";

import userRoutes from "./routes/user.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/uploads", express.static("uploads"));

app.use("/api", userRoutes);
app.use("/api", vendorRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Zappy Vendor Event Tracker API is running 🚀"
    });
});

app.use((err, req, res, next) => {
    console.error("Global error:", err.message);

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`App is running at: `, PORT)
})

