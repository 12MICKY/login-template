import Link from "next/link";

export default function AccountRecoveryPage() {
  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.10)]">
        <h1 className="text-3xl font-bold text-slate-950">Forgot iduser / Forgot password</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
          This page collects the recovery flows in one place. You can keep it as a hub or split the
          flows into separate entry points in your own project.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/forgot-iduser"
            className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-5 transition hover:border-blue-300 hover:bg-blue-100"
          >
            <p className="text-sm font-semibold text-blue-900">Forgot iduser</p>
            <p className="mt-2 text-sm leading-6 text-blue-800">
              Recover an iduser using the registered name, surname, and phone number.
            </p>
          </Link>

          <Link
            href="/forgot-password"
            className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 transition hover:border-amber-300 hover:bg-amber-100"
          >
            <p className="text-sm font-semibold text-amber-900">Forgot password</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Set a new password using iduser and phone, then clear all previous sessions.
            </p>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
