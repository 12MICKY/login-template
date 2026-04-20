import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logout } from "./actions";

export default async function ClientAreaPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.10)]">
        <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          Session Active
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-950">Client Area</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          เข้าสู่ระบบแล้วในฐานะ <span className="font-semibold">{session.user.iduser}</span> ({session.user.name}{" "}
          {session.user.surname})
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">ตัวอย่างสิ่งที่เช็กได้</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>route protection</li>
              <li>session cookie ฝั่ง server</li>
              <li>logout</li>
            </ul>
          </div>

          <form action={logout} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">ออกจากระบบ</p>
            <p className="mt-3 text-sm text-slate-600">ใช้ปุ่มนี้ทดสอบการล้าง session และ redirect กลับหน้า login</p>
            <button
              type="submit"
              className="mt-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
