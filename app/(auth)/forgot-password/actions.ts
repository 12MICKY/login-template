"use server";

import { redirect } from "next/navigation";
import { resetPasswordByIdentity, validatePasswordStrength } from "@/lib/auth-store";

type ForgotPasswordActionState = {
  error?: string;
};

export async function resetPassword(_: ForgotPasswordActionState | undefined, formData: FormData) {
  const iduser = String(formData.get("iduser") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!iduser || !phone || !newPassword || !confirmPassword) {
    return {
      error: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    };
  }

  if (!/^[0-9]{10}$/.test(phone.replace(/\D+/g, ""))) {
    return {
      error: "กรุณากรอกเบอร์โทร 10 หลัก",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      error: "ยืนยันรหัสผ่านใหม่ไม่ตรงกัน",
    };
  }

  const passwordValidationError = validatePasswordStrength(newPassword);
  if (passwordValidationError) {
    return {
      error: passwordValidationError,
    };
  }

  const result = await resetPasswordByIdentity({ iduser, phone, newPassword });
  if (!result) {
    return {
      error: "ไม่พบบัญชีที่ตรงกับ iduser และเบอร์โทร",
    };
  }

  redirect("/login?reset=1");
}
