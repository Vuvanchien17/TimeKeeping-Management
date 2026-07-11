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

const router = express.Router();

router.use(protectedRoute);

router.use(checkBlackList);

router.post("/caculates", authorizedRoles("admin"), calculatePayroll);

router.get("/", authorizedRoles("admin"), getAllPayrolls);

router.get("/:id", authorizedRoles("manager", "employee"), getMyPayslip);

export default router;
