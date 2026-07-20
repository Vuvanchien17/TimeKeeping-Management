import prisma from "../config/prisma.js";
import { HttpError } from "../utils/error.js";

export const createInsuranceService = async (data) => {
  const { employeeId, insuranceCode, healthCardCode, salaryBase, startDate } =
    data;

  const existingCode = await prisma.insurance.findUnique({
    where: { insuranceCode },
  });
  if (existingCode) {
    throw new HttpError(400, "Mã bảo hiểm đã tồn tại");
  }

  return await prisma.insurance.create({
    data: {
      employeeId: Number(employeeId),
      insuranceCode,
      healthCardCode,
      salaryBase: parseFloat(salaryBase),
      startDate: new Date(startDate),
    },
  });
};

export const updateInsuranceService = async (employeeId, data) => {
  const { insuranceCode, salaryBase, startDate } = data;

  const insurane = await prisma.insurance.findUnique({
    where: {
      employeeId: Number(employeeId),
    },
  });

  if (!insurane) {
    throw new HttpError(404, "Không tồn tại");
  }

  const updateInsurance = await prisma.insurance.update({
    where: { employeeId: Number(employeeId) },
    data: {
      insuranceCode,
      salaryBase: salaryBase ? parseFloat(salaryBase) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
    },
  });

  return updateInsurance;
};

export const getInsuranceByEmployeeService = async (
  employeeId,
  currentUserId,
  currentUserRole,
) => {
  const insurance = await prisma.insurance.findUnique({
    where: {
      employeeId: Number(employeeId),
      isDeleted: false,
    },
    include: {
      employee: {
        select: {
          id: true,
          code: true,
          fullName: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!insurance) {
    throw new HttpError(404, "Nhân viên chưa có bảo hiểm");
  }

  if (currentUserRole === "employee" || currentUserRole === "manager") {
    if (currentUserId !== insurance.employeeId) {
      throw new HttpError(403, "Bạn không có quyền truy cập");
    }
  }

  return insurance;
};
