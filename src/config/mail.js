import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true, // Cổng 465 bắt buộc là true
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn (lấy từ .env)
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng 16 ký tự (lấy từ .env)
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    const data = await transporter.sendMail({
      from: "JUST.engineer",
      to: to,
      subject: subject,
      html: html,
    });

    return data;
  } catch (error) {
    console.error(
      `[Resend Error] Failed to send email to ${to}:`,
      error.message,
    );

    throw error;
  }
};
