import redisClient from "../config/redis.js";
import {
  ChangePasswordService,
  RefreshTokenService,
  SignInService,
  SignUpService,
  SignOutService,
  ForgotPasswordService,
  VerifyOTPService,
  ResetPasswordService,
  ResendOTPService,
} from "../services/auth.service.js";
import { success } from "zod";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase(); // ép email về chữ thường
    const newUser = await SignUpService(emailLower, password);
    return res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    if (error.message) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase(); // ép email về chữ thường

    const { accessToken, refreshToken, user } = await SignInService(
      emailLower,
      password,
    );
    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.REFRESH_TOKEN_TTL),
        sameSite: "strict", // chánh tấn công CSRF
      });
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: { accessToken: accessToken, user: user },
    });
  } catch (error) {
    if (error.message) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }

    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const ChangePassword = async (req, res) => {
  try {
    const user = req?.user;
    const { passwordOld, newPassword, confirmPassword } = req.body;

    const { success } = await ChangePasswordService(
      user.email,
      passwordOld,
      newPassword,
      confirmPassword,
    );
    if (success) {
      return res.status(200).json({
        message: "Đổi mật khẩu thành công",
      });
    }
  } catch (error) {
    if (error.message) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }

    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const RefreshToken = async (req, res) => {
  try {
    const resfreshToken = req?.cookies.refreshToken;

    if (!resfreshToken) {
      return res.status(401).json({ message: "RefeshToken không tồn tại" });
    }

    const newAccessToken = await RefreshTokenService(refreshToken);

    if (newAccessToken) {
      return res.status(200).json({
        message: "Cấp lại token thành công",
        data: { accessToken: newAccessToken },
      });
    }
  } catch (error) {
    if (error.message) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }

    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const SignOut = async (req, res) => {
  try {
    const refreshToken = req?.cookies.refreshToken;
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    const timeLeft = decoded.exp - Math.floor(Date.now() / 1000);

    if (timeLeft > 0) {
      await redisClient.setEx(`blacklist:${token}`, timeLeft, "true");
    }

    if (refreshToken) {
      await SignOutService(refreshToken);
    }
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Đăng xuất thành công.",
    });
  } catch (error) {
    console.log("err: ", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await ForgotPasswordService(email);
    return res.status(200).json({
      message: "Gửi OTP thành công.",
    });
  } catch (error) {
    console.log(error);
    if (error.message) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }

    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const VerifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email và OTP là bắt buộc!" });
    }

    const result = await VerifyOTPService(otp, email);
    return res.status(200).json({
      message: "Xác thực OTP thành công.",
      resetToken: result,
    });
  } catch (error) {
    if (error.message) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ.",
    });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    const { success } = await ResetPasswordService(
      email,
      newPassword,
      resetToken,
    );

    if (success) {
      return res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
    }
  } catch (error) {
    if (error.message) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ.",
    });
  }
};

export const ResendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const { success } = await ResendOTPService(email);
    if (success) {
      return res.status(200).json({ message: "Tạo OTP mới thành công" });
    }
  } catch (error) {
    if (error.message) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ.",
    });
  }
};
