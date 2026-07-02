-- ============================================================================
-- MuleSoo Corporate Admin — enable Supabase Realtime for instant delivery.
-- Run ONCE, after corporate_admin.sql. If a table is already in the publication
-- you'll get a notice — that's fine, ignore it.
-- (Even without this, the UI falls back to polling every ~8 seconds.)
-- ============================================================================

alter publication supabase_realtime add table corp_direct_messages;
alter publication supabase_realtime add table corp_team_channel_messages;
alter publication supabase_realtime add table corp_message_reactions;
