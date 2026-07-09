import { HttpError } from "../utils/error.js";
import { success } from "zod";
import prisma from "../config/prisma.js";

export const createLeaveRequestService = async (
  employeeId,
  startDate,
  endDate,
  reason,
  type,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const differenceInTime = end.getTime() - start.getTime();
  const totalDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1;

  if (totalDays <= 0) {
    throw new HttpError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
  }

  return await prisma.leaveRequest.create({
    data: {
      startDate: start,
      endDate: end,
      reason,
      type,
      totalDays: totalDays,
      employeeId: Number(employeeId),
    },
  });
};

export const approveLeaveRequestService = async (
  leaveId,
  status,
  role,
  approvedById,
) => {
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id: Number(leaveId) },
    include: {
      employee: {
        include: {
          user: {
            select: {
              role: true,
            },
          },
        },
      },
    },
  });

  const approver = await prisma.employee.findUnique({
    where: { id: approvedById },
  });

  if (role === "manager") {
    if (leaveRequest.employee.user.role !== "employee") {
      throw new HttpError(403, "Không có quyền phê duyệt");
    }
    if (leaveRequest.employee.departmentId !== approver.departmentId) {
      throw new HttpError(403, "Không có quyền phê duyệt");
    }
  }

  const approvedLeave = await prisma.leaveRequest.update({
    where: { id: Number(leaveId) },
    data: {
      status: status,
      approvedById: Number(approver.id),
    },
  });

  return approvedLeave;
};

export const getAllLeavesPendingService = async (role, approvedById) => {
  const whereCondition = { isDeleted: false, status: "pending" };

  const approver = await prisma.employee.findUnique({
    where: { id: Number(approvedById) },
    select: { departmentId: true },
  });

  if (role === "manager") {
    whereCondition.employee = {
      departmentId: Number(approver.departmentId),
      user: {
        role: "employee",
      },
    };
  }

  const leavesPending = await prisma.leaveRequest.findMany({
    where: whereCondition,
    omit: {
      isDeleted: true,
      updatedAt: true,
      status: true,
    },
    include: {
      employee: {
        select: {
          id: true,
          fullName: true,
          departmentId: true,
          user: {
            select: {
              role: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return leavesPending;
};
