"use client";

import Link from "next/link";
import { useActionState } from "react";
import { recoverIdUser } from "./actions";

export function ForgotIdUserForm() {
  const [state, action, pending] = useActionState(recoverIdUser, undefined);

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.10)]">
        <h1 className="text-3xl font-bold text-slate-950">ลืม iduser</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          กรอกชื่อ นามสกุล และเบอร์โทรที่ใช้สมัคร เพื่อค้นหา iduser
        </p>

        <form action={action} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">ชื่อ</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">นามสกุล</label>
            <input
              name="surname"
              type="text"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
            />
          </div>

          {state?.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          {state?.matches && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
              <p className="font-semibold">พบบัญชีที่ตรงกับข้อมูลของคุณ</p>
              <div className="mt-3 space-y-2">
                {state.matches.map((match) => (
                  <div key={match.iduser} className="rounded-xl border border-green-200 bg-white px-3 py-2">
                    <p>
                      iduser: <span className="font-semibold">{match.iduser}</span>
                    </p>
                    <p className="text-green-700">
                      {match.name} {match.surname}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "กำลังค้นหา..." : "ค้นหา iduser"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline">
            ไปหน้าลืมรหัสผ่าน
          </Link>
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            กลับไปหน้า login
          </Link>
        </div>
      </div>
    </div>
  );
}
