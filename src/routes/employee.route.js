import express from "express";
import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../controllers/employee.controller.js";
import {
  authorizedRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";
import { ROLES } from "../utils/const.js";
import expRoute from "./exp.route.js";
import skillRoute from "./skill.route.js";
import educationRoute from "./education.route.js";
const router = express.Router();

router.use(protectedRoute);

router.use(checkBlackList);

router.post("/", authorizedRoles(ROLES.admin), addEmployee);
router.get("/", authorizedRoles(ROLES.admin, ROLES.manager), getAllEmployees);
router.use("/:id/exps", expRoute);
router.use("/:id/skills", skillRoute);
router.use("/:id/educations", educationRoute);
router.patch(
  "/:id",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  updateEmployee,
);

router.get(
  "/:id",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  getEmployeeById,
);

export default router;
