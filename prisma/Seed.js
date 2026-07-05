import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // Tạo sẵn các phòng ban mẫu
  // await prisma.department.createMany({
  //   data: [
  //     { name: "Phòng IT" },
  //     { name: "Phòng Nhân sự" },
  //     { name: "Phòng Kế toán" },
  //     { name: "Phòng Kinh Doanh" },
  //   ],
  // });

  const passwordHash = await bcrypt.hash("Admin123", 10);

  // 3. Tạo User và Employee lồng nhau (Nested Write) bằng Transaction ngầm của Prisma
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      email: "admin@gmail.com",
      passwordHash: passwordHash,
      role: "admin",
      employee: {
        create: {
          code: "NV0001",
          fullName: "Vũ Văn Chiến",
          joinDate: new Date(),
          jobTitle: "Quản trị viên hệ thống",
          salary: 0,
          departmentId: 2,
        },
      },
    },
  });
}

main();
