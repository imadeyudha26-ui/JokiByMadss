-- Repair deployments where the payment migration was only partially applied.
-- Safe to run after 20261028010000_order_payments_profiles.sql.

alter table public.orders
  add column if not exists payment_status text;

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
     where conname = 'orders_payment_status_allowed'
       and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_payment_status_allowed
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

notify pgrst, 'reload schema';
