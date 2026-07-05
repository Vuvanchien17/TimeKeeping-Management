import { success } from "zod";
import prisma from "../config/prisma.js";

export const addEmployeeEducationService = async (
  id,
  name,
  degree,
  fieldStudy,
  startYear,
  endYear,
) => {
  const education = await prisma.employeeEducation.create({
    data: {
      schoolName: name,
      degree,
      fieldStudy,
      startYear: Number(startYear),
      endYear: Number(endYear),
      employeeId: Number(id),
    },
  });

  if (education) return { success: true };
};

export const updateEmployeeEducationService = async (
  educationId,
  name,
  degree,
  fieldStudy,
  startYear,
  endYear,
) => {
  const updateEducation = await prisma.employeeEducation.update({
    where: {
      id: Number(educationId),
    },
    data: {
      schoolName: name,
      degree,
      fieldStudy,
      startYear: startYear ? Number(startYear) : undefined,
      endYear: endYear ? Number(endYear) : undefined,
    },
  });

  if (updateEducation) return { success: true };
};

export const deleteEmployeeEducationService = async (educationId) => {
  const deleteEducation = await prisma.employeeEducation.update({
    where: { id: Number(educationId) },
    data: { isDeleted: true },
  });

  if (deleteEducation) return { success: true };
};
