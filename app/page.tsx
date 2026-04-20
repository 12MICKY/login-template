import Link from "next/link";
import { getDemoAccount } from "@/lib/demo-account";

export default function HomePage() {
  const demoAccount = getDemoAccount();

  return (
    <main className="px-4 py-16 sm:px-6">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Reusable authentication starter
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              A reusable login starter with registration and account recovery flows for your next project
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              This template ships with ready-to-adapt pages and server actions for login, forgot ID,
              forgot password, registration, and a protected session example.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Open Login
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Try Registration
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Login", "Sign in with iduser and password."],
              ["Forgot ID", "Recover an iduser from identity data."],
              ["Forgot Password", "Reset a password using iduser and phone."],
              ["Register", "Create a new account with an auto-generated iduser."],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          {demoAccount && (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-900">Demo Account</p>
              <p className="mt-2 text-sm text-emerald-800">
                iduser: <span className="font-semibold">{demoAccount.iduser}</span>
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                password: <span className="font-semibold">{demoAccount.password}</span>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
