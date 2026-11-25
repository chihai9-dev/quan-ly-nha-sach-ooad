import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import type { SessionUserDTO } from '@/types/dtos';

export const SESSION_COOKIE_NAME = 'bs_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 tiếng

function getSessionSecret(): string {
  return (
    process.env.AUTH_SESSION_SECRET ||
    'bookstore-ooad-dev-session-secret-change-in-production'
  );
}

interface SessionPayload {
  user: SessionUserDTO;
  exp: number;
}

function sign(data: string): string {
  return createHmac('sha256', getSessionSecret())
    .update(data)
    .digest('base64url');
}

export function createSessionToken(user: SessionUserDTO): string {
  const payload: SessionPayload = {
    user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionUserDTO | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;

  const expectedSig = sign(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf8');
    const payload = JSON.parse(json) as SessionPayload;
    if (!payload.user || typeof payload.exp !== 'number') {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload.user;
  } catch {
    return null;
  }
}

export function getServerSession(): SessionUserDTO | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
  secure: process.env.NODE_ENV === 'production',
};
