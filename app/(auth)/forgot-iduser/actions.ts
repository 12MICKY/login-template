"use server";

import { findUserIdsByIdentity } from "@/lib/auth-store";

export type ForgotIdUserActionState = {
  error?: string;
  success?: boolean;
  matches?: Array<{
    iduser: string;
    name: string;
    surname: string;
    createdAt: string;
  }>;
};

export async function recoverIdUser(_: ForgotIdUserActionState | undefined, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const surname = String(formData.get("surname") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !surname || !phone) {
    return {
      error: "กรุณากรอกชื่อ นามสกุล และเบอร์โทร",
    };
  }

  if (!/^[0-9]{10}$/.test(phone.replace(/\D+/g, ""))) {
    return {
      error: "กรุณากรอกเบอร์โทร 10 หลัก",
    };
  }

  const matches = await findUserIdsByIdentity({ name, surname, phone });
  if (matches.length === 0) {
    return {
      error: "ไม่พบบัญชีที่ตรงกับข้อมูลที่กรอก",
    };
  }

  return {
    success: true,
    matches: matches.map((match) => ({
      iduser: match.iduser,
      name: match.name,
      surname: match.surname,
      createdAt: match.created_at,
    })),
  };
}
