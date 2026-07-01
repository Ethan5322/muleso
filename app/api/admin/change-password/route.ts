import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { verifyAdminPassword, setAdminPassword } from '@/lib/adminPassword';

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || String(newPassword).length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
    }

    const { valid, configured } = await verifyAdminPassword(currentPassword);
    if (configured && !valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    await setAdminPassword(String(newPassword));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('change-password error:', error);
    return NextResponse.json({ error: error.message || 'Failed to change password' }, { status: 500 });
  }
}
