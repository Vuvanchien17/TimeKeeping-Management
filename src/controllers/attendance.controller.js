import {
  checkInService,
  checkOutService,
  getAllAttendanceService,
  getMyAttendanceHistoryService,
} from "../services/attendance.service.js";

export const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;

    const record = await checkInService(employeeId);
    return res.status(201).json({
      message: "Check-in thành công",
      data: { checkin: record },
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;

    const record = await checkOutService(employeeId);
    return res.status(201).json({
      message: "Check-out thành công",
      data: { checkin: record },
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const getMyAttendanceHistory = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const { month, year } = req.query;
    const current = new Date();
    const currentMonth = month ? Number(month) - 1 : current.getUTCMonth();
    const currentYear = year ? Number(year) - 1 : current.getUTCFullYear();

    const startOfMonth = new Date(
      Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0),
    );
    const endOfMonth = new Date(
      Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999),
    );

    const attendance = await getMyAttendanceHistoryService(
      employeeId,
      startOfMonth,
      endOfMonth,
    );

    return res.status(200).json({
      message: "Lấy dữ liệu thành công",
      data: { attendance: attendance },
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const getAllAttendance = async (req, res, next) => {
  try {
    const { search, page, limit, fromDate, toDate } = req.query;
    const role = req.user.role;
    const employeeId = req.user.employeeId;

    const { attendanceList, pagination } = await getAllAttendanceService(
      search,
      page,
      limit,
      fromDate,
      toDate,
      role,
      employeeId,
    );

    return res.status(200).json({
      message: "Lấy dữ liệu thành công",
      data: { attendanceList: attendanceList, pagination },
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
