import express from "express";
import {
  changePassword,
  forgotPassword,
  refreshToken,
  resendOTP,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyOTP,
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

router.post("/signup", validate(User), signUp);
router.post("/signin", validate(User), signIn);

router.patch(
  "/change-password",
  validate(ChangePasswordSchema),
  protectedRoute,
  changePassword,
);

router.post("/refresh", refreshToken);

router.post("/signout", protectedRoute, checkBlackList, signOut);

router.post("/forgot-password", validate(EmailSchema), forgotPassword);

router.post("/verify-otp", verifyOTP);

router.patch("/reset-password", validate(ResetPassSchema), resetPassword);

router.post("/resend-otp", validate(EmailSchema), resendOTP);

export default router;
