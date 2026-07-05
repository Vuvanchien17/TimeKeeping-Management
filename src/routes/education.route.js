import express from "express";
import {
  authorizedRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";

import {
  addEmployeeEducation,
  deleteEmployeeEducation,
  updateEmployeeEducation,
} from "../controllers/education.controller.js";

import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";

const router = express.Router({ mergeParams: true });
router.use(protectedRoute);

router.use(checkBlackList);

router.post(
  "/",
  authorizedRoles("admin", "manager", "employee"),
  addEmployeeEducation,
);

router.patch(
  "/:educationId",
  authorizedRoles("admin", "manager", "employee"),
  updateEmployeeEducation,
);

router.delete(
  "/:educationId",
  authorizedRoles("admin", "manager", "employee"),
  deleteEmployeeEducation,
);

export default router;
