import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { Pool } from "pg";

export type StoredUser = {
  iduser: string;
  name: string;
  surname: string;
  nickname: string;
  age: number | null;
  gradeLevel: string;
  school: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

export type AuthenticateUserResult =
  | { status: "success"; user: StoredUser }
  | { status: "invalid" }
  | { status: "locked"; retryAfterMinutes: number };

type StoredSession = {
  token: string;
  userId: string;
  expiresAt: string;
};

const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;
const maxFailedLoginAttempts = getPositiveIntegerEnv("MAX_FAILED_LOGIN_ATTEMPTS", 5);
const loginLockDurationMs = getPositiveIntegerEnv("LOGIN_LOCK_DURATION_MS", 15 * 60 * 1000);

declare global {
  var __loginTemplatePool: Pool | undefined;
  var __loginTemplateSchemaInit: Promise<void> | undefined;
}

type DemoSeedConfig = {
  iduser: string;
  name: string;
  surname: string;
  nickname: string;
  age: number | null;
  gradeLevel: string;
  school: string;
  phone: string;
  password: string;
};

function getPositiveIntegerEnv(name: string, fallbackValue: number) {
  const rawValue = process.env[name];
  if (!rawValue) {
    return fallbackValue;
  }

  const parsedValue = Number(rawValue);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallbackValue;
  }

  return parsedValue;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  return databaseUrl;
}

function getOptionalTrimmedEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function getDemoSeedConfig(): DemoSeedConfig | null {
  const password = process.env.DEMO_USER_PASSWORD;
  if (!password) {
    return null;
  }

  const iduser = normalizeIdUser(process.env.DEMO_USER_IDUSER ?? "GL0001");
  const ageRaw = getOptionalTrimmedEnv("DEMO_USER_AGE");
  const age = ageRaw ? Number(ageRaw) : 16;

  return {
    iduser,
    name: getOptionalTrimmedEnv("DEMO_USER_NAME") ?? "Demo",
    surname: getOptionalTrimmedEnv("DEMO_USER_SURNAME") ?? "Student",
    nickname: getOptionalTrimmedEnv("DEMO_USER_NICKNAME") ?? "Demo",
    age: Number.isInteger(age) ? age : 16,
    gradeLevel: getOptionalTrimmedEnv("DEMO_USER_GRADE_LEVEL") ?? "Grade 10",
    school: getOptionalTrimmedEnv("DEMO_USER_SCHOOL") ?? "Demo School",
    phone: normalizePhone(process.env.DEMO_USER_PHONE ?? "0812345678"),
    password,
  };
}

function getPool() {
  if (!global.__loginTemplatePool) {
    global.__loginTemplatePool = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  return global.__loginTemplatePool;
}

async function ensureSchema() {
  if (!global.__loginTemplateSchemaInit) {
    global.__loginTemplateSchemaInit = (async () => {
      const pool = getPool();

      await pool.query(`
        CREATE SEQUENCE IF NOT EXISTS user_iduser_seq START 1;

        CREATE TABLE IF NOT EXISTS users (
          iduser TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          surname TEXT NOT NULL,
          nickname TEXT NOT NULL DEFAULT '',
          age INTEGER,
          grade_level TEXT NOT NULL DEFAULT '',
          school TEXT NOT NULL DEFAULT '',
          phone TEXT NOT NULL DEFAULT '',
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS session_tokens (
          token_hash TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(iduser) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS login_attempts (
          identifier TEXT PRIMARY KEY,
          failed_attempts INTEGER NOT NULL DEFAULT 0,
          locked_until TIMESTAMPTZ,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_session_tokens_user_id ON session_tokens(user_id);
        CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until ON login_attempts(locked_until);
        CREATE INDEX IF NOT EXISTS idx_users_identity_lookup ON users(LOWER(name), LOWER(surname), phone);
      `);

      const demoSeed = getDemoSeedConfig();
      if (demoSeed) {
        await pool.query(
          `
            INSERT INTO users (iduser, name, surname, nickname, age, grade_level, school, phone, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (iduser)
            DO UPDATE SET
              name = EXCLUDED.name,
              surname = EXCLUDED.surname,
              nickname = EXCLUDED.nickname,
              age = EXCLUDED.age,
              grade_level = EXCLUDED.grade_level,
              school = EXCLUDED.school,
              phone = EXCLUDED.phone,
              password_hash = EXCLUDED.password_hash
          `,
          [
            demoSeed.iduser,
            normalizeName(demoSeed.name),
            normalizeName(demoSeed.surname),
            normalizeName(demoSeed.nickname),
            demoSeed.age,
            demoSeed.gradeLevel,
            normalizeName(demoSeed.school),
            normalizePhone(demoSeed.phone),
            hashPassword(demoSeed.password),
          ],
        );
      }
    })();
  }

  await global.__loginTemplateSchemaInit;
}

function normalizeIdUser(iduser: string) {
  return iduser.trim().toUpperCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/\D+/g, "").slice(0, 10);
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const incomingHash = scryptSync(password, salt, 64);
  const existingHash = Buffer.from(storedHash, "hex");

  if (incomingHash.length !== existingHash.length) {
    return false;
  }

  return timingSafeEqual(incomingHash, existingHash);
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function validatePasswordStrength(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number.";
  }

  return null;
}

