import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // await prisma.department.createMany({
  //   data: [
  //     { name: "Phòng IT" },
  //     { name: "Phòng Nhân sự" },
  //     { name: "Phòng Kế toán" },
  //     { name: "Phòng Kinh Doanh" },
  //   ],
  // });
  // const passwordHash = await bcrypt.hash("Admin123", 10);
  // // 3. Tạo User và Employee lồng nhau (Nested Write) bằng Transaction ngầm của Prisma
  // const admin = await prisma.user.upsert({
  //   where: { email: "admin@gmail.com" },
  //   update: {},
  //   create: {
  //     email: "admin@gmail.com",
  //     passwordHash: passwordHash,
  //     role: "admin",
  //     employee: {
  //       create: {
  //         code: "NV0001",
  //         fullName: "Vũ Văn Chiến",
  //         joinDate: new Date(),
  //         jobTitle: "Quản trị viên hệ thống",
  //         salary: 0,
  //         departmentId: 2,
  //       },
  //     },
  //   },
  // });
  // const saltRounds = 10;
  // const passwordHash = await bcrypt.hash("password123", saltRounds);
  // Danh sách họ tên để ngẫu nhiên hóa dữ liệu một chút
  // const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ"];
  // const dem = ["Văn", "Thị", "Anh", "Minh", "Đức", "Hồng", "Tuấn"];
  // const ten = [
  //   "Hùng",
  //   "Hoa",
  //   "Dũng",
  //   "Lan",
  //   "Nam",
  //   "Mai",
  //   "Tùng",
  //   "Vy",
  //   "Bách",
  // ];
  // const getRandomName = () => {
  //   const rHo = ho[Math.floor(Math.random() * ho.length)];
  //   const rDem = dem[Math.floor(Math.random() * dem.length)];
  //   const rTen = ten[Math.floor(Math.random() * ten.length)];
  //   return `${rHo} ${rDem} ${rTen}`;
  // };
  // Định nghĩa chức vụ mẫu cho từng phòng ban
  // const jobTitles = {
  //   1: [
  //     "Trưởng phòng IT",
  //     "Lập trình viên Fullstack",
  //     "Kỹ sư Hệ thống",
  //     "DevOps Engineer",
  //     "QA Engineer",
  //   ],
  //   2: [
  //     "Trưởng phòng Nhân sự",
  //     "Chuyên viên Tuyển dụng",
  //     "Chuyên viên C&B",
  //     "Nhân viên Đào tạo",
  //     "Trợ lý Nhân sự",
  //   ],
  //   3: [
  //     "Kế toán trưởng",
  //     "Kế toán tổng hợp",
  //     "Kế toán nội bộ",
  //     "Kế toán thuế",
  //     "Nhân viên kiểm kho",
  //   ],
  //   4: [
  //     "Trưởng phòng Kinh doanh",
  //     "Chuyên viên Phát triển Thị trường",
  //     "Nhân viên Sales",
  //     "Account Executive",
  //     "Chăm sóc khách hàng",
  //   ],
  // };
  // console.log("Đang khởi tạo 20 nhân viên...");
  // let employeeCount = 2;
  // Loop qua 4 phòng ban (ID từ 1 đến 4)
  // for (let deptId = 1; deptId <= 4; deptId++) {
  //   // Mỗi phòng ban có 5 nhân viên
  //   for (let empIndex = 1; empIndex <= 5; empIndex++) {
  //     // Nhân viên đầu tiên của phòng (empIndex === 1) sẽ làm Manager, còn lại là Employee
  //     const isManager = empIndex === 1;
  //     const role = isManager ? "manager" : "employee";
  //     // Định dạng mã nhân viên: NV0002, NV0003...
  //     const code = `NV${String(employeeCount).padStart(4, "0")}`;
  //     const email = `user.${code.toLowerCase()}@gmail.com`;
  //     const fullName = getRandomName();
  //     // Lấy job title tương ứng (Manager lấy phần tử đầu tiên, các vị trí sau lấy ngẫu nhiên hoặc theo thứ tự)
  //     const jobTitle = isManager
  //       ? jobTitles[deptId][0]
  //       : jobTitles[deptId][empIndex - 1] || jobTitles[deptId][1];
  //     const salary = isManager ? 25000000 : 12000000; // Ví dụ lương cứng mockup
  //     // Tiến hành Upsert vào Database
  //     await prisma.user.upsert({
  //       where: { email: email },
  //       update: {},
  //       create: {
  //         email: email,
  //         passwordHash: passwordHash,
  //         role: role,
  //         employee: {
  //           create: {
  //             code: code,
  //             fullName: fullName,
  //             joinDate: new Date(),
  //             jobTitle: jobTitle,
  //             salary: salary,
  //             departmentId: deptId,
  //           },
  //         },
  //       },
  //     });
  //     employeeCount++;
  //   }
  // }
  // const employees = await prisma.employee.findMany({
  //   where: {
  //     code: {
  //       not: "NV0001",
  //     },
  //   },
  // });
  // if (employees.length === 0) {
  //   console.log("Không tìm thấy nhân viên nào để thêm dữ liệu học vấn.");
  //   return;
  // }
  // const schools = [
  //   "Đại học Bách Khoa Hà Nội",
  //   "Đại học Kinh tế Quốc dân",
  //   "Đại học Công nghệ - ĐHQGHN",
  //   "Đại học FPT",
  //   "Học viện Bưu chính Viễn thông",
  //   "Đại học Thương Mại",
  // ];
  // const getFieldsByDepartment = (deptId) => {
  //   switch (deptId) {
  //     case 1:
  //       return ["Khoa học máy tính", "Kỹ thuật phần mềm", "Hệ thống thông tin"]; // IT
  //     case 2:
  //       return ["Quản trị nhân lực", "Tâm lý học", "Luật Kinh tế"]; // HR
  //     case 3:
  //       return ["Kế toán - Kiểm toán", "Tài chính ngân hàng", "Kinh tế học"]; // Kế toán
  //     case 4:
  //       return ["Quản trị kinh doanh", "Marketing", "Thương mại điện tử"]; // Kinh doanh
  //     default:
  //       return ["Quản trị kinh doanh"];
  //   }
  // };
  // const educationOperations = [];
  // for (const emp of employees) {
  //   const deptFields = getFieldsByDepartment(emp.departmentId);
  //   const randomSchool1 = schools[Math.floor(Math.random() * schools.length)];
  //   const randomSchool2 = schools[Math.floor(Math.random() * schools.length)];
  //   const randomField1 =
  //     deptFields[Math.floor(Math.random() * deptFields.length)];
  //   const randomField2 =
  //     deptFields[Math.floor(Math.random() * deptFields.length)];
  //   educationOperations.push(
  //     prisma.employeeEducation.create({
  //       data: {
  //         schoolName: randomSchool1,
  //         degree: "Cử nhân / Kỹ sư",
  //         fieldStudy: randomField1,
  //         startYear: 2014,
  //         endYear: 2018,
  //         employeeId: emp.id,
  //       },
  //     }),
  //   );
  //   educationOperations.push(
  //     prisma.employeeEducation.create({
  //       data: {
  //         schoolName: randomSchool2,
  //         degree: "Thạc sĩ / Chuyên gia",
  //         fieldStudy: randomField2,
  //         startYear: 2019,
  //         endYear: 2021,
  //         employeeId: emp.id,
  //       },
  //     }),
  //   );
  // }
  // console.log(`Đang tạo ${educationOperations.length} bản ghi học vấn...`);
  // await Promise.all(educationOperations);
  // const employees = await prisma.employee.findMany({
  //   where: {
  //     code: {
  //       not: "NV0001",
  //     },
  //   },
  // });
  // if (employees.length === 0) {
  //   console.log("Không tìm thấy nhân viên nào để thêm dữ liệu kinh nghiệm.");
  //   return;
  // }
  // const companies = [
  //   "FPT Software",
  //   "VNG Corporation",
  //   "Viettel Group",
  //   "CMC Global",
  //   "MISA JSC",
  //   "Công ty Cổ phần Base Enterprise",
  //   "Tập đoàn Đất Xanh",
  //   "Navigos Group",
  // ];
  // const getPastTitlesByDepartment = (deptId) => {
  //   switch (deptId) {
  //     case 1:
  //       return [
  //         "Junior Developer",
  //         "Web Developer",
  //         "Frontend Engineer",
  //         "Technical Support",
  //       ];
  //     case 2:
  //       return ["Thực tập sinh Nhân sự", "Nhân viên Tuyển dụng", "HR Admin"]; // HR
  //     case 3:
  //       return [
  //         "Trợ lý Kế toán",
  //         "Kế toán viên sơ cấp",
  //         "Nhân viên nhập liệu kế toán",
  //       ];
  //     case 4:
  //       return [
  //         "Cộng tác viên Bán hàng",
  //         "Nhân viên Telesales",
  //         "Sales Thực tập sinh",
  //       ];
  //     default:
  //       return ["Nhân viên văn phòng"];
  //   }
  // };
  // const expOperations = [];
  // for (const emp of employees) {
  //   const pastTitles = getPastTitlesByDepartment(emp.departmentId);
  //   const comp1 = companies[Math.floor(Math.random() * companies.length)];
  //   const comp2 = companies[Math.floor(Math.random() * companies.length)];
  //   const title1 = pastTitles[Math.floor(Math.random() * pastTitles.length)];
  //   const title2 = pastTitles[pastTitles.length > 1 ? 1 : 0];
  //   const startDate1 = new Date();
  //   startDate1.setFullYear(startDate1.getFullYear() - 6);
  //   const endDate1 = new Date();
  //   endDate1.setFullYear(endDate1.getFullYear() - 4);
  //   const startDate2 = new Date();
  //   startDate2.setFullYear(startDate2.getFullYear() - 4);
  //   const endDate2 = new Date();
  //   endDate2.setFullYear(endDate2.getFullYear() - 1);
  //   expOperations.push(
  //     prisma.employeeExp.create({
  //       data: {
  //         company: comp1,
  //         jobTitle: title1,
  //         startDate: startDate1,
  //         endDate: endDate1,
  //         description: `Chịu trách nhiệm thực hiện các công việc liên quan đến vị trí ${title1}, phối hợp với các phòng ban tối ưu quy trình làm việc và hỗ trợ đội nhóm hoàn thành dự án đúng hạn.`,
  //         employeeId: emp.id,
  //       },
  //     }),
  //   );
  //   expOperations.push(
  //     prisma.employeeExp.create({
  //       data: {
  //         company: comp2,
  //         jobTitle: title2,
  //         startDate: startDate2,
  //         endDate: endDate2,
  //         description: `Quản lý luồng công việc chính của mảng ${title2}, trực tiếp báo cáo tiến độ cho cấp trên, tham gia xây dựng và triển khai các giải pháp cải tiến hiệu suất cho doanh nghiệp.`,
  //         employeeId: emp.id,
  //       },
  //     }),
  //   );
  // }
  // console.log(
  //   `Đang tạo ${expOperations.length} bản ghi kinh nghiệm làm việc...`,
  // );
  // await Promise.all(expOperations);
  // const employees = await prisma.employee.findMany({
  //   where: {
  //     code: {
  //       not: "NV0001",
  //     },
  //   },
  // });
  // if (employees.length === 0) {
  //   console.log("Không tìm thấy nhân viên nào để thêm dữ liệu kỹ năng.");
  //   return;
  // }
  // // Danh sách cấp độ thành thạo
  // const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  // Định nghĩa bộ kỹ năng thực tế bám sát theo từng phòng ban (Mỗi phòng ban có ít nhất 4 skill)
  // const skillsByDepartment = {
  //   1: [
  //     "JavaScript/TypeScript",
  //     "React & Node.js",
  //     "SQL & Databases",
  //     "Docker & DevOps",
  //     "Git & GitHub",
  // ], // IT
  // 2: [
  //   "Tuyển dụng & Phỏng vấn",
  //   "Luật Lao động",
  //   "Giao tiếp & Đàm phán",
  //   "Quản trị Nhân sự (HRM)",
  //   "Giải quyết xung đột",
  // ], // HR
  // 3: [
  //   "Sử dụng Excel nâng cao",
  //   "Phần mềm MISA / SAP",
  //   "Báo cáo Tài chính",
  //   "Phân tích số liệu",
  //   "Kế toán Thuế",
  // ], // Kế toán
  // 4: [
  // "Kỹ năng Chốt Sales",
  // "Nghiên cứu Thị trường",
  // "Đàm phán & Thuyết phục",
  // "Sử dụng CRM",
  // "Kỹ năng Thuyết trình",
  // ], // Kinh doanh
  // };
  // const skillOperations = [];
  // for (const emp of employees) {
  //   const availableSkills = skillsByDepartment[emp.departmentId] || [
  //     "Kỹ năng văn phòng",
  //   ];
  // Trộn ngẫu nhiên (Shuffle) danh sách kỹ năng của phòng ban đó để mỗi nhân viên lấy các skill khác nhau
  // const shuffledSkills = [...availableSkills].sort(() => 0.5 - Math.random());
  // Chọn ra 2 kỹ năng đầu tiên sau khi trộn ngẫu nhiên
  // const selectedSkills = shuffledSkills.slice(0, 2);
  // for (const skillName of selectedSkills) {
  // Chọn ngẫu nhiên level, nhưng ưu tiên các mức độ từ Intermediate trở lên cho thực tế
  //     const randomLevel =
  //       levels[Math.floor(Math.random() * (levels.length - 1)) + 1];
  //     skillOperations.push(
  //       prisma.employeeSkill.create({
  //         data: {
  //           name: skillName,
  //           level: randomLevel,
  //           employeeId: emp.id,
  //         },
  //       }),
  //     );
  //   }
  // }
  // console.log(`Đang tạo ${skillOperations.length} bản ghi kỹ năng...`);
  // Thực thi đồng loạt qua Promise.all để tăng tốc độ ghi vào DB
  // await Promise.all(skillOperations);
}

main();
