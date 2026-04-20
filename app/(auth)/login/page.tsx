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
                สมัครสมาชิกสำเร็จ
                {registeredFullName && (
                  <>
                    {" "}
                    สำหรับ <span className="font-semibold">{registeredFullName}</span>
                  </>
                )}{" "}
                iduser ของคุณคือ <span className="font-semibold">{params.registered}</span>
              </>
            )}
            {!params.registered && params.reset && <>รีเซ็ตรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง</>}
          </div>
        </div>
      )}

      <LoginForm />
    </main>
  );
}