async function getLoginAttemptState(identifier: string) {
  const pool = getPool();
  const result = await pool.query<{
    failed_attempts: number;
    locked_until: string | null;
  }>(
    `
      SELECT failed_attempts, locked_until
      FROM login_attempts
      WHERE identifier = $1
      LIMIT 1
    `,
    [identifier],
  );

  return result.rows[0] ?? null;
}

async function recordFailedLoginAttempt(identifier: string) {
  const pool = getPool();
  const existingAttempt = await getLoginAttemptState(identifier);
  const failedAttempts = (existingAttempt?.failed_attempts ?? 0) + 1;
  const shouldLock = failedAttempts >= maxFailedLoginAttempts;
  const lockedUntil = shouldLock ? new Date(Date.now() + loginLockDurationMs).toISOString() : null;

  await pool.query(
    `
      INSERT INTO login_attempts (identifier, failed_attempts, locked_until, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (identifier)
      DO UPDATE SET
        failed_attempts = EXCLUDED.failed_attempts,
        locked_until = EXCLUDED.locked_until,
        updated_at = NOW()
    `,
    [identifier, failedAttempts, lockedUntil],
  );

  if (!lockedUntil) {
    return null;
  }

  return Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 60000);
}

async function clearLoginAttempts(identifier: string) {
  const pool = getPool();
  await pool.query("DELETE FROM login_attempts WHERE identifier = $1", [identifier]);
}

export async function createUser(input: {
  name: string;
  surname: string;
  nickname: string;
  age: number;
  gradeLevel: string;
  school: string;
  phone: string;
  password: string;
}) {
  await ensureSchema();
  const pool = getPool();
  const passwordHash = hashPassword(input.password);
  const result = await pool.query<{
    iduser: string;
    name: string;
    surname: string;
    nickname: string;
    age: number | null;
    grade_level: string;
    school: string;
    phone: string;
    password_hash: string;
    created_at: string;
  }>(
    `
      INSERT INTO users (iduser, name, surname, nickname, age, grade_level, school, phone, password_hash)
      VALUES (
        'GL' || LPAD(nextval('user_iduser_seq')::text, 4, '0'),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )
      RETURNING iduser, name, surname, nickname, age, grade_level, school, phone, password_hash, created_at
    `,
    [
      normalizeName(input.name),
      normalizeName(input.surname),
      normalizeName(input.nickname),
      input.age,
      input.gradeLevel.trim(),
      normalizeName(input.school),
      normalizePhone(input.phone),
      passwordHash,
    ],
  );

  const user = result.rows[0];

  return {
    iduser: user.iduser,
    name: user.name,
    surname: user.surname,
    nickname: user.nickname,
    age: user.age,
    gradeLevel: user.grade_level,
    school: user.school,
    phone: user.phone,
    passwordHash: user.password_hash,
    createdAt: user.created_at,
  } satisfies StoredUser;
}

