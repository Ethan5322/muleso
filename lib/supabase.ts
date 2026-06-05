import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Visitor {
  id: string;
  created_at: string;
  page: string;
  device: 'mobile' | 'desktop';
  referrer: string | null;
}

export interface QRScan {
  id: string;
  created_at: string;
  source: string;
}

export interface Booking {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  company?: string;
  client_type?: string;
  service: string;
  budget: string;
  timeline: string;
  contact_method: string;
  project_description: string;
  verification_code: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  client_id?: string;
  client_id_type?: 'national_id' | 'passport';
}
