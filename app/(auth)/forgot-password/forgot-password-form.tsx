"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword } from "./actions";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.10)]">
        <h1 className="text-3xl font-bold text-slate-950">ลืมรหัสผ่าน</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          รีเซ็ตรหัสผ่านด้วย iduser และเบอร์โทรที่ใช้สมัคร
        </p>

        <form action={action} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">iduser</label>
            <input
              name="iduser"
              type="text"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="เช่น GL0001"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">เบอร์โทร</label>
            <input
              name="phone"
              type="tel"
              required
              inputMode="tel"
              maxLength={10}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="0812345678"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">รหัสผ่านใหม่</label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="อย่างน้อย 8 ตัว มี a-z, A-Z, 0-9"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">ยืนยันรหัสผ่านใหม่</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
            />
          </div>

          {state?.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            เมื่อรีเซ็ตรหัสผ่านสำเร็จ ระบบจะล้าง session เดิมทั้งหมดของบัญชีนั้น
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "กำลังรีเซ็ต..." : "รีเซ็ตรหัสผ่าน"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/forgot-iduser" className="font-medium text-blue-600 hover:underline">
            ไปหน้าลืม iduser
          </Link>
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            กลับไปหน้า login
          </Link>
        </div>
      </div>
    </div>
  );
}
