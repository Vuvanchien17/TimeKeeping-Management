import { success } from "zod";
import prisma from "../config/prisma.js";

export const addEmployeeSkillService = async (id, name, level) => {
  const skill = await prisma.employeeSkill.create({
    data: {
      name,
      level,
      employeeId: Number(id),
    },
  });

  if (skill) return { success: true };
};

export const updateEmployeeSkillService = async (skillId, name, level) => {
  const skill = await prisma.employeeSkill.update({
    where: {
      id: Number(skillId),
    },
    data: {
      name,
      level,
      description
    },
  });

  if (skill) return { success };
};

export const deleteEmployeeSkillService = async (skillId) => {
  const deleteSkill = await prisma.employeeSkill.update({
    where: {
      id: Number(skillId),
    },
    data: {
      isDeleted: true,
    },
  });

  if (deleteSkill) return { success: true };
};
