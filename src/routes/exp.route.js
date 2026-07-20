import express from "express";
import {
  addEmployeeExp,
  deleteEmployeeExp,
  updateEmployeeExp,
} from "../controllers/exp.controller.js";

import {
  authorizedRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
import { ROLES } from "../utils/const.js";

import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";

const router = express.Router({ mergeParams: true });
router.use(protectedRoute);
router.use(checkBlackList);

router.post(
  "/",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  addEmployeeExp,
);
router.patch(
  "/:expId",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  updateEmployeeExp,
);

router.delete(
  "/:expId",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  deleteEmployeeExp,
);

export default router;
