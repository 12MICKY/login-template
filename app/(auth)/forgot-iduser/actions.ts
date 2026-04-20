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
      error: "Please enter name, surname, and phone number.",
    };
  }

  if (!/^[0-9]{10}$/.test(phone.replace(/\D+/g, ""))) {
    return {
      error: "Please enter a 10-digit phone number.",
    };
  }

  const matches = await findUserIdsByIdentity({ name, surname, phone });
  if (matches.length === 0) {
    return {
      error: "No account matched the provided information.",
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
