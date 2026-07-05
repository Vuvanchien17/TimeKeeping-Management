import {
  addEmployeeEducationService,
  deleteEmployeeEducationService,
  updateEmployeeEducationService,
} from "../services/education.service.js";
import prisma from "../config/prisma.js";

export const addEmployeeEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, degree, fieldStudy, startYear, endYear } = req.body;
    const role = req.user.role;
    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== Number(id)
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await addEmployeeEducationService(
      id,
      name,
      degree,
      fieldStudy,
      startYear,
      endYear,
    );
    if (success) {
      return res.status(201).json({ message: "Tạo mới thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const updateEmployeeEducation = async (req, res, next) => {
  try {
    const { educationId } = req.params;
    const { name, degree, fieldStudy, startYear, endYear } = req.body;
    const role = req.user.role;
    const education = await prisma.employeeEducation.findUnique({
      where: {
        id: Number(educationId),
      },
      select: { employeeId: true },
    });

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== education.employeeId
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await updateEmployeeEducationService(
      educationId,
      name,
      degree,
      fieldStudy,
      startYear,
      endYear,
    );
    if (success) {
      return res.status(200).json({ message: "Cập nhật thành công" });
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteEmployeeEducation = async (req, res, next) => {
  try {
    const { educationId } = req.params;
    const role = req.user.role;
    const education = await prisma.employeeEducation.findUnique({
      where: {
        id: Number(educationId),
      },
      select: { employeeId: true },
    });

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== education.employeeId
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await deleteEmployeeEducationService(educationId);
    if (success) {
      return res.status(200).json({ message: "Xóa thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};
