-- Server-verified rank pricing for new orders. Existing orders are not rewritten.

alter table public.orders
  add column if not exists rank_from text,
  add column if not exists rank_to text,
  add column if not exists rank_stars integer;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'jbm_orders_rank_pair'
       and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint jbm_orders_rank_pair
      check (
        (rank_from is null and rank_to is null and rank_stars is null)
        or (
          rank_from is not null
          and rank_to is not null
          and rank_stars is not null
          and rank_stars > 0
        )
      );
  end if;
end;
$$;

create table if not exists public.jbm_rank_price_steps (
  rank_label text primary key,
  sort_order integer not null unique check (sort_order >= 0),
  stars_to_next integer not null check (stars_to_next >= 0),
  price_per_star bigint not null check (price_per_star >= 0)
);

alter table public.jbm_rank_price_steps enable row level security;
revoke all on public.jbm_rank_price_steps from public, anon, authenticated;
grant select on public.jbm_rank_price_steps to anon, authenticated;

drop policy if exists jbm_rank_price_steps_read on public.jbm_rank_price_steps;
create policy jbm_rank_price_steps_read
  on public.jbm_rank_price_steps
  for select
  to anon, authenticated
  using (true);

insert into public.jbm_rank_price_steps
  (rank_label, sort_order, stars_to_next, price_per_star)
values
  ('Warrior III', 0, 3, 1500),
  ('Warrior II', 1, 3, 1500),
  ('Warrior I', 2, 3, 1500),
  ('Elite III', 3, 3, 2000),
  ('Elite II', 4, 3, 2000),
  ('Elite I', 5, 3, 2000),
  ('Master IV', 6, 4, 2500),
  ('Master III', 7, 4, 2500),
  ('Master II', 8, 4, 2500),
  ('Master I', 9, 4, 2500),
  ('Grandmaster V', 10, 5, 3000),
  ('Grandmaster IV', 11, 5, 3000),
  ('Grandmaster III', 12, 5, 3000),
  ('Grandmaster II', 13, 5, 3000),
  ('Grandmaster I', 14, 5, 3000),
  ('Epic V', 15, 5, 4000),
  ('Epic IV', 16, 5, 4000),
  ('Epic III', 17, 5, 4000),
  ('Epic II', 18, 5, 4000),
  ('Epic I', 19, 5, 4000),
  ('Legend V', 20, 5, 6000),
  ('Legend IV', 21, 5, 6000),
  ('Legend III', 22, 5, 6000),
  ('Legend II', 23, 5, 6000),
  ('Legend I', 24, 5, 6000),
  ('Mythic', 25, 25, 8000),
  ('Mythical Honor', 26, 25, 14000),
  ('Mythical Glory', 27, 50, 14000),
  ('Mythical Immortal', 28, 0, 0)
on conflict (rank_label) do update
  set sort_order = excluded.sort_order,
      stars_to_next = excluded.stars_to_next,
      price_per_star = excluded.price_per_star;

create or replace function public.jbm_calculate_rank_price(
  p_rank_from text,
  p_rank_to text
)
returns table (rank_stars integer, amount bigint)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  start_order integer;
  target_order integer;
begin
  select rank_row.sort_order
    into start_order
    from public.jbm_rank_price_steps as rank_row
   where rank_row.rank_label = p_rank_from;

  select rank_row.sort_order
    into target_order
    from public.jbm_rank_price_steps as rank_row
   where rank_row.rank_label = p_rank_to;

  if start_order is null or target_order is null or target_order <= start_order then
    raise exception 'Rank awal atau tujuan tidak valid.';
  end if;

  return query
    select sum(rank_row.stars_to_next)::integer,
           sum(rank_row.stars_to_next::bigint * rank_row.price_per_star)::bigint
      from public.jbm_rank_price_steps as rank_row
     where rank_row.sort_order >= start_order
       and rank_row.sort_order < target_order;
end;
$$;

revoke all on function public.jbm_calculate_rank_price(text, text) from public, anon;
grant execute on function public.jbm_calculate_rank_price(text, text) to authenticated;

create or replace function public.jbm_set_order_member_details()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  member_profile public.jbm_member_profiles%rowtype;
  calculated_price record;
  is_rank_service boolean;
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

  new.item := coalesce(nullif(btrim(new.item), ''), 'Joki Rank');
  is_rank_service := new.item = 'Joki Rank'
    or left(new.item, 10) = 'Joki Rank '
    or new.item like 'Paket %';

  if is_rank_service then
    select *
      into calculated_price
      from public.jbm_calculate_rank_price(new.rank_from, new.rank_to);

    if calculated_price.amount is null or calculated_price.amount <= 0 then
      raise exception 'Tarif rank menghasilkan harga yang tidak valid.';
    end if;

    new.rank_stars := calculated_price.rank_stars;
    new.price := calculated_price.amount;
    new.final_price := calculated_price.amount;
  else
    if new.rank_from is not null or new.rank_to is not null or new.rank_stars is not null then
      raise exception 'Pilihan rank hanya dapat digunakan pada layanan joki rank.';
    end if;

    new.rank_stars := null;
    new.price := 0;
    new.final_price := null;
  end if;

  new.full_name := member_profile.full_name;
  new.phone := member_profile.phone;
  new.payment_proof_path := null;
  new.payment_submitted_at := null;
  new.payment_reviewed_at := null;
  new.payment_reviewed_by := null;
  new.legacy_payment_status := null;
  new.price_confirmed_at := null;
  new.price_confirmed_by := null;

  return new;
end;
$$;

drop trigger if exists jbm_set_order_member_details on public.orders;
create trigger jbm_set_order_member_details
  before insert on public.orders
  for each row execute function public.jbm_set_order_member_details();

create or replace function public.jbm_guard_order_final_price()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.rank_from is distinct from old.rank_from
     or new.rank_to is distinct from old.rank_to
     or new.rank_stars is distinct from old.rank_stars then
    raise exception 'Rank pesanan tidak dapat diubah setelah dibuat.';
  end if;

  if old.rank_from is not null or old.rank_to is not null then
    if new.price is distinct from old.price
       or new.final_price is distinct from old.final_price then
      raise exception 'Rank dan harga pesanan hasil kalkulasi tidak dapat diubah.';
    end if;

    new.price_confirmed_at := old.price_confirmed_at;
    new.price_confirmed_by := old.price_confirmed_by;
    return new;
  end if;

  if new.final_price is distinct from old.final_price then
    if not public.jbm_is_admin() then
      raise exception 'Hanya admin yang berwenang dapat menetapkan harga pesanan lama.';
    end if;

    if new.final_price is null or new.final_price <= 0 then
      raise exception 'Harga final harus lebih besar dari nol.';
    end if;

    if old.payment_status not in ('Belum Dibayar', 'Ditolak')
       or old.payment_submitted_at is not null
       or old.payment_proof_path is not null
       or old.status = 'Dibatalkan' then
      raise exception 'Harga final tidak dapat diubah setelah pembayaran diajukan atau pesanan ditutup.';
    end if;

    new.price_confirmed_at := now();
    new.price_confirmed_by := auth.uid();
  else
    new.price_confirmed_at := old.price_confirmed_at;
    new.price_confirmed_by := old.price_confirmed_by;
  end if;

  return new;
end;
$$;

drop trigger if exists jbm_guard_order_final_price on public.orders;
create trigger jbm_guard_order_final_price
  before update on public.orders
  for each row execute function public.jbm_guard_order_final_price();

notify pgrst, 'reload schema';
