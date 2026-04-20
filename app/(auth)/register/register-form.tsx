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
    input.value = input.value.replace(/[^\p{L} ]+/gu, "");
    input.setCustomValidity(input.value ? "" : "Please fill out this field.");
  };

  const handleAgeInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/\D+/g, "").slice(0, 3);

    if (!input.value) {
      input.setCustomValidity("Please fill out this field.");
      return;
    }

    const age = Number(input.value);
    input.setCustomValidity(age >= 1 && age <= 120 ? "" : "Please enter an age between 1 and 120.");
  };

  const handlePhoneInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/\D+/g, "").slice(0, 10);

    if (!input.value) {
      input.setCustomValidity("Please fill out this field.");
      return;
    }

    input.setCustomValidity(input.value.length === 10 ? "" : "Please enter a 10-digit phone number.");
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_90px_rgba(15,23,42,0.10)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-950">Register</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create a new account. The system will generate an iduser automatically.
          </p>
          <p className="mt-1 text-xs text-slate-500">Passwords must be at least 8 characters and include a-z, A-Z, and 0-9.</p>
        </div>

        <form action={action} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input
                name="name"
                type="text"
                required
                className={validatedFieldClassName}
                placeholder="Name"
                onInput={handleLetterOnlyInput}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Surname</label>
              <input
                name="surname"
                type="text"
                required
                className={validatedFieldClassName}
                placeholder="Surname"
                onInput={handleLetterOnlyInput}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nickname</label>
              <input
                name="nickname"
                type="text"
                required
                className={validatedFieldClassName}
                placeholder="Nickname"
                onInput={handleLetterOnlyInput}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
              <input
                name="age"
                type="text"
                required
                inputMode="numeric"
                pattern="[0-9]+"
                className={validatedFieldClassName}
                placeholder="Age"
                onInput={handleAgeInput}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Grade Level</label>
            <input
              name="gradeLevel"
              type="text"
              required
              className={validatedFieldClassName}
              placeholder="e.g. Grade 10 or Year 6"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">School</label>
            <input
              name="school"
              type="text"
              required
              className={validatedFieldClassName}
              placeholder="School"
              onInput={handleLetterOnlyInput}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
            <input
              name="phone"
              type="tel"
              required
              inputMode="tel"
              pattern="[0-9]{10}"
              className={validatedFieldClassName}
              placeholder="0812345678"
              maxLength={10}
              onInput={handlePhoneInput}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className={validatedFieldClassName}
              placeholder="At least 8 characters with a-z, A-Z, and 0-9"
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
            {pending ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
