import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/rbac';

export async function GET() {
  const auth = requireAuth();
  if (!auth.ok) return auth.response;

  return NextResponse.json({ user: auth.user });
}
