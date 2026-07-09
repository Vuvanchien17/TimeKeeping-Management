import express from "express";
import authRoute from "./auth.route.js";
import employeeRoute from "./employee.route.js";
import expRoute from "./exp.route.js";
import educationRoute from "./education.route.js";
import skillRoute from "./skill.route.js";
import leaveRoute from "./leave.route.js";
import attendanceRoute from "./attendance.route.js";
import payrollRoute from "./payroll.route.js";
const router = express.Router();

router.use("/auth", authRoute);
router.use("/employees", employeeRoute);

router.use("/employees/:id/exps", expRoute);
router.use("/exps", expRoute);

router.use("/employees/:id/skills", skillRoute);
router.use("/skills", skillRoute);

router.use("/employee/:id/educations", educationRoute);
router.use("/educations", educationRoute);

router.use("/leave-requests", leaveRoute);

router.use("/attendance", attendanceRoute);

router.use("/payrolls", payrollRoute);

export default router;
