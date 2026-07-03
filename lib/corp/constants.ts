/**
 * Corporate responsibilities the Super Admin can grant per department admin.
 * (can_send_dm / can_post_channel are also enforced server-side on messaging.)
 */
export const CAPABILITIES: { key: string; label: string; hint: string }[] = [
  { key: 'can_manage_bookings', label: 'Manage bookings', hint: 'View & update bookings, statuses and notes' },
  { key: 'can_manage_leads', label: 'Manage leads', hint: 'Work the leads pipeline & follow-ups' },
  { key: 'can_manage_customers', label: 'Customer records', hint: 'Access and update customer details' },
  { key: 'can_manage_content', label: 'Manage content', hint: 'Edit portfolio, services & site content' },
  { key: 'can_manage_payments', label: 'Payments', hint: 'View and reconcile payments' },
  { key: 'can_respond_support', label: 'Support & chat', hint: 'Respond to customer support / enquiries' },
  { key: 'can_view_department_reports', label: 'View reports', hint: 'See analytics & department reports' },
  { key: 'can_export_data', label: 'Export data', hint: 'Export records to CSV' },
  { key: 'can_send_dm', label: 'Send DMs', hint: 'Message other admins privately' },
  { key: 'can_post_channel', label: 'Post to channel', hint: 'Share updates in the team channel' },
];

/** Ready-made corporate roles — set a sensible responsibility bundle in one tap. */
export const ROLE_PRESETS: { title: string; caps: string[] }[] = [
  { title: 'Operations Manager', caps: ['can_manage_bookings', 'can_manage_leads', 'can_manage_customers', 'can_view_department_reports', 'can_export_data', 'can_send_dm', 'can_post_channel'] },
  { title: 'Sales Representative', caps: ['can_manage_leads', 'can_manage_customers', 'can_view_department_reports', 'can_send_dm', 'can_post_channel'] },
  { title: 'Client Support Agent', caps: ['can_manage_bookings', 'can_respond_support', 'can_manage_customers', 'can_send_dm', 'can_post_channel'] },
  { title: 'Content Manager', caps: ['can_manage_content', 'can_view_department_reports', 'can_send_dm', 'can_post_channel'] },
  { title: 'Finance Officer', caps: ['can_manage_payments', 'can_view_department_reports', 'can_export_data', 'can_send_dm', 'can_post_channel'] },
];

export interface CorpAdmin {
  id: string;
  department_id: number | null;
  department_name: string | null;
  display_name: string | null;
  role_title: string | null;
  status: 'active' | 'suspended';
  is_super_admin: boolean;
  is_visitor: boolean;
  expires_at: string | null;
  suspended_until: string | null;
  staff_number?: string | null;
  created_at: string;
}
