create table if not exists public.orbita_workbook_drafts (
 user_id uuid not null references auth.users(id) on delete cascade,
 session_key text not null,
 answers jsonb not null default '[]'::jsonb check (jsonb_typeof(answers)='array'),
 answer_mode text not null default 'online' check (answer_mode in ('online','paper')),
 updated_at timestamptz not null default now(),
 primary key (user_id,session_key)
);
alter table public.orbita_workbook_drafts enable row level security;
revoke all on public.orbita_workbook_drafts from anon, authenticated;
grant select,insert,update,delete on public.orbita_workbook_drafts to authenticated;
create policy workbook_select_own on public.orbita_workbook_drafts for select to authenticated using ((select auth.uid())=user_id);
create policy workbook_insert_own on public.orbita_workbook_drafts for insert to authenticated with check ((select auth.uid())=user_id);
create policy workbook_update_own on public.orbita_workbook_drafts for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy workbook_delete_own on public.orbita_workbook_drafts for delete to authenticated using ((select auth.uid())=user_id);
