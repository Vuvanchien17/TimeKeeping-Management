import express from "express";
import {
  authorizedRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";
import {
  checkIn,
  checkOut,
  getAllAttendance,
  getMyAttendanceHistory,
} from "../controllers/attendance.controller.js";
const router = express.Router();

router.use(protectedRoute);
router.use(checkBlackList);

router.post("/check-in", authorizedRoles("manager", "employee"), checkIn);

router.post("/check-out", authorizedRoles("manager", "employee"), checkOut);

router.get("/", authorizedRoles("admin", "manager"), getAllAttendance);

router.get(
  "/me",
  authorizedRoles("manager", "employee"),
  getMyAttendanceHistory,
);

export default router;
