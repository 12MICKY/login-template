"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser, createSession } from "@/lib/auth-store";

type LoginActionState = {
  error?: string;
};

export async function login(_: LoginActionState | undefined, formData: FormData) {
  const iduser = String(formData.get("iduser") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!iduser || !password) {
    return {
      error: "กรุณากรอก iduser และรหัสผ่าน",
    };
  }

  const result = await authenticateUser(iduser, password);
  if (result.status === "locked") {
    return {
      error: `ลองใหม่อีกครั้งในอีก ${result.retryAfterMinutes} นาที เนื่องจากกรอกรหัสผ่านผิดหลายครั้ง`,
    };
  }

  if (result.status !== "success") {
    return {
      error: "iduser หรือรหัสผ่านไม่ถูกต้อง",
    };
  }

  const session = await createSession(result.user.iduser);
  const cookieStore = await cookies();

  cookieStore.set("session", session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(session.expiresAt),
    sameSite: "lax",
    path: "/",
  });

  redirect("/client_area");
}
