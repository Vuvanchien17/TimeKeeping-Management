import {
  approveLeaveRequestService,
  createLeaveRequestService,
  getAllLeavesPendingService,
} from "../services/leave.service.js";

export const createLeaveRequest = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const { startDate, endDate, reason, type } = req.body;

    const newLeave = await createLeaveRequestService(
      employeeId,
      startDate,
      endDate,
      reason,
      type,
    );

    return res.status(201).json({
      message: "Tạo đơn thành công, đang chờ phê duyệt",
      data: { leave: newLeave },
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const approveLeaveRequest = async (req, res, next) => {
  try {
    const { id: leaveId } = req.params;
    const { status } = req.body;
    const role = req.user.role;
    const approvedById = req.user.employeeId;

    const approvedLeave = await approveLeaveRequestService(
      leaveId,
      status,
      role,
      approvedById,
    );

    return res.status(200).json({
      message: "Phê duyệt thành công",
      data: { leave: approvedLeave },
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

export const getAllLeavesPending = async (req, res, next) => {
  try {
    const role = req.user.role;
    const approvedById = req.user.employeeId;

    const leavesPending = await getAllLeavesPendingService(role, approvedById);
    return res.status(200).json({
      message: "Lấy dữ liệu thành công",
      data: { leaves: leavesPending },
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};
