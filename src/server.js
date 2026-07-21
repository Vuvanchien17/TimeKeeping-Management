import dotenv from "dotenv";
import express from "express";
import rootRoute from "./routes/root.route.js";
import { connectRedis } from "./config/redis.js";
import cookieParser from "cookie-parser";

dotenv.config(); // load env variable
const app = express();
app.use(express.json()); // parser data from client -> JS Object
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ message: "My name is Chien" });
});

app.use("/api/v1", rootRoute);

const startServer = async () => {
  try {
    await connectRedis();
    app.listen(process.env.PORT, () => {
      console.log("Server on port 5000");
    });
  } catch (error) {
    console.log("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

app.use((error, req, res, next) => {
  console.log("Lỗi hệ thống: ", error.message);
  const status = error.statusCode || 500;
  const message = error.message || "Đã xảy ra lỗi hệ thống nội bộ";

  res
    .status(status)
    .json({ status: "error", statusCode: status, message: message });
});
