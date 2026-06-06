-- Migration: Add security tables for 2FA, audit logs, rate limiting, and alerts
-- This migration adds enterprise security features to the admin panel

-- Table: two_factor_codes
-- Stores temporary 2FA codes sent to admin email
CREATE TABLE IF NOT EXISTS two_factor_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  code VARCHAR(6) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,

  CONSTRAINT two_factor_codes_email_fk FOREIGN KEY (admin_email) REFERENCES auth.users(email)
);

CREATE INDEX IF NOT EXISTS idx_two_factor_codes_email ON two_factor_codes(admin_email);
CREATE INDEX IF NOT EXISTS idx_two_factor_codes_verified ON two_factor_codes(verified);
CREATE INDEX IF NOT EXISTS idx_two_factor_codes_expires ON two_factor_codes(expires_at);

-- Table: admin_audit_logs
-- Complete audit trail of all admin actions
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT,
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'SUCCESS',
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT audit_logs_email_fk FOREIGN KEY (admin_email) REFERENCES auth.users(email)
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_email ON admin_audit_logs(admin_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON admin_audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON admin_audit_logs(status);

-- Table: rate_limit_events
-- Tracks rate limit violations and lockouts
CREATE TABLE IF NOT EXISTS rate_limit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_ip ON rate_limit_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limit_events_type ON rate_limit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_rate_limit_events_created_at ON rate_limit_events(created_at);

-- Table: security_alerts
-- Security alerts for suspicious activity
CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(50) NOT NULL,
  admin_email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_info TEXT,
  location TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT security_alerts_email_fk FOREIGN KEY (admin_email) REFERENCES auth.users(email)
);

CREATE INDEX IF NOT EXISTS idx_security_alerts_email ON security_alerts(admin_email);
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_security_alerts_acknowledged ON security_alerts(acknowledged);

-- Table: device_fingerprints
-- Track known devices for suspicious login detection
CREATE TABLE IF NOT EXISTS device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  last_seen TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT device_fingerprints_email_fk FOREIGN KEY (admin_email) REFERENCES auth.users(email),
  UNIQUE(admin_email, device_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_device_fingerprints_email ON device_fingerprints(admin_email);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_last_seen ON device_fingerprints(last_seen);

-- Table: login_history
-- Track all login attempts (successful and failed)
CREATE TABLE IF NOT EXISTS login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT,
  ip_address TEXT NOT NULL,
  device_fingerprint TEXT,
  success BOOLEAN DEFAULT FALSE,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT login_history_email_fk FOREIGN KEY (admin_email) REFERENCES auth.users(email)
);

CREATE INDEX IF NOT EXISTS idx_login_history_email ON login_history(admin_email);
CREATE INDEX IF NOT EXISTS idx_login_history_ip ON login_history(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_history_success ON login_history(success);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON login_history(created_at);

-- Enable Row Level Security (RLS) on sensitive tables
ALTER TABLE two_factor_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin can view own audit logs" ON admin_audit_logs
  FOR SELECT
  USING (admin_email = auth.jwt() ->> 'email');

CREATE POLICY "Admin can view own security alerts" ON security_alerts
  FOR SELECT
  USING (admin_email = auth.jwt() ->> 'email');

CREATE POLICY "Admin can view own device fingerprints" ON device_fingerprints
  FOR SELECT
  USING (admin_email = auth.jwt() ->> 'email');

CREATE POLICY "Admin can view own login history" ON login_history
  FOR SELECT
  USING (admin_email = auth.jwt() ->> 'email');

-- Clean up expired 2FA codes regularly
-- Note: You'll need to set up a cron job or trigger for this
-- ALTER TABLE two_factor_codes SET (autovacuum_vacuum_scale_factor = 0.0, autovacuum_vacuum_threshold = 0);

PRINT 'Security tables created successfully!';
