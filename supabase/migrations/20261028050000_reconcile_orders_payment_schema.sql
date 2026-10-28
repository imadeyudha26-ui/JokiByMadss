-- Reconcile the deployed orders table with the current QRIS payment flow.
-- Safe to apply after any previous JokiByMadss migration, including partially
-- applied deployments. This migration preserves existing order rows.

alter table public.orders
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists payment_status text,
  add column if not exists payment_proof_path text,
  add column if not exists payment_submitted_at timestamptz,
  add column if not exists payment_reviewed_at timestamptz,
  add column if not exists payment_reviewed_by uuid;

do $$
declare
  missing_columns text;
begin
  select string_agg(required.column_name, ', ' order by required.column_name)
    into missing_columns
    from (values
      ('id'),
      ('user_id'),
      ('email'),
      ('status'),
      ('created_at'),
      ('item'),
      ('price'),
      ('nick'),
      ('game_id'),
      ('via'),
      ('bayar'),
      ('note'),
      ('full_name'),
      ('phone'),
      ('payment_status'),
      ('payment_proof_path'),
      ('payment_submitted_at'),
      ('payment_reviewed_at'),
      ('payment_reviewed_by')
    ) as required(column_name)
   where not exists (
     select 1
       from pg_attribute
      where attrelid = 'public.orders'::regclass
        and attname = required.column_name
        and attnum > 0
        and not attisdropped
   );

  if missing_columns is not null then
    raise exception 'Skema public.orders belum sesuai. Kolom wajib yang tidak ditemukan: %', missing_columns;
  end if;

  if to_regclass('public.jbm_member_profiles') is null then
    raise exception 'Tabel public.jbm_member_profiles belum tersedia. Terapkan migration secure member orders terlebih dahulu.';
  end if;

  if to_regprocedure('public.jbm_is_admin()') is null then
    raise exception 'Fungsi public.jbm_is_admin() belum tersedia. Terapkan migration secure member orders terlebih dahulu.';
  end if;

  if not exists (
    select 1
      from pg_constraint constraint_row
      join pg_attribute column_row
        on column_row.attrelid = constraint_row.conrelid
       and column_row.attname = 'payment_reviewed_by'
       and column_row.attnum = any (constraint_row.conkey)
     where constraint_row.conrelid = 'public.orders'::regclass
       and constraint_row.contype = 'f'
       and constraint_row.confrelid = 'auth.users'::regclass
  ) then
    alter table public.orders
      add constraint jbm_orders_payment_reviewed_by_fkey
      foreign key (payment_reviewed_by) references auth.users (id) not valid;
  end if;
end;
$$;

update public.orders
   set payment_status = 'Perlu Ditinjau'
 where payment_status is null;

alter table public.orders
  alter column payment_status set default 'Belum Dibayar',
  alter column payment_status set not null;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'jbm_orders_payment_status_allowed'
       and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint jbm_orders_payment_status_allowed
      check (payment_status in (
        'Belum Dibayar',
        'Menunggu Verifikasi',
        'Terverifikasi',
        'Ditolak',
        'Perlu Ditinjau'
      ));
  end if;
end;
$$;

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

  if new.status is distinct from 'Menunggu' then
    raise exception 'Status awal pesanan tidak valid.';
  end if;

  if new.payment_status is distinct from 'Belum Dibayar' then
    raise exception 'Status pembayaran awal pesanan tidak valid.';
  end if;

  new.full_name := member_profile.full_name;
  new.phone := member_profile.phone;
  new.payment_proof_path := null;
  new.payment_submitted_at := null;
  new.payment_reviewed_at := null;
  new.payment_reviewed_by := null;

  return new;
end;
$$;

drop trigger if exists jbm_set_order_member_details on public.orders;
create trigger jbm_set_order_member_details
  before insert on public.orders
  for each row execute function public.jbm_set_order_member_details();

create or replace function public.jbm_require_verified_payment_for_work()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if old.payment_status = 'Terverifikasi'
     and new.payment_status is distinct from old.payment_status
     and old.status in ('Diproses', 'Selesai')
     and new.status <> 'Dibatalkan' then
    raise exception 'Pembayaran tidak dapat diubah setelah pesanan mulai dikerjakan.';
  end if;

  if new.status is distinct from old.status
     and new.status in ('Diproses', 'Selesai')
     and new.payment_status is distinct from 'Terverifikasi' then
    raise exception 'Pembayaran harus diverifikasi sebelum pesanan diproses.';
  end if;

  return new;
end;
$$;

drop trigger if exists jbm_require_verified_payment_for_work on public.orders;
create trigger jbm_require_verified_payment_for_work
  before update on public.orders
  for each row execute function public.jbm_require_verified_payment_for_work();

alter table public.orders enable row level security;
revoke all on public.orders from public, anon, authenticated;
grant select, insert, update on public.orders to authenticated;

drop policy if exists jbm_orders_select_owner_or_admin on public.orders;
drop policy if exists jbm_orders_select_scope on public.orders;
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

drop policy if exists jbm_orders_insert_owner on public.orders;
drop policy if exists jbm_orders_insert_scope on public.orders;
create policy jbm_orders_insert_owner
  on public.orders as permissive for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'Menunggu'
    and payment_status = 'Belum Dibayar'
  );
create policy jbm_orders_insert_scope
  on public.orders as restrictive for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'Menunggu'
    and payment_status = 'Belum Dibayar'
  );

