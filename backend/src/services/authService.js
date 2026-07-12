import { prisma } from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

function toPublicUser(user) {
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

async function issueTokens(user) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id });

  // Store a hash of the refresh token so it can be revoked/rotated later —
  // never store it in plaintext.
  const tokenHash = await hashPassword(refreshToken);
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash },
  });

  return { accessToken, refreshToken };
}

export async function register({ email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("An account with this email already exists");
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  const tokens = await issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const tokens = await issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const err = new Error("Invalid or expired refresh token");
    err.status = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    const err = new Error("User no longer exists");
    err.status = 401;
    throw err;
  }

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  return { accessToken };
}
