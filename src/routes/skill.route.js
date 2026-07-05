import express from "express";
import {
  addEmployeeSkill,
  deleteEmployeeSkill,
  updateEmployeeSkill,
} from "../controllers/skill.controller.js";

import {
  authorizedRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
import { checkBlackList } from "../middlewares/checkBlackList.middleware.js";
import { updateEmployeeSkillService } from "../services/skill.service.js";

const router = express.Router({ mergeParams: true });
router.use(protectedRoute);

router.use(checkBlackList);

router.post(
  "/",
  authorizedRoles("admin", "manager", "employee"),
  addEmployeeSkill,
);
router.patch(
  "/:skillId",
  authorizedRoles("admin", "manager", "employee"),
  updateEmployeeSkill,
);
router.delete(
  "/:skillId",
  authorizedRoles("admin", "manager", "employee"),
  deleteEmployeeSkill,
);

export default router;
