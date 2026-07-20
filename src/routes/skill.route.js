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

import { ROLES } from "../utils/const.js";

const router = express.Router({ mergeParams: true });
router.use(protectedRoute);

router.use(checkBlackList);

router.post(
  "/",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  addEmployeeSkill,
);
router.patch(
  "/:skillId",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  updateEmployeeSkill,
);
router.delete(
  "/:skillId",
  authorizedRoles(ROLES.admin, ROLES.manager, ROLES.employee),
  deleteEmployeeSkill,
);

export default router;
