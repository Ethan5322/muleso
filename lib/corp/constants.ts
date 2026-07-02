/** Capability keys the Super Admin can toggle per department admin. */
export const CAPABILITIES: { key: string; label: string; hint: string }[] = [
  { key: 'can_send_dm', label: 'Send DMs', hint: 'Message other admins privately' },
  { key: 'can_post_channel', label: 'Post to team channel', hint: 'Share updates in the shared channel' },
  { key: 'can_view_department_reports', label: 'View reports', hint: 'See their department reports' },
  { key: 'can_manage_bookings', label: 'Manage bookings', hint: 'Operate on bookings/leads' },
  { key: 'can_export_data', label: 'Export data', hint: 'Export records to file' },
];

export interface CorpAdmin {
  id: string;
  department_id: number | null;
  department_name: string | null;
  display_name: string | null;
  status: 'active' | 'suspended';
  is_super_admin: boolean;
  is_visitor: boolean;
  expires_at: string | null;
  staff_number?: string | null;
  created_at: string;
}
