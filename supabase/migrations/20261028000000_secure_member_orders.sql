-- Adds a database-owned admin role and secures the existing orders table.
-- Apply only after confirming the deployed orders columns match this migration.

create table if not exists public.jbm_user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

alter table public.jbm_user_roles enable row level security;
revoke all on public.jbm_user_roles from anon, authenticated;

create or replace function public.jbm_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.jbm_user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.jbm_is_admin() from public, anon;
grant execute on function public.jbm_is_admin() to authenticated;

create table if not exists public.jbm_member_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text not null,
  updated_at timestamptz not null default now(),
  constraint jbm_member_profiles_phone_format
    check (phone ~ '^\+[1-9][0-9]{7,14}$')
);

alter table public.jbm_member_profiles enable row level security;
revoke all on public.jbm_member_profiles from anon;
grant select, insert, update on public.jbm_member_profiles to authenticated;

drop policy if exists jbm_profiles_select_own on public.jbm_member_profiles;
create policy jbm_profiles_select_own
  on public.jbm_member_profiles for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists jbm_profiles_insert_own on public.jbm_member_profiles;
create policy jbm_profiles_insert_own
  on public.jbm_member_profiles for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists jbm_profiles_update_own on public.jbm_member_profiles;
create policy jbm_profiles_update_own
  on public.jbm_member_profiles for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.orders
  add column if not exists full_name text,
  add column if not exists phone text;

create or replace function public.jbm_set_order_member_details()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  member_profile public.jbm_member_profiles%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Login diperlukan untuk membuat pesanan.';
  end if;

  new.user_id := auth.uid();
  new.email := coalesce(auth.jwt() ->> 'email', new.email);

  select *
    into member_profile
    from public.jbm_member_profiles
    where user_id = auth.uid();

  if not found or member_profile.phone is null then
    raise exception 'Lengkapi profil dan nomor HP sebelum membuat pesanan.';
  end if;

  new.full_name := member_profile.full_name;
  new.phone := member_profile.phone;

  if new.status is null then
    new.status := 'Menunggu Pembayaran';
  end if;

  if new.status <> 'Menunggu Pembayaran' then
    raise exception 'Status awal pesanan tidak valid.';
  end if;

  return new;
end;
$$;

drop trigger if exists jbm_set_order_member_details on public.orders;
create trigger jbm_set_order_member_details
  before insert on public.orders
  for each row execute function public.jbm_set_order_member_details();

alter table public.orders enable row level security;
revoke all on public.orders from public, anon, authenticated;
grant select, insert, update on public.orders to authenticated;

-- Restrictive policies constrain legacy permissive policies without deleting
-- policies whose behavior cannot be confirmed from this repository.
drop policy if exists jbm_orders_select_owner_or_admin on public.orders;
drop policy if exists jbm_orders_select_scope on public.orders;
drop policy if exists jbm_orders_insert_owner on public.orders;
drop policy if exists jbm_orders_insert_scope on public.orders;
drop policy if exists jbm_orders_update_admin on public.orders;
drop policy if exists jbm_orders_update_scope on public.orders;

create policy jbm_orders_select_owner_or_admin
  on public.orders as permissive for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.jbm_is_admin())
  );

create policy jbm_orders_select_scope
  on public.orders as restrictive for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.jbm_is_admin())
  );

create policy jbm_orders_insert_owner
  on public.orders as permissive for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'Menunggu Pembayaran'
  );

create policy jbm_orders_insert_scope
  on public.orders as restrictive for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'Menunggu Pembayaran'
  );

create policy jbm_orders_update_admin
  on public.orders as permissive for update to authenticated
  using ((select public.jbm_is_admin()))
  with check ((select public.jbm_is_admin()));

create policy jbm_orders_update_scope
  on public.orders as restrictive for update to authenticated
  using ((select public.jbm_is_admin()))
  with check ((select public.jbm_is_admin()));

do $$
declare
  admin_user_id uuid;
begin
  select id
    into admin_user_id
    from auth.users
    where lower(email) = lower('imadeyudha26@gmail.com')
    limit 1;

  if admin_user_id is null then
    raise exception 'Akun admin imadeyudha26@gmail.com harus sudah ada di Supabase Auth sebelum migrasi dijalankan.';
  end if;

  insert into public.jbm_user_roles (user_id, role)
    values (admin_user_id, 'admin')
    on conflict (user_id) do update set role = excluded.role;
end;
$$;
