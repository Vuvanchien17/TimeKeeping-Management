import prisma from "../config/prisma.js";
import {
  addEmployeeExpService,
  deleteEmployeeExpService,
  updateEmployeeExpService,
} from "../services/exp.service.js";
import { ROLES } from "../utils/const.js";

export const addEmployeeExp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company, jobTitle, startDate, endDate, description } = req.body;

    const role = req.user.role;

    if (
      (role === ROLES.employee || role === ROLES.manager) &&
      req.user.employeeId !== Number(id)
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const exp = await addEmployeeExpService(
      id,
      company,
      jobTitle,
      startDate,
      endDate,
      description,
    );
    if (exp) {
      return res
        .status(201)
        .json({ message: "Tạo mới thành công", data: { exp: exp } });
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
      (role === ROLES.employee || role === ROLES.manager) &&
      req.user.employeeId !== exp.employeeId
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const updateExp = await updateEmployeeExpService(
      expId,
      company,
      jobTitle,
      startDate,
      endDate,
      description,
    );

    if (updateExp) {
      return res.status(200).json({
        message: "Cập nhật thành công",
        data: {
          exp: updateExp,
        },
      });
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
      (role === ROLES.employee || role === ROLES.manager) &&
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
