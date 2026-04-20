import Link from "next/link";

export default function AccountRecoveryPage() {
  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.10)]">
        <h1 className="text-3xl font-bold text-slate-950">ลืม iduser / ลืมรหัสผ่าน</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
          หน้านี้เป็นจุดรวม flow recovery สำหรับ template คุณสามารถแยกไปใช้เดี่ยว ๆ หรือรวมเป็นหน้าเดียวแบบนี้ก็ได้
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/forgot-iduser"
            className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-5 transition hover:border-blue-300 hover:bg-blue-100"
          >
            <p className="text-sm font-semibold text-blue-900">ลืม iduser</p>
            <p className="mt-2 text-sm leading-6 text-blue-800">
              ค้นหา iduser จากชื่อ นามสกุล และเบอร์โทรที่ใช้สมัคร
            </p>
          </Link>

          <Link
            href="/forgot-password"
            className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 transition hover:border-amber-300 hover:bg-amber-100"
          >
            <p className="text-sm font-semibold text-amber-900">ลืมรหัสผ่าน</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              ตั้งรหัสผ่านใหม่จาก iduser และเบอร์โทร พร้อมล้าง session เดิมทั้งหมด
            </p>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
            กลับไปหน้า login
          </Link>
        </div>
      </div>
    </main>
  );
}
