"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Session = {
  user: {
    iduser: string;
    name: string;
    surname: string;
  };
} | null;

export default function Navbar() {
  const [session, setSession] = useState<Session | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setSession(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setSession(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
            LT
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Login Template</p>
            <p className="text-xs text-slate-500">Next.js auth example</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-slate-600 transition hover:text-slate-900">
            Login
          </Link>
          <Link
            href={session ? "/client_area" : "/register"}
            className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700"
          >
            {session ? "Client Area" : "Register"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
