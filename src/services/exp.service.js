import { success } from "zod";
import prisma from "../config/prisma.js";

export const addEmployeeExpService = async (
  id,
  company,
  jobTitle,
  startDate,
  endDate,
  description,
) => {
  const exp = await prisma.employeeExp.create({
    data: {
      employeeId: Number(id),
      company,
      jobTitle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
    },
  });

  return exp;
};

export const updateEmployeeExpService = async (
  expId,
  company,
  jobTitle,
  startDate,
  endDate,
  description,
) => {
  const updateExp = await prisma.employeeExp.update({
    where: { id: Number(expId) },
    data: {
      company,
      jobTitle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
    },
  });

  return updateExp;
};

export const deleteEmployeeExpService = async (expId) => {
  const deleteExp = await prisma.employeeExp.update({
    where: {
      id: Number(expId),
    },
    data: {
      isDeleted: true,
    },
  });

  if (deleteExp) return { success: true };
};
