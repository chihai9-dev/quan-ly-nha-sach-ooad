import { NextResponse } from 'next/server';
import { ReportService } from '@/services/ReportService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';

const reportService = new ReportService();

export async function GET() {
  const auth = requirePermission(PERMISSIONS.THONG_KE_BAO_CAO);
  if (!auth.ok) return auth.response;

  try {
    const report = await reportService.getFullReport();
    return NextResponse.json({ report });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tổng hợp báo cáo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
