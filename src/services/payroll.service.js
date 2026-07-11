import dotenv from "dotenv";
import { HttpError } from "../utils/error.js";
import prisma from "../config/prisma.js";

export const calculatePayrollService = async (month, year) => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (!m || !y || m < 1 || m > 12) {
    throw new HttpError(400, "Dữ liệu không hợp lệ");
  }

  const startOfMonth = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

  const workDays = process.env.STANDARD_WORK_DAYS;

  const employees = await prisma.employee.findMany({
    where: { isDeleted: false },
    include: {
      attendances: {
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      },
      myLeaves: {
        where: {
          status: "approved",
          type: "paid",
          startDate: { lte: endOfMonth },
          endDate: { lte: endOfMonth },
        },
      },
    },
  });

  const payrollResults = [];

  for (const e of employees) {
    const actualAttendanceDays = e.attendances.length;

    let paidLeaveDays = 0;
    employees.myLeaves.forEach((leave) => {
      const leaveStart =
        leave.startDate < startOfMonth ? startOfMonth : leave.startDate;
      const leaveEnd = leave.endDate > endOfMonth ? endOfMonth : leave.endDate;

      const diffTime = Math.abs(leaveStart - leaveEnd);

      const totalLeaveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    });

    paidLeaveDays += totalLeaveDays;

    const totalWorkDays = actualAttendanceDays + paidLeaveDays;

    const netSalary = (e.salary / workDays) * totalWorkDays;

    payrollResults.push({
      employeeId: e.id,
      month: m,
      year: y,
      baseSalary: e.salary,
      actualWorkDays: totalWorkDays,
      netSalary: Math.round(netSalary),
    });
  }

  const querys = payrollResults.map((payroll) => {
    prisma.payroll.upsert({
      where: {
        employeeId: payroll.employeeId,
        month: payroll.month,
        year: payroll.year,
      },
      update: {
        baseSalary: payroll.baseSalary,
        actualWorkDays: payroll.actualWorkDays,
        netSalary: payroll.netSalary,
      },
      create: payroll,
    });
  });

  await prisma.$transaction(querys);

  return employees.length;
};

export const getAllPayrollsService = async (data) => {
  const { month, year, search, page, limit } = data;
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (!m || !y || m < 1 || m > 12) {
    throw new HttpError(400, "Dữ liệu không hợp lệ");
  }

  const currentPage = parseInt(page, 10) || 1;
  const currentLimit = parseInt(limit, 10) || 10;
  const skip = (currentPage - 1) * currentLimit;

  const whereCondition = {};

  if (search) whereCondition.employee = { fullName: { contains: search } };
  if (month) whereCondition.month = m;
  if (year) whereCondition.year = y;

  const [total, payrolls] = await prisma.$transaction([
    prisma.payroll.count({ where: whereCondition }),
    prisma.payroll.findMany({
      where: whereCondition,
      skip,
      take: currentLimit,
      include: {
        employee: {
          select: {
            id: true,
            code: true,
            fullName: true,
            jobTitle: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return {
    payrolls,
    pagination: {
      currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit),
    },
  };
};

export const getMyPayslipService = async (data) => {
  const { employeeId, month, year } = data;
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!m || !y || m < 1 || m > 12) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  const payslip = await prisma.payroll.findUnique({
    where: {
      employeeId: parseInt(employeeId, 10),
      month: m,
      year: y,
    },
    include: {
      employee: {
        select: {
          id: true,
          code: true,
          fullName: true,
          jobTitle: true,
        },
      },
    },
  });

  return payslip;
};

