import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; registeredName?: string; registeredSurname?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const registeredFullName = [params.registeredName, params.registeredSurname].filter(Boolean).join(" ");

  return (
    <main>
      {(params.registered || params.reset) && (
        <div className="mx-auto max-w-md px-4 pt-8">
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {params.registered && (
              <>
                Registration completed successfully
                {registeredFullName && (
                  <>
                    {" "}for <span className="font-semibold">{registeredFullName}</span>
                  </>
                )}. Your iduser is <span className="font-semibold">{params.registered}</span>
              </>
            )}
            {!params.registered && params.reset && <>Password reset successful. Please sign in again.</>}
          </div>
        </div>
      )}

      <LoginForm />
    </main>
  );
}
