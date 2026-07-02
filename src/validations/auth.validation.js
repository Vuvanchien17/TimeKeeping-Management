import * as z from "zod";

export const User = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu ít nhất phải có 8 ký tự"),
});

export const ChangePasswordSchema = z.object({
  passwordOld: z.string(),
  newPassword: z.string().min(8, "Mật khẩu ít nhất phải có 8 ký tự"),
  confirmPassword: z.string().min(8, "Mật khẩu ít nhất phải có 8 ký tự"),
});

export const EmailSchema = z
  .object({
    email: z.string().trim().email("Email không hợp lệ"),
  })
  .passthrough();

export const ResetPassSchema = z
  .object({
    newPassword: z.string().min(8, "Mật khẩu ít nhất phải có 8 ký tự"),
  })
  .passthrough();
