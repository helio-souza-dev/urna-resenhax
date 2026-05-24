-- ====================================================
--  VotoSec — Schema Supabase (PostgreSQL)
--  Execute no SQL Editor do seu projeto Supabase
-- ====================================================

-- CANDIDATOS
create table if not exists candidatos (
  id        serial primary key,
  numero    text unique not null,
  nome      text not null,
  partido   text not null,
  bio       text,
  projetos  text[], -- array de strings
  foto_url  text,
  created_at timestamptz default now()
);

-- ELEITORES
create table if not exists eleitores (
  id        serial primary key,
  nome      text not null,
  cpf       text unique not null,
  nasc      date,
  titulo    text,
  zona      text,
  email     text,
  votou     boolean default false,
  created_at timestamptz default now()
);

-- VOTOS
create table if not exists votos (
  id             serial primary key,
  cpf_eleitor    text not null references eleitores(cpf),
  nome_eleitor   text not null,
  numero_cand    text not null,
  nome_cand      text not null,
  partido_cand   text,
  ts             timestamptz default now()
);

-- ====================================================
--  RLS (Row Level Security)
-- ====================================================
alter table candidatos enable row level security;
alter table eleitores  enable row level security;
alter table votos      enable row level security;

-- Admins (via service_role) têm acesso total
-- Para o nosso jogo RP, vamos permitir acesso total (leitura e gravação) de forma anônima
create policy "candidatos_all" on candidatos
  for all using (true) with check (true);

create policy "eleitores_all" on eleitores
  for all using (true) with check (true);

create policy "votos_all" on votos
  for all using (true) with check (true);

-- ====================================================
--  FUNÇÕES AUXILIARES
-- ====================================================

-- Conta votos por candidato
create or replace function contagem_votos()
returns table(numero text, nome text, partido text, total bigint) as $$
  select numero_cand, nome_cand, partido_cand, count(*) as total
  from votos
  where numero_cand != 'BRANCO'
  group by numero_cand, nome_cand, partido_cand
  order by total desc;
$$ language sql security definer;

-- Participação
create or replace function participacao()
returns json as $$
  select json_build_object(
    'total_eleitores', (select count(*) from eleitores),
    'total_votos',     (select count(*) from votos),
    'votaram',         (select count(*) from eleitores where votou = true),
    'brancos',         (select count(*) from votos where numero_cand = 'BRANCO')
  );
$$ language sql security definer;
