import prisma from "../config/prisma.js";
import { HttpError } from "../utils/error.js";

const COMPANY_CONFIG = {
  START_HOUR: 9,
  START_MINUTE: 30,
  END_HOUR: 18,
  END_MINUTE: 0,
};

export const checkInService = async (employeeId) => {
  const now = new Date();

  const todayStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
  const todayEnd = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );

  const actualCheckIn = new Date();

  const existingCheckIn = await prisma.attendance.findFirst({
    where: {
      employeeId: Number(employeeId),
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  console.log("existingCheckIn :", existingCheckIn);

  if (existingCheckIn) {
    throw new HttpError(400, "Đã check-in");
  }

  const currentHour = actualCheckIn.getHours();
  const currentMinute = actualCheckIn.getMinutes();

  let lateMinutes = 0;
  let status = "present";

  const currentCheckInTime = currentHour * 60 + currentMinute;
  const currentCompanyTime =
    COMPANY_CONFIG.START_HOUR * 60 + COMPANY_CONFIG.START_MINUTE;

  if (currentCheckInTime > currentCompanyTime) {
    lateMinutes = currentCheckInTime - currentCompanyTime;
    status = "late";
  }

  const checkIn = await prisma.attendance.create({
    data: {
      employeeId: Number(employeeId),
      date: todayStart,
      checkIn: actualCheckIn,
      status: status,
      lateMinutes: lateMinutes,
    },
  });

  return checkIn;
};

export const checkOutService = async (employeeId) => {
  const now = new Date();

  const todayStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
  const todayEnd = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );

  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      employeeId: Number(employeeId),
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (!existingAttendance) {
    throw new HttpError(400, "Chưa check-in, không thể check-out");
  }

  if (existingAttendance.checkOut) {
    throw new HttpError(400, "Đã check-out");
  }

  const actualCheckOut = new Date();
  const currentHour = actualCheckOut.getHours();
  const currentMinute = actualCheckOut.getMinutes();

  let earlyMinutes = 0;

  let updatedStatus = existingAttendance.status;

  const currentCheckOutTime = currentHour * 60 + currentMinute;
  const companyCheckOutTime =
    COMPANY_CONFIG.END_HOUR * 60 + COMPANY_CONFIG.END_MINUTE;

  if (currentCheckOutTime < companyCheckOutTime) {
    earlyMinutes = companyCheckOutTime - currentCheckOutTime;
    updatedStatus = "early_leave";
  }

  const checkOut = await prisma.attendance.update({
    where: {
      id: existingAttendance.id,
    },
    data: {
      checkOut: actualCheckOut,
      earlyMinutes: earlyMinutes,
    },
  });

  return checkOut;
};

export const getMyAttendanceHistoryService = async (
  employeeId,
  startOfMonth,
  endOfMonth,
) => {
  const attendance = await prisma.attendance.findMany({
    where: {
      employeeId: Number(employeeId),
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    omit: {
      createdAt: true,
      updatedAt: true,
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
    orderBy: { date: "desc" },
  });

  return attendance;
};

export const getAllAttendanceService = async (
  search,
  page,
  limit,
  fromDate,
  toDate,
  role,
  employeeId,
) => {
  const whereCondition = {};
  const employee = await prisma.employee.findUnique({
    where: { id: Number(employeeId) },
    select: {
      id: true,
      departmentId: true,
    },
  });

  if (role === "manager") {
    whereCondition.employee = {
      departmentId: Number(employee.departmentId),
      id: { not: Number(employee.id) },
    };
  }

  if (search) {
    whereCondition.employee = {
      ...whereCondition.employee,
      fullName: { contains: search },
    };
  }

  const currentPage = parseInt(page, 10) || 1;
  const currentLimit = parseInt(limit, 10) || 10;
  const skip = (currentPage - 1) * currentLimit;

  if (fromDate || toDate) {
    whereCondition.date = {};
    if (fromDate) {
      const start = new Date(fromDate);
      whereCondition.date.gte = new Date(
        Date.UTC(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          0,
          0,
          0,
          0,
        ),
      );
    }

    if (toDate) {
      const end = new Date(toDate);
      whereCondition.date.lte = new Date(
        Date.UTC(
          end.getFullYear(),
          end.getMonth(),
          end.getDate(),
          23,
          59,
          59,
          999,
        ),
      );
    }
  }

  const [total, attendanceList] = await prisma.$transaction([
    prisma.attendance.count({ where: whereCondition }),
    prisma.attendance.findMany({
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
      orderBy: { date: "desc" },
    }),
  ]);
  return {
    attendanceList,
    pagination: {
      currentPage: currentPage,
      limit: currentLimit,
      total: total,
      totalPages: Math.ceil(total / currentLimit),
    },
  };
};
