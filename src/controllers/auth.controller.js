import redisClient from "../config/redis.js";
import {
  changePasswordService,
  refreshTokenService,
  signInService,
  // signUpService,
  signOutService,
  forgotPasswordService,
  verifyOTPService,
  resetPasswordService,
  resendOTPService,
} from "../services/auth.service.js";
import { success } from "zod";
import jwt from "jsonwebtoken";

// export const signUp = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const emailLower = email.toLowerCase(); // ép email về chữ thường
//     const newUser = await signUpService(emailLower, password);
//     return res.status(201).json({ message: "Đăng ký thành công!" });
//   } catch (error) {
//     if (error.message) {
//       return res.status(error.statusCode).json({ message: error.message });
//     }

//     return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
//   }
// };

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase(); // ép email về chữ thường

    const { accessToken, refreshToken, user } = await signInService(
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
    return next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = req?.user;
    const { passwordOld, newPassword, confirmPassword } = req.body;

    const { success } = await changePasswordService(
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
    return next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const resfreshToken = req?.cookies.refreshToken;

    if (!resfreshToken) {
      return res.status(401).json({ message: "RefeshToken không tồn tại" });
    }

    const newAccessToken = await refreshTokenService(refreshToken);

    if (newAccessToken) {
      return res.status(200).json({
        message: "Cấp lại token thành công",
        data: { accessToken: newAccessToken },
      });
    }
  } catch (error) {
    return next(error);
  }
};

export const signOut = async (req, res, next) => {
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
      await signOutService(refreshToken);
    }
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Đăng xuất thành công.",
    });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await forgotPasswordService(email);
    return res.status(200).json({
      message: "Gửi OTP thành công.",
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email và OTP là bắt buộc!" });
    }

    const result = await verifyOTPService(otp, email);
    return res.status(200).json({
      message: "Xác thực OTP thành công.",
      resetToken: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    const { success } = await resetPasswordService(
      email,
      newPassword,
      resetToken,
    );

    if (success) {
      return res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
    }
  } catch (error) {
    return next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { success } = await resendOTPService(email);
    if (success) {
      return res.status(200).json({ message: "Tạo OTP mới thành công" });
    }
  } catch (error) {
    return next(error);
  }
};
