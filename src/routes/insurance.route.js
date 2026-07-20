import express from "express";
import {
  authorizedRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";
import {
  createInsurance,
  getInsuranceByEmployee,
  updateInsurance,
} from "../controllers/insurance.controller.js";
import { ROLES } from "../utils/const.js";
const router = express.Router();

router.use(protectedRoute);
router.use(checkBlackList);

router.post("/", authorizedRoles(ROLES.admin), createInsurance);

router.patch("/:employeeId", authorizedRoles(ROLES.admin), updateInsurance);

router.get(
  "/:employeeId",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  getInsuranceByEmployee,
);

export default router;
