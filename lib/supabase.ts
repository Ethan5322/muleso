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

export interface PortfolioItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  category: 'Website' | 'Chatbot' | 'Logo' | 'QR Code' | 'PDF' | 'Email' | 'Video' | 'Other';
  client_name: string;
  client_type: string;
  image_url: string;
  video_url?: string;
  tech_stack: string[];
  challenge: string;
  solution: string;
  result: string;
  link?: string;
  featured: boolean;
  order: number;
}

export interface CustomPage {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  published: boolean;
  order: number;
}
