import express from "express";
import {
  authorizedRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";

import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";
import {
  calculatePayroll,
  getAllPayrolls,
  getMyPayslip,
} from "../controllers/payroll.controller.js";
import { ROLES } from "../utils/const.js";

const router = express.Router();

router.use(protectedRoute);

router.use(checkBlackList);

router.post("/caculates", authorizedRoles(ROLES.admin), calculatePayroll);

router.get("/", authorizedRoles(ROLES.admin), getAllPayrolls);

router.get("/me", authorizedRoles(ROLES.manager, ROLES.employee), getMyPayslip);

export default router;
