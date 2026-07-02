import express from "express";
import {
  ChangePassword,
  ForgotPassword,
  RefreshToken,
  ResendOTP,
  ResetPassword,
  SignIn,
  SignOut,
  SignUp,
  VerifyOTP,
} from "../controllers/auth.controller.js";
import { validate } from "../validations/validate.middleware.js";
import {
  ChangePasswordSchema,
  EmailSchema,
  ResetPassSchema,
  User,
} from "../validations/auth.validation.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";
const router = express.Router();

router.post("/signup", validate(User), SignUp);
router.post("/signin", validate(User), SignIn);

router.patch(
  "/change-password",
  validate(ChangePasswordSchema),
  protectedRoute,
  ChangePassword,
);

router.post("/refresh", RefreshToken);

router.post("/signout", protectedRoute, checkBlackList, SignOut);

router.post("/forgot-password", validate(EmailSchema), ForgotPassword);

router.post("/verify-otp", VerifyOTP);

router.patch("/reset-password", validate(ResetPassSchema), ResetPassword);

router.post("/resend-otp", validate(EmailSchema), ResendOTP);

export default router;
