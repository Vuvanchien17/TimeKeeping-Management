import {
  createInsuranceService,
  getInsuranceByEmployeeService,
  updateInsuranceService,
} from "../services/insurance.service.js";

export const createInsurance = async (req, res, next) => {
  try {
    const { employeeId, insuranceCode, salaryBase, startDate } = req.body;

    if (!employeeId || !insuranceCode || !salaryBase || !startDate) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const newInsurance = await createInsuranceService(req.body);

    return res.status(201).json({
      message: "Thiết lập hồ sơ bảo hiểm thành công",
      data: { insurance: newInsurance },
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

export const updateInsurance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const updatedInsurance = await updateInsuranceService(employeeId, req.body);

    return res.status(200).json({
      message: "Cập nhật hồ sơ bảo hiểm thành công",
      data: { insurance: updatedInsurance },
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

export const getInsuranceByEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    const insurance = await getInsuranceByEmployeeService(
      employeeId,
      currentUserId,
      currentUserRole,
    );

    return res.status(200).json({
      message: "Lấy thông tin bảo hiểm thành công",
      data: { insurance: insurance },
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};
