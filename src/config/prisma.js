import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

prisma
  .$connect()
  .then(() => console.log("Prisma connected to database"))
  .catch((err) => {
    console.error("Prisma connection error: ", err);
    process.exit(1);
  });

export default prisma;
