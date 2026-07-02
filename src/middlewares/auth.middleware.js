import jwt from "jsonwebtoken";
import { HttpError } from "../utils/error.js";

export const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Không tìm thấy token hoặc định dạng không hợp lệ.",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    const verifyToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY,
      (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            throw new HttpError(401, "Token hết hạn");
          }
          throw new HttpError(401, "Token không hợp lệ");
        }

        req.user = {
          id: decoded.userId,
          role: decoded.role,
          email: decoded.email,
        };

        next();
      },
    );
  } catch (error) {
    next(error);
  }
};

export const authorizedRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return new HttpError(401, "Tài khoản chưa được xác thực");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return new HttpError(403, "Bạn không có quyền truy cập");
    }

    next();
  };