export async function authenticateUser(iduser: string, password: string): Promise<AuthenticateUserResult> {
  await ensureSchema();
  const normalizedIdUser = normalizeIdUser(iduser);
  const loginAttempt = await getLoginAttemptState(normalizedIdUser);

  if (loginAttempt?.locked_until) {
    const retryAfterMs = new Date(loginAttempt.locked_until).getTime() - Date.now();
    if (retryAfterMs > 0) {
      return {
        status: "locked",
        retryAfterMinutes: Math.ceil(retryAfterMs / 60000),
      };
    }

    await clearLoginAttempts(normalizedIdUser);
  }

  const pool = getPool();
  const result = await pool.query<{
    iduser: string;
    name: string;
    surname: string;
    nickname: string;
    age: number | null;
    grade_level: string;
    school: string;
    phone: string;
    password_hash: string;
    created_at: string;
  }>(
    `
      SELECT iduser, name, surname, nickname, age, grade_level, school, phone, password_hash, created_at
      FROM users
      WHERE iduser = $1
      LIMIT 1
    `,
    [normalizedIdUser],
  );

  const user = result.rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) {
    const retryAfterMinutes = await recordFailedLoginAttempt(normalizedIdUser);
    if (retryAfterMinutes) {
      return {
        status: "locked",
        retryAfterMinutes,
      };
    }

    return {
      status: "invalid",
    };
  }

  await clearLoginAttempts(normalizedIdUser);

  return {
    status: "success",
    user: {
      iduser: user.iduser,
      name: user.name,
      surname: user.surname,
      nickname: user.nickname,
      age: user.age,
      gradeLevel: user.grade_level,
      school: user.school,
      phone: user.phone,
      passwordHash: user.password_hash,
      createdAt: user.created_at,
    },
  };
}

export async function createSession(userId: string) {
  await ensureSchema();
  const pool = getPool();
  const token = randomBytes(32).toString("hex");
  const session: StoredSession = {
    token,
    userId,
    expiresAt: new Date(Date.now() + sessionDurationMs).toISOString(),
  };

  await pool.query("DELETE FROM session_tokens WHERE user_id = $1", [userId]);
  await pool.query(
    `
      INSERT INTO session_tokens (token_hash, user_id, expires_at)
      VALUES ($1, $2, $3)
    `,
    [hashSessionToken(token), userId, session.expiresAt],
  );

  return session;
}

export async function getUserBySessionToken(token: string) {
  await ensureSchema();
  const pool = getPool();

  await pool.query("DELETE FROM session_tokens WHERE expires_at <= NOW()");

  const result = await pool.query<{
    iduser: string;
    name: string;
    surname: string;
    nickname: string;
    age: number | null;
    grade_level: string;
    school: string;
    phone: string;
    password_hash: string;
    created_at: string;
  }>(
    `
      SELECT u.iduser, u.name, u.surname, u.nickname, u.age, u.grade_level, u.school, u.phone, u.password_hash, u.created_at
      FROM session_tokens s
      JOIN users u ON u.iduser = s.user_id
      WHERE s.token_hash = $1
      LIMIT 1
    `,
    [hashSessionToken(token)],
  );

  const user = result.rows[0];
  if (!user) {
    return null;
  }

  return {
    iduser: user.iduser,
    name: user.name,
    surname: user.surname,
    nickname: user.nickname,
    age: user.age,
    gradeLevel: user.grade_level,
    school: user.school,
    phone: user.phone,
    passwordHash: user.password_hash,
    createdAt: user.created_at,
  } satisfies StoredUser;
}

export async function deleteSession(token: string) {
  await ensureSchema();
  const pool = getPool();
  await pool.query("DELETE FROM session_tokens WHERE token_hash = $1", [hashSessionToken(token)]);
}

export async function findUserIdsByIdentity(input: {
  name: string;
  surname: string;
  phone: string;
}) {
  await ensureSchema();
  const pool = getPool();
  const result = await pool.query<{
    iduser: string;
    name: string;
    surname: string;
    created_at: string;
  }>(
    `
      SELECT iduser, name, surname, created_at
      FROM users
      WHERE LOWER(name) = LOWER($1)
        AND LOWER(surname) = LOWER($2)
        AND phone = $3
      ORDER BY created_at ASC
    `,
    [normalizeName(input.name), normalizeName(input.surname), normalizePhone(input.phone)],
  );

  return result.rows;
}

export async function resetPasswordByIdentity(input: {
  iduser: string;
  phone: string;
  newPassword: string;
}) {
  await ensureSchema();
  const pool = getPool();
  const normalizedIdUser = normalizeIdUser(input.iduser);
  const phone = normalizePhone(input.phone);
  const passwordHash = hashPassword(input.newPassword);

  const result = await pool.query<{ iduser: string }>(
    `
      UPDATE users
      SET password_hash = $3
      WHERE iduser = $1
        AND phone = $2
      RETURNING iduser
    `,
    [normalizedIdUser, phone, passwordHash],
  );

  if (result.rowCount === 0) {
    return null;
  }

  await pool.query("DELETE FROM session_tokens WHERE user_id = $1", [normalizedIdUser]);
  await clearLoginAttempts(normalizedIdUser);

  return result.rows[0];
}
