import prisma from "../config/prisma.js";
import {
  addEmployeeExpService,
  deleteEmployeeExpService,
  updateEmployeeExpService,
} from "../services/exp.service.js";

export const addEmployeeExp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company, jobTitle, startDate, endDate, description } = req.body;

    const role = req.user.role;

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== Number(id)
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await addEmployeeExpService(
      id,
      company,
      jobTitle,
      startDate,
      endDate,
      description,
    );
    if (success) {
      return res.status(201).json({ message: "Tạo mới thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const updateEmployeeExp = async (req, res, next) => {
  try {
    const { expId } = req.params;
    const { company, jobTitle, startDate, endDate, description } = req.body;
    const role = req.user.role;
    const exp = await prisma.employeeExp.findUnique({
      where: {
        id: Number(expId),
      },
      select: { employeeId: true },
    });

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== exp.employeeId
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await updateEmployeeExpService(
      expId,
      company,
      jobTitle,
      startDate,
      endDate,
      description,
    );

    if (success) {
      return res.status(200).json({ message: "Cập nhật thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const deleteEmployeeExp = async (req, res, next) => {
  try {
    const { expId } = req.params;
    const role = req.user.role;
    const exp = await prisma.employeeExp.findUnique({
      where: {
        id: Number(expId),
      },
      select: { employeeId: true },
    });

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== exp.employeeId
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await deleteEmployeeExpService(expId);

    if (success) {
      return res.status(200).json({ message: "Xóa thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};
