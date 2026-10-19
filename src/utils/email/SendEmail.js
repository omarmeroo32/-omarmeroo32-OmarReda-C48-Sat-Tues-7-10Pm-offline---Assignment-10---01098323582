import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
    const emailUser = process.env.EMAIL;
    const emailPass = process.env.PASS_EMAIL;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    const info = await transporter.sendMail({
        from: `"sarahaApp" <${emailUser}>`,
        to,
        subject,
        html
    });

    return info;
};