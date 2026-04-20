import Link from "next/link";

export default function HomePage() {
  return (
    <main className="px-4 py-16 sm:px-6">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Reusable authentication starter
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              ตัวอย่างระบบ login พร้อม flow กู้บัญชีและสมัครสมาชิก สำหรับเอาไปต่อยอดในงานอื่น
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              template นี้แยกหน้าและ action สำคัญให้พร้อม ทั้ง login, forgot iduser, forgot password,
              register และตัวอย่าง session ฝั่ง server
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              เปิดหน้า Login
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              ทดลองสมัครสมาชิก
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Login", "เข้าสู่ระบบด้วย iduser และรหัสผ่าน"],
              ["Forgot ID", "ค้นหา iduser จากข้อมูลยืนยันตัวตน"],
              ["Forgot Password", "ตั้งรหัสผ่านใหม่จาก iduser และเบอร์โทร"],
              ["Register", "สมัครสมาชิกพร้อมสร้าง iduser อัตโนมัติ"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
