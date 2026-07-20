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
import { ROLES } from "../utils/const.js";

const router = express.Router({ mergeParams: true });
router.use(protectedRoute);
router.use(checkBlackList);

router.post(
  "/",
  authorizedRoles(ROLES.manager, ROLES.employee),
  createLeaveRequest,
);

router.get(
  "/pending",
  authorizedRoles(ROLES.admin, ROLES.manager),
  getAllLeavesPending,
);

router.patch(
  "/:id/status",
  authorizedRoles(ROLES.admin, ROLES.manager),
  approveLeaveRequest,
);

export default router;
