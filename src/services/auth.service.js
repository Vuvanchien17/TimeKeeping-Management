import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { HttpError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { success } from "zod";
import redisClient from "../config/redis.js";
import otpTemplate from "../utils/templateOTP.js";
import { sendMail } from "../config/mail.js";

// function SignUp
export const signUpService = async (email, password) => {
  // check email exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (user) {
    throw new HttpError(409, "Tài khoản đã được sử dụng");
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: email,
      passwordHash: passwordHash,
    },
  });

  return newUser;
};

// function SignIn
export const signInService = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: { employee: true },
  });

  if (!user) {
    throw new HttpError(401, "Tài khoản, mật khẩu không chính xác");
  }

  const isMatchPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isMatchPassword) {
    throw new HttpError(401, "Tài khoản, mật khẩu không chính xác");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      email: user.email,
      employeeId: user.employee.id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_TTL },
  );

  const token = crypto.randomBytes(64).toString("hex");
  const refreshToken = await prisma.refreshToken.create({
    data: {
      token: token,
      expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_TTL)),
      userId: user.id,
    },
  });

  return {
    accessToken,
    refreshToken: refreshToken.token,
    user: { id: user.id, role: user.role, email: user.email },
  };
};

// function ChangePassword
export const changePasswordService = async (
  email,
  passwordOld,
  newPassword,
  confirmPassword,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const isMatchPassword = await bcrypt.compare(passwordOld, user.passwordHash);

  if (!isMatchPassword) {
    throw new HttpError(401, "Mật khẩu không chính xác");
  }

  if (newPassword !== confirmPassword) {
    throw new HttpError(401, "Mật khẩu nhập lại không chính xác");
  }
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  const userUpdate = await prisma.user.update({
    where: {
      email,
    },
    data: {
      passwordHash: newPasswordHash,
    },
  });

  return { success: true };
};

// function refreshToken
export const refreshTokenService = async (refreshToken) => {
  const token = await prisma.refreshToken.findUnique({
    where: { refreshToken },
  });
  const user = await prisma.user.findUnique({ where: { id: token.userId } });

  if (!token || token.expiresAt < new Date()) {
    if (token) {
      await prisma.refreshToken.delete({
        where: {
          refreshToken: refreshToken,
        },
      });
    }
    throw new HttpError(401, "Tài khoản chưa được xác thực");
  }

  const newAccessToken = jwt.sign({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  return newAccessToken;
};

// function SignOut
export const signOutService = async (refreshToken) => {
  await prisma.refreshToken.delete({ where: { token: refreshToken } });
};

//function forgotpassword
export const forgotPasswordService = async (email) => {
  const emailLower = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: {
      email: emailLower,
    },
  });

  if (!user) {
    throw new HttpError(401, "Email không tồn tại");
  }

  // create OTP
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();

  await redisClient.setEx(`${emailLower}:otp`, 60, OTP);

  try {
    return await sendMail(
      emailLower,
      "Mã OTP khôi phục mật khẩu - Timekeeping-Management",
      otpTemplate(OTP),
    );
  } catch (error) {
    await redisClient.del(`${emailLower}:otp`);
    throw new HttpError(500, "Gửi mail thất bại");
  }
};

// function verify-otp
export const verifyOTPService = async (OTP, email) => {
  const emailLowerCase = email.toLowerCase().trim();
  const otpKey = `${emailLowerCase}:otp`;

  const storedOTP = await redisClient.get(otpKey);

  if (!storedOTP) {
    throw new HttpError(401, "Mã OTP đã hết hạn hoặc không tồn tại.");
  }

  if (storedOTP !== OTP) {
    throw new HttpError(401, "Mã OTP không chính xác.");
  }

  // create resetToken return for user
  const resetToken = crypto.randomBytes(32).toString("hex");

  // expire 15p
  await redisClient.setEx(`resetToken:${emailLowerCase}`, 900, resetToken);

  // if match OTP code => delete OTP code
  await redisClient.del(otpKey);

  return resetToken;
};

//function resetPassword
export const resetPasswordService = async (email, newPassword, resetToken) => {
  const emailLowerCase = email.toLowerCase().trim();
  const token = await redisClient.get(`resetToken:${emailLowerCase}`);

  if (!token || token !== resetToken) {
    throw new HttpError(401, "Bạn không có quyền đặt lại mật khẩu");
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      email: emailLowerCase,
    },
    data: { passwordHash: newPasswordHash },
  });

  await redisClient.del(`resetToken:${emailLowerCase}`);

  return { success: true };
};

//function resendOTP
export const resendOTPService = async (email) => {
  const emailLowerCase = email.toLowerCase().trim();
  const cooldownKey = `otp_cooldown:${emailLowerCase}`;

  // resend after 60s
  const isCooldown = await redisClient.get(cooldownKey);
  if (isCooldown) {
    throw new HttpError(429, "Vui lòng đợi 60 giây trước khi yêu cầu mã mới."); // status code 429 : Too Many Requests
  }

  // delete old otp
  await redisClient.del(`${emailLowerCase}:otp`);

  // create new otp
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();

  // save new otp into Redis
  await redisClient.setEx(`${emailLowerCase}:otp`, 60, OTP);

  try {
    // establish cooldown 60s in Redis
    await redisClient.setEx(cooldownKey, 60, "true");

    const data = await sendMail(
      emailLowerCase,
      "Mã OTP khôi phục mật khẩu - WeConnect",
      otpTemplate(OTP),
    );

    if (data) return { success: true };
  } catch (error) {
    await redisClient.del(`${emailLowerCase}:otp`);
    throw new HttpError(500, "Lỗi gửi email. Vui lòng thử lại!");
  }
};
