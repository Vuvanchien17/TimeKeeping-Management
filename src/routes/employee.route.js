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

const router = express.Router();

router.use(protectedRoute);

router.use(checkBlackList);

router.post("/", authorizedRoles("admin"), addEmployee);
router.patch(
  "/:id",
  authorizedRoles("admin", "manager", "employee"),
  updateEmployee,
);

router.get("/", authorizedRoles("admin", "manager"), getAllEmployees);

router.get(
  "/:id",
  authorizedRoles("admin", "manager", "employee"),
  getEmployeeById,
);

export default router;
