"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { register } from "./actions";

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);
  const validatedFieldClassName =
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [&:not(:placeholder-shown):invalid]:border-red-400 [&:not(:placeholder-shown):invalid]:ring-2 [&:not(:placeholder-shown):invalid]:ring-red-500/20";

  const handleLetterOnlyInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/[^A-Za-zก-๙ ]+/g, "");
    input.setCustomValidity(input.value ? "" : "กรุณากรอกข้อมูลนี้");
  };

  const handleAgeInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/\D+/g, "").slice(0, 3);

    if (!input.value) {
      input.setCustomValidity("กรุณากรอกข้อมูลนี้");
      return;
    }

    const age = Number(input.value);
    input.setCustomValidity(age >= 1 && age <= 120 ? "" : "กรุณากรอกอายุ 1-120 ปี");
  };

  const handlePhoneInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/\D+/g, "").slice(0, 10);

    if (!input.value) {
      input.setCustomValidity("กรุณากรอกข้อมูลนี้");
      return;
    }

    input.setCustomValidity(input.value.length === 10 ? "" : "กรุณากรอกเบอร์โทร 10 หลัก");
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.10)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-950">สมัครสมาชิก</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            กรอกข้อมูลเพื่อสร้างบัญชีใหม่ ระบบจะสร้าง iduser ให้อัตโนมัติ
          </p>
          <p className="mt-1 text-xs text-slate-500">รหัสผ่านต้องมีอย่างน้อย 8 ตัว และต้องมี a-z, A-Z, 0-9</p>
        </div>

        <form action={action} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">ชื่อ</label>
              <input
                name="name"
                type="text"
                required
                pattern="[A-Za-zก-๙ ]+"
                title="กรอกชื่อเป็นตัวอักษรเท่านั้น"
                className={validatedFieldClassName}
                placeholder="ชื่อ"
                onInput={handleLetterOnlyInput}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">นามสกุล</label>
              <input
                name="surname"
                type="text"
                required
                pattern="[A-Za-zก-๙ ]+"
                title="กรอกนามสกุลเป็นตัวอักษรเท่านั้น"
                className={validatedFieldClassName}
                placeholder="นามสกุล"
                onInput={handleLetterOnlyInput}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">ชื่อเล่น</label>
              <input
                name="nickname"
                type="text"
                required
                pattern="[A-Za-zก-๙ ]+"
                title="กรอกชื่อเล่นเป็นตัวอักษรเท่านั้น"
                className={validatedFieldClassName}
                placeholder="ชื่อเล่น"
                onInput={handleLetterOnlyInput}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">อายุ</label>
              <input
                name="age"
                type="text"
                required
                inputMode="numeric"
                pattern="[0-9]+"
                title="กรอกอายุเป็นตัวเลขเท่านั้น"
                className={validatedFieldClassName}
                placeholder="อายุ"
                onInput={handleAgeInput}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">ระดับชั้น</label>
            <input
              name="gradeLevel"
              type="text"
              required
              className={validatedFieldClassName}
              placeholder="เช่น ม.4 หรือ ป.6"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">โรงเรียน</label>
            <input
              name="school"
              type="text"
              required
              pattern="[A-Za-zก-๙ ]+"
              title="กรอกชื่อโรงเรียนเป็นตัวอักษรเท่านั้น"
              className={validatedFieldClassName}
              placeholder="ชื่อโรงเรียน"
              onInput={handleLetterOnlyInput}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">เบอร์โทร</label>
            <input
              name="phone"
              type="tel"
              required
              inputMode="tel"
              pattern="[0-9]{10}"
              title="กรอกเบอร์โทรเป็นตัวเลขเท่านั้น"
              className={validatedFieldClassName}
              placeholder="0812345678"
              maxLength={10}
              onInput={handlePhoneInput}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">รหัสผ่าน</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className={validatedFieldClassName}
              placeholder="อย่างน้อย 8 ตัว มี a-z, A-Z, 0-9"
            />
          </div>

          {state?.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
