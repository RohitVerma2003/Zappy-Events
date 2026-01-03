import dotenv from "dotenv";

import { connectToMongoDB } from "./database/connect.js";
import { User } from "./models/user.model.js";
import { Vendor } from "./models/vendor.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const user = { name: "User", email: "exampleuser@gmail.com", password: "exmaple@123" }
const vendor = { name: "Vendor", email: "exmaplevendor@gmail.com", password: "exmaple@123" }


const seedUserAndVendor = async () => {
    try {
        await connectToMongoDB();

        const userName = user.name;
        const userEmail = user.email;

        const userExists = await User.findOne({ email: userEmail });

        if (!userExists) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const newUser = await User.create({
                name: userName,
                email: userEmail,
                password: hashedPassword,
            });

            console.log("✅ User created:", {
                name: newUser.name,
                email: newUser.email,
            });
        }

        const vendorName = vendor.name;
        const vendorEmail = vendor.email;

        const vendorExists = await Vendor.findOne({ email: vendorEmail });

        if (!vendorExists) {
            const hashedPassword = await bcrypt.hash(vendor.password, 10);

            const newVendor = await Vendor.create({
                name: vendorName,
                email: vendorEmail,
                password: hashedPassword,
                isVerified: true
            });

            console.log("✅ Vendor created:", {
                name: newVendor.name,
                email: newVendor.email,
            });
        }

        console.log("🎉 Template data seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
};

seedUserAndVendor();
