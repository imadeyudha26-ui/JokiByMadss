-- Align the deployed order trigger and INSERT policies with the current
-- payment flow. Apply after the secure-orders and payment migrations.

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
    raise exception 'Status pembayaran awal tidak valid.';
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

notify pgrst, 'reload schema';
