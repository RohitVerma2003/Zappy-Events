import nodemailer from "nodemailer";

const sendOtpEmail = async (toEmail, otp, purpose = "OTP Verification") => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: `"Zappy Events"`,
            to: toEmail,
            subject: `Your ${purpose} OTP`,
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>${purpose}</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>If you didn’t request this, please ignore.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);

        console.log(`📧 OTP sent to ${toEmail} | OTP: ${otp}`);
        return true;
    } catch (error) {
        console.error("Email OTP error:", error);
        return false;
    }
};

export default sendOtpEmail;
