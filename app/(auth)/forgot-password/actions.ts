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
      error: "Please complete all fields.",
    };
  }

  if (!/^[0-9]{10}$/.test(phone.replace(/\D+/g, ""))) {
    return {
      error: "Please enter a 10-digit phone number.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      error: "Password confirmation does not match.",
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
      error: "No account matched the provided iduser and phone number.",
    };
  }

  redirect("/login?reset=1");
}
