"use server";

import { redirect } from "next/navigation";
import { createUser, validatePasswordStrength } from "@/lib/auth-store";

type RegisterActionState = {
  error?: string;
};

const unicodeNamePattern = /^[\p{L} ]+$/u;

export async function register(_: RegisterActionState | undefined, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const surname = String(formData.get("surname") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim();
  const ageRaw = String(formData.get("age") ?? "").trim();
  const gradeLevel = String(formData.get("gradeLevel") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const age = Number(ageRaw);

  if (!name || !surname || !nickname || !ageRaw || !gradeLevel || !school || !phone || !password) {
    return {
      error: "Please complete all fields.",
    };
  }

  if (!unicodeNamePattern.test(name)) {
    return {
      error: "Name must contain letters only.",
    };
  }

  if (!unicodeNamePattern.test(surname)) {
    return {
      error: "Surname must contain letters only.",
    };
  }

  if (!unicodeNamePattern.test(nickname)) {
    return {
      error: "Nickname must contain letters only.",
    };
  }

  if (!unicodeNamePattern.test(school)) {
    return {
      error: "School name must contain letters only.",
    };
  }

  if (!Number.isInteger(age) || age <= 0 || age > 120) {
    return {
      error: "Please enter a valid age.",
    };
  }

  if (!/^[0-9]{10}$/.test(phone.replace(/\D+/g, ""))) {
    return {
      error: "Please enter a 10-digit phone number.",
    };
  }

  const passwordValidationError = validatePasswordStrength(password);
  if (passwordValidationError) {
    return {
      error: passwordValidationError,
    };
  }

  const user = await createUser({ name, surname, nickname, age, gradeLevel, school, phone, password });
  const searchParams = new URLSearchParams({
    registered: user.iduser,
    registeredName: user.name,
    registeredSurname: user.surname,
  });

  redirect(`/login?${searchParams.toString()}`);
}
