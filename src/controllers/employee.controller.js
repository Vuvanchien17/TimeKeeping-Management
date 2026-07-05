import prisma from "../config/prisma.js";
import {
  addEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
} from "../services/employee.service.js";

// func create employee
export const addEmployee = async (req, res, next) => {
  try {
    const { user, employee } = await addEmployeeService(req.body);

    if (user && employee) {
      return res.status(201).json({ message: "Tạo nhân viên mới thành công" });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phone, gender, birth, address, identifyCard } = req.body;
    const role = req.user.role;

    if (
      (role === "employee" || role === "manager") &&
      req.user.employeeId !== Number(id)
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { success } = await updateEmployeeService(
      id,
      phone,
      gender,
      birth,
      address,
      identifyCard,
    );
    if (success) {
      return res.status(200).json({ message: "Cập nhật thông tin thành công" });
    }
  } catch (error) {
    return next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role === "employee" && req.user.employeeId !== Number(id)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const employee = await getEmployeeByIdService(id, role);
    if (employee) {
      return res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: { employee: employee },
      });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const getAllEmployees = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.user.page, 10) || 1;
    const limit = parseInt(req.user.limit, 10) || 10;

    const currentEmployee = await prisma.employee.findUnique({
      where: { id: req.user.employeeId },
      select: { departmentId: true },
    });
    const departmentId = currentEmployee.departmentId;

    const { employees, pagination } = await getAllEmployeesService(
      search,
      page,
      limit,
      req.user.role,
      departmentId,
      Number(req.user.employeeId),
    );

    if (employees && pagination) {
      return res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: { employees: employees, pagination: pagination },
      });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};
