"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.10)]">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            Login Flow
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-950">เข้าสู่ระบบ</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">กรุณาเข้าสู่ระบบด้วย iduser และรหัสผ่าน</p>
        </div>

        <form action={action} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">iduser</label>
            <input
              name="iduser"
              type="text"
              required
              placeholder="เช่น GL0001"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">รหัสผ่าน</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
            {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <Link href="/account-recovery" className="font-medium text-blue-600 hover:underline">
              ลืม iduser / ลืมรหัสผ่าน
            </Link>
            <span className="text-slate-300">|</span>
            <span>ยังไม่มีบัญชี?</span>
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
