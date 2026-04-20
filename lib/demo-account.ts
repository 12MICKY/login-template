export function getDemoAccount() {
  const iduser = process.env.NEXT_PUBLIC_DEMO_IDUSER?.trim();
  const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD?.trim();

  if (!iduser || !password) {
    return null;
  }

  return { iduser, password };
}
