import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { includes } from "zod";
import { HttpError } from "../utils/error.js";

export const addEmployeeService = async (data) => {
  const { email, password, role, fullName, jobTitle, salary, departmentId } =
    data;

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        role: role,
      },
    });

    const lastEmployee = await tx.employee.findFirst({
      orderBy: { code: "desc" },
      select: { code: true },
    });
    let nextCode = "";
    if (!lastEmployee) {
      nextCode = "NV0001";
    } else {
      const currentCode = lastEmployee.code;

      const currentNumber = parseInt(currentCode.replace("NV", ""), 10);
      const nextNumber = currentNumber + 1;
      nextCode = `NV${String(nextNumber).padStart(4, "0")}`;
    }

    const employee = await tx.employee.create({
      data: {
        code: nextCode,
        fullName: fullName,
        jobTitle: jobTitle,
        salary: salary,
        userId: user.id,
        departmentId: departmentId,
      },
    });

    return { user, employee };
  });

  return result;
};

export const updateEmployeeService = async (
  employeeId,
  phone,
  gender,
  birth,
  address,
  identifyCard,
) => {
  const updatedEmployee = await prisma.employee.update({
    where: { id: Number(employeeId) },
    data: { phone, gender, birth: new Date(birth), address, identifyCard },
  });

  if (updatedEmployee) return { success: true };
};

export const getEmployeeByIdService = async (id, role) => {
  const employee = await prisma.employee.findUnique({
    where: { id: Number(id), isDeleted: false },
    omit: {
      salary: role === "manager" ? true : false,
      isDeleted: true,
      userId: true,
      departmentId: true,
    },
    include: {
      department: {
        select: {
          name: true,
        },
      },
      skills: {
        where: { isDeleted: false },
        select: {
          name: true,
          level: true,
        },
      },
      exps: {
        where: { isDeleted: false },
        select: {
          company: true,
          jobTitle: true,
          description: true,
        },
      },
      educations: {
        where: { isDeleted: false },
        select: {
          schoolName: true,
          fieldStudy: true,
          degree: true,
        },
      },
    },
  });

  if (!employee) return new HttpError(404, "Tài nguyên không tồn tại");

  return employee;
};

export const getAllEmployeesService = async (
  search,
  page,
  limit,
  role,
  departmentId,
  currentEmployeeId,
) => {
  const skip = (page - 1) * limit;

  const whereCondition = {
    isDeleted: false,
    id: { not: Number(currentEmployeeId) },
  };
  if (role === "manager") {
    whereCondition.departmentId = Number(departmentId);
  }

  if (search) {
    whereCondition.fullName = { contains: search };
  }

  const [total, employees] = await prisma.$transaction([
    prisma.employee.count({ where: whereCondition }),
    prisma.employee.findMany({
      where: whereCondition,
      skip,
      take: limit,
      omit: {
        salary: role === "manager" ? true : false,
        isDeleted: true,
        userId: true,
        departmentId: true,
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
        skills: {
          where: { isDeleted: false },
          select: {
            name: true,
            level: true,
          },
        },
        exps: {
          where: { isDeleted: false },
          select: {
            company: true,
            jobTitle: true,
            description: true,
          },
        },
        educations: {
          where: { isDeleted: false },
          select: {
            schoolName: true,
            fieldStudy: true,
            degree: true,
          },
        },
      },
      orderBy: { joinDate: "desc" },
    }),
  ]);

  return {
    employees,
    pagination: {
      currentPage: page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