drop policy if exists jbm_orders_update_admin on public.orders;
drop policy if exists jbm_orders_update_scope on public.orders;
create policy jbm_orders_update_admin
  on public.orders as permissive for update to authenticated
  using ((select public.jbm_is_admin()))
  with check ((select public.jbm_is_admin()));
create policy jbm_orders_update_scope
  on public.orders as restrictive for update to authenticated
  using ((select public.jbm_is_admin()))
  with check ((select public.jbm_is_admin()));

create or replace function public.jbm_submit_payment_proof(
  p_order_id text,
  p_proof_path text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_order public.orders%rowtype;
  expected_prefix text;
begin
  if current_user_id is null then
    raise exception 'Login diperlukan untuk mengirim bukti pembayaran.';
  end if;

  select *
    into target_order
    from public.orders
   where id::text = p_order_id
     and user_id = current_user_id
   for update;

  if not found then
    raise exception 'Pesanan tidak ditemukan.';
  end if;

  if target_order.status = 'Dibatalkan' then
    raise exception 'Pesanan yang dibatalkan tidak dapat dibayar.';
  end if;

  if target_order.payment_status not in ('Belum Dibayar', 'Ditolak') then
    raise exception 'Bukti pembayaran sudah dikirim atau pembayaran sudah diverifikasi.';
  end if;

  expected_prefix := current_user_id::text || '/' || p_order_id || '/';
  if p_proof_path is null or left(p_proof_path, length(expected_prefix)) <> expected_prefix then
    raise exception 'Lokasi file bukti pembayaran tidak valid.';
  end if;

  if not exists (
    select 1
      from storage.objects
     where bucket_id = 'jbm-payment-proofs'
       and name = p_proof_path
  ) then
    raise exception 'File bukti pembayaran belum berhasil diunggah.';
  end if;

  update public.orders
     set payment_proof_path = p_proof_path,
         payment_status = 'Menunggu Verifikasi',
         payment_submitted_at = now(),
         payment_reviewed_at = null,
         payment_reviewed_by = null
   where id::text = p_order_id
     and user_id = current_user_id;
end;
$$;

revoke all on function public.jbm_submit_payment_proof(text, text) from public, anon;
grant execute on function public.jbm_submit_payment_proof(text, text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jbm-payment-proofs',
  'jbm-payment-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists jbm_payment_proofs_insert_owner on storage.objects;
create policy jbm_payment_proofs_insert_owner
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'jbm-payment-proofs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1
        from public.orders
       where id::text = (storage.foldername(name))[2]
         and user_id = (select auth.uid())
         and status <> 'Dibatalkan'
         and payment_status in ('Belum Dibayar', 'Ditolak')
    )
  );

drop policy if exists jbm_payment_proofs_select_owner_or_admin on storage.objects;
create policy jbm_payment_proofs_select_owner_or_admin
  on storage.objects for select to authenticated
  using (
    bucket_id = 'jbm-payment-proofs'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.jbm_is_admin())
    )
  );

drop policy if exists jbm_payment_proofs_select_scope on storage.objects;
create policy jbm_payment_proofs_select_scope
  on storage.objects as restrictive for select to public
  using (
    bucket_id <> 'jbm-payment-proofs'
    or case
      when (select auth.uid()) is null then false
      else
        (storage.foldername(name))[1] = (select auth.uid())::text
        or (select public.jbm_is_admin())
    end
  );

drop policy if exists jbm_payment_proofs_insert_scope on storage.objects;
create policy jbm_payment_proofs_insert_scope
  on storage.objects as restrictive for insert to public
  with check (
    bucket_id <> 'jbm-payment-proofs'
    or case
      when (select auth.uid()) is null then false
      else
        (storage.foldername(name))[1] = (select auth.uid())::text
        and exists (
          select 1
            from public.orders
           where id::text = (storage.foldername(name))[2]
             and user_id = (select auth.uid())
             and status <> 'Dibatalkan'
             and payment_status in ('Belum Dibayar', 'Ditolak')
        )
    end
  );

drop policy if exists jbm_payment_proofs_update_scope on storage.objects;
create policy jbm_payment_proofs_update_scope
  on storage.objects as restrictive for update to public
  using (bucket_id <> 'jbm-payment-proofs')
  with check (bucket_id <> 'jbm-payment-proofs');

drop policy if exists jbm_payment_proofs_delete_scope on storage.objects;
create policy jbm_payment_proofs_delete_scope
  on storage.objects as restrictive for delete to public
  using (bucket_id <> 'jbm-payment-proofs');

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
         from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'orders'
     ) then
    alter publication supabase_realtime add table public.orders;
  end if;

  if not exists (
    select 1
      from pg_trigger trigger_row
      join pg_proc function_row on function_row.oid = trigger_row.tgfoid
     where trigger_row.tgrelid = 'public.orders'::regclass
       and trigger_row.tgname = 'jbm_set_order_member_details'
       and not trigger_row.tgisinternal
       and function_row.oid = 'public.jbm_set_order_member_details()'::regprocedure
       and (trigger_row.tgtype & 4) = 4
       and (trigger_row.tgtype & 2) = 2
  ) then
    raise exception 'Trigger jbm_set_order_member_details belum terpasang sebagai BEFORE INSERT pada public.orders.';
  end if;
end;
$$;

notify pgrst, 'reload schema';
