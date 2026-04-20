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
      error: "Please enter both iduser and password.",
    };
  }

  const result = await authenticateUser(iduser, password);
  if (result.status === "locked") {
    return {
      error: `Too many failed attempts. Try again in ${result.retryAfterMinutes} minute(s).`,
    };
  }

  if (result.status !== "success") {
    return {
      error: "Invalid iduser or password.",
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
