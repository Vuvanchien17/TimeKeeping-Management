import express from "express";
import {
  authorizedRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";

import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";
import {
  approveLeaveRequest,
  createLeaveRequest,
  getAllLeavesPending,
} from "../controllers/leave.controller.js";

const router = express.Router({ mergeParams: true });
router.use(protectedRoute);
router.use(checkBlackList);

router.post("/", authorizedRoles("manager", "employee"), createLeaveRequest);

router.get(
  "/pending",
  authorizedRoles("admin", "manager"),
  getAllLeavesPending,
);

router.patch(
  "/:id/status",
  authorizedRoles("admin", "manager"),
  approveLeaveRequest,
);

export default router;
