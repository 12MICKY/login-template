"use server";

import { redirect } from "next/navigation";
import { createUser, validatePasswordStrength } from "@/lib/auth-store";

type RegisterActionState = {
  error?: string;
};

const thaiEnglishNamePattern = /^[A-Za-zก-๙ ]+$/;

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
      error: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    };
  }

  if (!thaiEnglishNamePattern.test(name)) {
    return {
      error: "กรุณากรอกชื่อเป็นตัวอักษรเท่านั้น",
    };
  }

  if (!thaiEnglishNamePattern.test(surname)) {
    return {
      error: "กรุณากรอกนามสกุลเป็นตัวอักษรเท่านั้น",
    };
  }

  if (!thaiEnglishNamePattern.test(nickname)) {
    return {
      error: "กรุณากรอกชื่อเล่นเป็นตัวอักษรเท่านั้น",
    };
  }

  if (!thaiEnglishNamePattern.test(school)) {
    return {
      error: "กรุณากรอกชื่อโรงเรียนเป็นตัวอักษรเท่านั้น",
    };
  }

  if (!Number.isInteger(age) || age <= 0 || age > 120) {
    return {
      error: "กรุณากรอกอายุให้ถูกต้อง",
    };
  }

  if (!/^[0-9]{10}$/.test(phone.replace(/\D+/g, ""))) {
    return {
      error: "กรุณากรอกเบอร์โทร 10 หลัก",
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
