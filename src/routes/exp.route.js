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

import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";

const router = express.Router({ mergeParams: true });
router.use(protectedRoute);
router.use(checkBlackList);

router.post(
  "/",
  authorizedRoles("admin", "manager", "employee"),
  addEmployeeExp,
);
router.patch(
  "/:expId",
  authorizedRoles("admin", "manager", "employee"),
  updateEmployeeExp,
);

router.delete(
  "/:expId",
  authorizedRoles("admin", "manager", "employee"),
  deleteEmployeeExp,
);

export default router;
