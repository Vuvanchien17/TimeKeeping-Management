import prisma from "../config/prisma.js";
import {
  addEmployeeSkillService,
  deleteEmployeeSkillService,
  updateEmployeeSkillService,
} from "../services/skill.service.js";

export const addEmployeeSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, level } = req.body;
    const role = req.user.role;

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== Number(id)
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await addEmployeeSkillService(id, name, level);
    if (success) {
      return res.status(201).json({ message: "Tạo mới thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const updateEmployeeSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const { name, level } = req.body;
    const role = req.user.role;

    const skill = await prisma.employeeSkill.findUnique({
      where: {
        id: Number(skillId),
      },
      select: { employeeId: true },
    });

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== skill.employeeId
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await updateEmployeeSkillService(skillId, name, level);

    if (success) {
      return res.status(200).json({ message: "Cập nhật thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const deleteEmployeeSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const role = req.user.role;

    const skill = await prisma.employeeSkill.findUnique({
      where: {
        id: Number(skillId),
      },
      select: { employeeId: true },
    });

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== skill.employeeId
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await deleteEmployeeSkillService(skillId);
    if (success) {
      return res.status(200).json({ message: "Xóa thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};
