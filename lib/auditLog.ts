import { supabase } from './supabase';

export type AuditActionType =
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | '2FA_SENT'
  | '2FA_FAILED'
  | 'LOGOUT'
  | 'PORTFOLIO_CREATE'
  | 'PORTFOLIO_UPDATE'
  | 'PORTFOLIO_DELETE'
  | 'PAGE_CREATE'
  | 'PAGE_UPDATE'
  | 'PAGE_DELETE'
  | 'BOOKING_STATUS_CHANGE'
  | 'BOOKING_DELETE'
  | 'PASSWORD_CHANGE'
  | 'SUSPICIOUS_ACTIVITY';

export interface AuditLogEntry {
  admin_email: string;
  action_type: AuditActionType;
  resource_type?: string;
  resource_id?: string;
  details?: object;
  ip_address?: string;
  user_agent?: string;
  status: 'SUCCESS' | 'FAILED';
  created_at?: string;
}

/**
 * Extract client IP from request
 */
export function getClientIP(request?: any): string {
  if (!request) {
    if (typeof window !== 'undefined') {
      return 'unknown'; // Client-side
    }
    return 'unknown';
  }

  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

/**
 * Log admin action to audit trail
 */
export async function logAdminAction(
  entry: AuditLogEntry
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('admin_audit_logs').insert({
      admin_email: entry.admin_email,
      action_type: entry.action_type,
      resource_type: entry.resource_type,
      resource_id: entry.resource_id,
      details: entry.details,
      ip_address: entry.ip_address || 'unknown',
      user_agent: entry.user_agent || '',
      status: entry.status,
      created_at: entry.created_at || new Date().toISOString(),
    });

    if (error) {
      console.error('Audit log error:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Audit log: ${entry.action_type} - ${entry.admin_email}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error logging admin action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get audit logs for dashboard
 */
export async function getAuditLogs(
  adminEmail: string,
  limit: number = 50,
  offset: number = 0
): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .eq('admin_email', adminEmail)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

/**
 * Get all audit logs (admin view)
 */
export async function getAllAuditLogs(
  limit: number = 100,
  offset: number = 0
): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching all audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all audit logs:', error);
    return [];
  }
}

/**
 * Get audit logs by action type
 */
export async function getAuditLogsByAction(
  actionType: AuditActionType,
  limit: number = 50
): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .eq('action_type', actionType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching audit logs by action:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching audit logs by action:', error);
    return [];
  }
}

/**
 * Get suspicious activities
 */
export async function getSuspiciousActivities(
  limit: number = 50
): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .in('action_type', ['LOGIN_FAILED', '2FA_FAILED', 'SUSPICIOUS_ACTIVITY'])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching suspicious activities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching suspicious activities:', error);
    return [];
  }
}

/**
 * Export audit logs to CSV
 */
export function exportAuditLogsToCSV(logs: AuditLogEntry[]): string {
  const headers = ['Timestamp', 'Admin', 'Action', 'Resource', 'Status', 'IP Address', 'Details'];
  const rows = logs.map(log => [
    log.created_at || '',
    log.admin_email,
    log.action_type,
    `${log.resource_type}:${log.resource_id || 'N/A'}`,
    log.status,
    log.ip_address || 'unknown',
    JSON.stringify(log.details || {}),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
}

/**
 * Download audit logs as CSV file
 */
export function downloadAuditLogsCSV(logs: AuditLogEntry[]): void {
  const csv = exportAuditLogsToCSV(logs);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
