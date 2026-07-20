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
import { ROLES } from "../utils/const.js";
const router = express.Router();

router.use(protectedRoute);
router.use(checkBlackList);

router.post(
  "/check-in",
  authorizedRoles(ROLES.manager, ROLES.employee),
  checkIn,
);

router.post(
  "/check-out",
  authorizedRoles(ROLES.manager, ROLES.employee),
  checkOut,
);

router.get("/", authorizedRoles(ROLES.admin, ROLES.manager), getAllAttendance);

router.get(
  "/me",
  authorizedRoles(ROLES.manager, ROLES.employee),
  getMyAttendanceHistory,
);

export default router;
