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
import { ROLES } from "../utils/const.js";
const router = express.Router({ mergeParams: true });
router.use(protectedRoute);

router.use(checkBlackList);

router.post(
  "/",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  addEmployeeEducation,
);

router.patch(
  "/:educationId",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  updateEmployeeEducation,
);

router.delete(
  "/:educationId",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  deleteEmployeeEducation,
);

export default router;
