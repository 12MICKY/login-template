import { cookies } from "next/headers";
import { getUserBySessionToken } from "@/lib/auth-store";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  const user = await getUserBySessionToken(token);
  if (!user) {
    return null;
  }

  return {
    user: {
      iduser: user.iduser,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
    },
  };
}
