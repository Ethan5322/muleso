-- ============================================================================
-- MuleSoo Corporate Admin — v7: SEED THE ESSENTIAL DEPARTMENTS
-- Creates the standard corporate departments so you can assign every sub-admin
-- to one at registration. Idempotent: only inserts a department if a department
-- with that name doesn't already exist (won't duplicate your backfilled ones).
-- Requires v6 (corp_departments) to have been run first.
-- ============================================================================

do $$
declare
  rec record;
  nextid int;
begin
  for rec in
    select * from (values
      ('Site Management', 'Website content, pages, portfolio, services & SEO'),
      ('Sales',           'Leads, quotes and new-client conversion'),
      ('Operations',      'Project delivery, bookings and scheduling'),
      ('Client Support',  'Customer questions, support and after-care'),
      ('Content',         'Copy, media, guides and social content'),
      ('Finance',         'Payments, invoices and reconciliation')
    ) as t(name, descr)
  loop
    if not exists (select 1 from corp_departments where lower(name) = lower(rec.name)) then
      select coalesce(max(id), 0) + 1 into nextid from corp_departments;
      insert into corp_departments (id, name, description, active) values (nextid, rec.name, rec.descr, true);
    end if;
  end loop;
end $$;

-- Show the result
select id, name, description, active from corp_departments order by id;
