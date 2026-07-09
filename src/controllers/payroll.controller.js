import {
  calculatePayrollService,
  getAllPayrollsService,
  getMyPayslipService,
} from "../services/payroll.service.js";
import { HttpError } from "../utils/error.js";

export const calculatePayroll = async (req, res, next) => {
  try {
    const { month, year } = req.body;

    const totalEmployees = await calculatePayrollService(month, year);

    return res.status(201).json({
      message: "Tính lương thành công",
      data: {
        totalEmployee: totalEmployees,
      },
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const getAllPayrolls = async (req, res, next) => {
  try {
    const { month, year, search, page, limit } = req.query;

    const { payrolls, pagination } = await getAllPayrollsService({
      month,
      year,
      search,
      page,
      limit,
    });

    return res.status(200).json({
      message: "Lấy dữ liệu thành công",
      data: { total: total, pagination: pagination },
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const getMyPayslip = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const employeeId = req.user.employeeId;

    const payslip = await getMyPayslipService({ employeeId, month, year });

    return res.status(200).json({
      message: "Lấy dữ liệu thành công.",
      data: { payslip: payslip },
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};
